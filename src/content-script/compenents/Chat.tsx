import { useState, useCallback, useEffect, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { RocketIcon } from '@primer/octicons-react'
import { ConfigProvider, Input, Space, Button, Spin, Alert } from 'antd'
import Browser from 'webextension-polyfill'
import { QueryStatus } from '@/content-script/compenents/ChatGPTQuery'
import { qaPrompt, qaSummaryPrompt } from '@/utils/prompt'
import { OpenAI } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { queryParam } from 'gb-url'
import { getPDFText } from '@/utils/utils'
import { getPageSummaryContent } from '@/content-script/utils'
import { getSummaryPrompt } from '@/content-script/prompt'
import {
  UserConfig,
  getProviderConfigs,
  ProviderType,
  ProviderConfigs,
  DEFAULT_API_HOST,
} from '@/config'
import getQuestion from './GetQuestion'
import { AppContext } from '@/content-script/model/AppProvider/Context'

interface Props {
  userConfig: UserConfig | undefined
  allContent?: string
  status: QueryStatus
}
interface ChatList {
  role: string
  id: string
  content: string
}

let vectorStoreData: MemoryVectorStore | null

const modelParams = {
  temperature: 0.2,
  max_tokens: 800,
  top_p: 0.5,
  frequency_penalty: 0,
  presence_penalty: 0,
  n: 2,
  best_of: 2,
}

function Chat(prop: Props) {
  const { userConfig, allContent, status } = prop
  const [chatList, setChatList] = useState<ChatList[]>([])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [config, setConfig] = useState<ProviderConfigs>()
  const [newChatIndex, setNewChatIndex] = useState(0)
  const [openAIApiKey, setOpenAIApiKey] = useState('')
  const [continueConversation, setContinueConversation] = useState(false)
  const { conversationId } = useContext(AppContext)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
    scrollToBottom()
  }, [])

  const getAnswer = useCallback(
    async (answerList: string[]) => {
      const apiHost = config?.configs[ProviderType.GPT3]?.apiHost || DEFAULT_API_HOST
      const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey

      const questionPrompt = qaSummaryPrompt({
        question,
        answerList: answerList.join(''),
        language: userConfig?.language || 'en',
      })

      const response = await fetch(`https://${apiHost}/v1/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          ...modelParams,
          ...{ model: 'text-davinci-003', prompt: questionPrompt },
        }),
      })

      const res = await response.json()

      setLoading(false)
      setAnswer(() => res?.text || res?.output_text || (res?.choices && res?.choices[0]?.text))
      console.log('setAnswer', answer)

      scrollToBottom()
    },
    [answer, config?.configs, question, userConfig?.language],
  )

  const getChat = useCallback(async () => {
    setLoading(true)
    setAnswer('')

    const providerConfigs = await getProviderConfigs()
    const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey
    const answerList: string[] = []
    let chainText = allContent

    const openAiModel = new OpenAI({
      ...{ modelParams },
      ...{
        openAIApiKey,
        // streaming: true,
        callbacks: [
          {
            async handleLLMNewToken(token: string) {
              console.log('token', String(token))
            },
            async handleLLMError(error: string) {
              console.log('error', error)
            },
            handleLLMEnd(res) {
              const text = res?.generations && res?.generations[0] && res?.generations[0][0]?.text
              console.log('end', text)
              answerList.push(text)
            },
          },
        ],
      },
    })

    if (vectorStoreData) {
      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQARefineChain(openAiModel, {
          questionPrompt: qaPrompt(userConfig?.language || 'en'),
          refinePrompt: qaPrompt(userConfig?.language || 'en'),
        }),
        retriever: vectorStoreData?.asRetriever(),
      })

      await chain.call({
        query: question,
      })

      await getAnswer(answerList)
      return
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

    const questionData = await getQuestion()

    // PDF
    const pageUrl = location.href
    const pdfUrl = queryParam('file', pageUrl)
    if (
      /^(chrome-extension:\/\/)(\s|\S)+\/pdf\/web\/viewer.html\?file=(\s|\S)+/.test(pageUrl) &&
      pdfUrl
    ) {
      const pdfText = (await getPDFText(pdfUrl))?.replace(/(<[^>]+>|\{[^}]+\})/g, '')
      chainText = getSummaryPrompt(pdfText, providerConfigs, false)
    } else if (questionData?.allContent) {
      chainText = getSummaryPrompt(questionData?.allContent, providerConfigs, false) || ''
    } else {
      const pageContent = await getPageSummaryContent()
      chainText = getSummaryPrompt(pageContent?.content, providerConfigs, false) || ''
    }

    console.log('chainText', chainText)

    const docs = await textSplitter.createDocuments([chainText])
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey,
      }),
    )

    vectorStoreData = vectorStore

    const chain = new RetrievalQAChain({
      combineDocumentsChain: loadQARefineChain(openAiModel, {
        questionPrompt: qaPrompt(userConfig?.language || 'en'),
        refinePrompt: qaPrompt(userConfig?.language || 'en'),
      }),
      // returnSourceDocuments: true,
      retriever: vectorStore.asRetriever(),
    })

    await chain.call({
      query: question,
    })

    await getAnswer(answerList)

    // return res?.text || res?.output_text || (res?.choices && res?.choices[0]?.text)
  }, [allContent, config?.configs, getAnswer, question, userConfig?.language])

  const onSubmit = useCallback(async () => {
    if (question.trim() === '') {
      return
    }

    setChatList((chatList) => {
      setNewChatIndex(chatList.length + 1)
      return [
        ...chatList,
        { role: 'user', id: '1', content: question },
        { role: 'robot', id: '1', content: '' },
      ]
    })
    setQuestion('')
    setLoading(true)

    scrollToBottom()

    await getChat()
    setLoading(false)
  }, [getChat, question])

  const onKeyDown = useCallback(
    (e) => {
      console.log('onKeyDown e', e)
      if (e.key === 'Enter') {
        onSubmit()
      }
    },
    [onSubmit],
  )

  const scrollToBottom = () => {
    const ele = document.querySelector('div.glarity--card__content')
    console.log('ele', ele)

    setTimeout(() => {
      ele?.scrollTo({
        top: 10000,
        behavior: 'smooth',
      })
    }, 100)
  }

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  useEffect(() => {
    if (chatList.length <= 0) {
      return
    }

    setChatList((chatList) => {
      const newChatList = chatList
      newChatList[newChatIndex].content = answer
      return [...newChatList]
    })
  }, [answer, chatList, newChatIndex])

  useEffect(() => {
    async function getConfig() {
      const config = await getProviderConfigs()
      console.log('config getProviderConfigs', config)
      setConfig(config)
      setOpenAIApiKey(config?.configs[ProviderType.GPT3]?.apiKey || '')
    }

    getConfig()
  }, [])

  useEffect(() => {
    if (userConfig) setContinueConversation(userConfig?.continueConversation)
  }, [userConfig])

  return (
    <>
      <ConfigProvider prefixCls="glarity-" iconPrefixCls="glarity--icon-">
        {
          config?.provider === 'gpt3' ? (
            <div className="glarity--container">
              <div className="glarity--chatgpt glarity--nodrag">
                {/* <Alert
                  message="Warning"
                  description="Using this feature will consume your API key."
                  type="warning"
                  showIcon
                  closable
                  action={
                    <Button
                      size="small"
                      type="link"
                      href="https://openai.com/pricing"
                      target="_blank"
                    >
                      Pricing
                    </Button>
                  }
                /> */}
                <div className="glarity--chat">
                  {chatList.map((item, index) => (
                    <div
                      className={classNames('glarity--chat__item', {
                        'glarity--chat__item--user': item.role === 'user',
                      })}
                      key={index}
                    >
                      <div className="glarity--chat__item--message">
                        {item.content ? (
                          item.content
                        ) : (
                          // <span className={'glarity--cursor__blink'}>|</span>
                          <Spin size="small" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Please enter a question"
                    value={question}
                    onChange={onChange}
                    disabled={loading}
                    onKeyDown={onKeyDown}
                  />
                  <Button
                    type="primary"
                    onClick={onSubmit}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                    // icon={loading ? <Spin size="small" /> : <RocketIcon size={16} />}
                    icon={<RocketIcon size={16} />}
                  ></Button>
                </Space.Compact>

                <div className="glarity--footer__tips">
                  {/* You can get a better experience with{' '}
                  <a href="https://gptbase.ai" target={'_blank'} rel="noreferrer">
                    GPTBase
                  </a>
                  .  */}
                  Note: The asking function will consume your key quota.
                </div>
              </div>
            </div>
          ) : (
            <>
              {continueConversation && conversationId && status === 'done' && (
                <div className="glarity--flex" style={{ 'justify-content': 'center' }}>
                  <a
                    href={`https://chat.openai.com/c/${conversationId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Continue to ask questions in ChatGPT
                  </a>
                </div>
              )}
            </>
          )
          // (
          //   <Alert
          //     message="Warning"
          //     description="To use the Q&A feature you need to go to extension options to configure the API key."
          //     type="warning"
          //     showIcon
          //     closable
          //     action={
          //       <Button size="small" onClick={openOptionsPage}>
          //         Options
          //       </Button>
          //     }
          //   />
          // )
        }
      </ConfigProvider>
    </>
  )
}

export default Chat
