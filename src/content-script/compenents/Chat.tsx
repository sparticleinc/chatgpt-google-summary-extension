import { useState, useCallback, useEffect, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { RocketIcon } from '@primer/octicons-react'
import { ConfigProvider, Input, Space, Button, Spin } from 'antd'
import { qaPrompt, qaSummaryPrompt } from '@/utils/prompt'
import { OpenAI } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RetrievalQAChain, loadQARefineChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import {
  UserConfig,
  getProviderConfigs,
  ProviderType,
  ProviderConfigs,
  DEFAULT_API_HOST,
} from '@/config'
import { AppContext } from '@/content-script/model/AppProvider/Context'

interface Props {
  userConfig: UserConfig | undefined
  allContent: string
}
interface ChatList {
  role: string
  id: string
  content: string
}

let vectorStoreData: MemoryVectorStore

const modelParams = {
  temperature: 0.2,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
}

function Chat(prop: Props) {
  const { userConfig, allContent } = prop
  const [chatList, setChatList] = useState<ChatList[]>([])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [config, setConfig] = useState<ProviderConfigs>()
  const [newChatIndex, setNewChatIndex] = useState(0)
  const { setIsScroll } = useContext(AppContext)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
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
      setAnswer(res?.text || res?.output_text || (res?.choices && res?.choices[0]?.text))
      setIsScroll(true)
    },
    [config?.configs, question, setIsScroll, userConfig?.language],
  )

  const getChat = useCallback(async () => {
    setLoading(true)
    setAnswer('')
    const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey
    const answerList: string[] = []

    const openAiModel = new OpenAI({
      ...{ modelParams },
      ...{
        openAIApiKey,
        // streaming: true,
        callbacks: [
          {
            async handleLLMNewToken(token: string) {
              console.log('token', String(token))

              // setAnswer((answer) => {
              //   if (!token) {
              //     setIsScroll(false)
              //   }

              //   return answer + token
              // })
            },
            async handleLLMError(error: string) {
              console.log('error', error)
            },
            handleLLMEnd(res) {
              console.log('end', res)
              const text = res?.generations && res?.generations[0] && res?.generations[0][0]?.text

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

      // return res?.text || res?.output_text || (res?.choices && res?.choices[0]?.text)
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

    console.log('allContent', allContent)

    const docs = await textSplitter.createDocuments([allContent])
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
    setIsScroll(true)

    await getChat()
    setLoading(false)
  }, [getChat, question, setIsScroll])

  useEffect(() => {
    if (chatList.length <= 0) {
      return
    }

    setChatList((chatList) => {
      const newChatList = chatList
      newChatList[newChatIndex].content = answer
      // setIsScroll(true)
      return [...newChatList]
    })
  }, [answer, chatList, newChatIndex, setIsScroll])

  useEffect(() => {
    async function getConfig() {
      const config = await getProviderConfigs()
      setConfig(config)
    }

    getConfig()
  }, [])

  return (
    <>
      <ConfigProvider prefixCls="glarity-" iconPrefixCls="glarity--icon-">
        <div className="glarity--container">
          <div className="glarity--chatgpt glarity--nodrag">
            <div className="glarity--chat">
              {chatList.map((item, index) => (
                <div
                  className={classNames('glarity--chat__item', {
                    'glarity--chat__item--user': item.role === 'user',
                  })}
                  key={index}
                >
                  <div className="glarity--chat__item--message">
                    {item.content ? item.content : <Spin size="small" />}
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
              />
              <Button
                type="primary"
                onClick={onSubmit}
                loading={loading}
                icon={<RocketIcon size={16} />}
              ></Button>
            </Space.Compact>
          </div>
        </div>
      </ConfigProvider>
    </>
  )
}

export default Chat
