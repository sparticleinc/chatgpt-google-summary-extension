import { useState, useCallback, useEffect, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { RocketIcon } from '@primer/octicons-react'
import { ConfigProvider, Input, Space, Button, Spin, Alert } from 'antd'
import Browser from 'webextension-polyfill'
import { QueryStatus } from '@/content-script/compenents/ChatGPTQuery'
import { qaChatGPTPrompt, qaSummaryPrompt } from '@/utils/prompt'
import { OpenAI } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { queryParam } from 'gb-url'
import { getPDFText, getLastUserQuestion, isPdfViewer } from '@/utils/utils'
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
import Error from './Error'
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
  error: string
}

let vectorStoreData: MemoryVectorStore | null

const modelParams = {
  temperature: 0.2,
  max_tokens: 800,
  // top_p: 0.5,
  // frequency_penalty: 0,
  // presence_penalty: 0,
  // n: 2,
  // best_of: 2,
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
  const [chatGPTPrompt, setChatGPTPrompt] = useState('')
  const [gptStatus, setGptStatus] = useState<QueryStatus>()
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const { setConversationId, setMessageId, conversationId, messageId } = useContext(AppContext)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
    scrollToBottom()
  }, [])

  const getContentText = useCallback(
    async ({ isTruncate, config }: { isTruncate: boolean; config?: ProviderConfigs }) => {
      const questionData = await getQuestion()
      let text = ''

      console.log('getContentText', questionData, isTruncate, config)

      // PDF
      const pageUrl = location.href
      const pdfUrl = queryParam('file', pageUrl)
      if (isPdfViewer(pageUrl) && pdfUrl) {
        const pdfText = (await getPDFText(pdfUrl))?.replace(/(<[^>]+>|\{[^}]+\})/g, '')
        text = getSummaryPrompt(pdfText, config, isTruncate)
      } else if (questionData && questionData?.allContent) {
        text = getSummaryPrompt(questionData?.allContent, config, isTruncate) || ''
      } else {
        const pageContent = await getPageSummaryContent()
        text = getSummaryPrompt(pageContent?.content, config, isTruncate) || ''
      }

      return new Promise<string>((resolve) => {
        resolve(text)
      })
    },
    [],
  )

  const getChainMergeAnswer = useCallback(
    async (answerList: string[]) => {
      const apiHost = config?.configs[ProviderType.GPT3]?.apiHost || DEFAULT_API_HOST
      const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey

      const questionPrompt = qaSummaryPrompt({
        question,
        answerList: answerList.join(''),
        language: userConfig?.language,
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

  const getChainAnswer = useCallback(async () => {
    const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey
    const answerList: string[] = []
    // let chainText = allContent

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
          // questionPrompt: qaPrompt(userConfig?.language),
          // refinePrompt: qaPrompt(userConfig?.language),
        }),
        retriever: vectorStoreData?.asRetriever(),
      })

      await chain.call({
        query: question,
      })

      await getChainMergeAnswer(answerList)
      return
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

    const chainText = await getContentText({ isTruncate: false, config })

    console.log('chainText', chainText)
    if (!chainText) {
      setLoading(false)
      setError('NOTSUPPORTED')
      return
    }

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
        // questionPrompt: qaPrompt(userConfig?.language),
        // refinePrompt: qaPrompt(userConfig?.language),
      }),
      // returnSourceDocuments: true,
      retriever: vectorStore.asRetriever(),
    })

    await chain.call({
      query: question,
    })

    await getChainMergeAnswer(answerList)
  }, [allContent, config, getChainMergeAnswer, getContentText, question])

  const getChatGPT = useCallback(async () => {
    const lastUserQuestion = getLastUserQuestion(chatList)?.content
    const userQuestion = question || lastUserQuestion

    if (!userQuestion) {
      setLoading(false)
      setError('NOTSUPPORTED')
      return
    }

    const qaPrompt = qaChatGPTPrompt({
      question: userQuestion,
      content: conversationId ? '' : chatGPTPrompt,
      language: userConfig?.language,
    })

    console.log('qaPrompt', qaPrompt)

    // setConversationId('xxxxxxxxxxxxx')
    // setLoading(false)
    // setError('error' || 'CLOUDFLARE')
    // return

    const port = Browser.runtime.connect()
    const listener = (msg: any) => {
      if (msg.text) {
        const text = msg.text
        setAnswer(text)
        setGptStatus('success')

        setConversationId(msg.conversationId)
        setMessageId(msg.messageId)
      } else if (msg.error) {
        setError(msg.error)
        setLoading(false)
        setGptStatus('error')

        console.log('error', msg)
      } else if (msg.event === 'DONE') {
        console.log('done', msg)
        setGptStatus('done')
        setLoading(false)
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: qaPrompt, conversationId, messageId })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [question, chatGPTPrompt])

  const getAnswer = useCallback(async () => {
    if (config?.provider === ProviderType.GPT3) {
      try {
        await getChainAnswer()
      } catch (error) {
        console.log('getAnswer', error)
        const errorMessage = (error?.message || '').includes('401') ? '401' : error?.message
        setError(errorMessage)
      }
      setLoading(false)
      return
    }

    await getChatGPT()
  }, [config?.provider, getChainAnswer, getChatGPT])

  const onSubmit = useCallback(async () => {
    if (question.trim() === '') {
      return
    }

    setChatList((chatList) => {
      setNewChatIndex(chatList.length + 1)
      return [
        ...chatList,
        { role: 'user', id: '1', content: question, error: '' },
        { role: 'robot', id: '1', content: '', error: '' },
      ]
    })
    setQuestion('')
    setAnswer('')
    setError('')
    setLoading(true)

    scrollToBottom()

    await getAnswer()
  }, [question, getAnswer])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onSubmit()
      }
    },
    [onSubmit],
  )

  const scrollToBottom = () => {
    const ele = document.querySelector('div.glarity--card__content')

    setTimeout(() => {
      ele?.scrollTo({
        top: 10000,
        behavior: 'smooth',
      })
    }, 100)
  }

  useEffect(() => {
    if (chatList.length <= 0) {
      return
    }

    setChatList((chatList) => {
      const newChatList = chatList
      newChatList[newChatIndex].content = answer || error
      newChatList[newChatIndex].error = error
      return [...newChatList]
    })
  }, [answer, chatList, error, newChatIndex])

  useEffect(() => {
    async function getConfig() {
      const config = await getProviderConfigs()
      console.log('config getProviderConfigs', config)
      setConfig(config)
      setOpenAIApiKey(config?.configs[ProviderType.GPT3]?.apiKey || '')

      if (config.provider === ProviderType.GPT3) {
        return
      }

      const chatGPTPrompt = await getContentText({ isTruncate: true, config })
      setChatGPTPrompt(chatGPTPrompt)
    }

    getConfig()
  }, [getContentText])

  useEffect(() => {
    if (answer) {
      scrollToBottom()
    }
  }, [answer])

  useEffect(() => {
    if (retry > 0) {
      setAnswer('')
      setError('')
      setLoading(true)
      getAnswer()
    }
  }, [retry, getAnswer])

  return (
    <>
      <ConfigProvider prefixCls="glarity-" iconPrefixCls="glarity--icon-">
        <>
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
                      {item.error ? (
                        <Error
                          error={error}
                          setError={setError}
                          retry={retry}
                          setRetry={setRetry}
                          type={config?.provider}
                        />
                      ) : item.content ? (
                        item.content
                      ) : (
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
                  disabled={loading || !!error}
                  onKeyDown={onKeyDown}
                />
                <Button
                  type="primary"
                  onClick={onSubmit}
                  onKeyDown={onKeyDown}
                  disabled={loading || !!error}
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
                {config?.provider === ProviderType.GPT3
                  ? `Note: The asking feature will consume more your key quota.`
                  : `Note: Using the API key pattern will give you more accurate answers.`}
              </div>
            </div>
          </div>

          {/*        
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
          //   /> */}
        </>
      </ConfigProvider>
    </>
  )
}

export default Chat
