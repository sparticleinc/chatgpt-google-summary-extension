import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { RocketIcon } from '@primer/octicons-react'
import { ConfigProvider, Input, Space, Button, Spin } from 'antd'
import { textShort } from '@/content-script/utils'
import { qaPrompt } from '@/content-script/prompt'
import { OpenAI } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { loadQAStuffChain } from 'langchain/chains'
import { RetrievalQAChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { UserConfig, getProviderConfigs, ProviderType, ProviderConfigs } from '@/config'

interface Props {
  userConfig: UserConfig
}
interface ChatList {
  role: string
  id: string
  content: string
}

let vectorStoreData: MemoryVectorStore

function Chat(prop: Props) {
  const { userConfig } = prop
  const [chatList, setChatList] = useState<ChatList[]>([])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [config, setConfig] = useState<ProviderConfigs>()
  const [newChatIndex, setNewChatIndex] = useState(0)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
  }, [])

  const getChat = useCallback(async () => {
    setLoading(true)
    setAnswer('')
    const openAIApiKey = config?.configs[ProviderType.GPT3]?.apiKey

    const openAiModel = new OpenAI({
      openAIApiKey,
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            setAnswer((answer) => {
              return answer + token
            })
          },
        },
      ],
    })

    if (vectorStoreData) {
      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQAStuffChain(openAiModel, {
          prompt: qaPrompt(userConfig.language),
        }),
        retriever: vectorStoreData?.asRetriever(),
      })

      const res = await chain.call({
        query: question,
      })

      return res.text || res.output_text || res.choices[0].text
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

    const docs = await textSplitter.createDocuments([textShort])
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey,
      }),
    )

    vectorStoreData = vectorStore

    const chain = loadQAStuffChain(openAiModel, {
      prompt: qaPrompt(userConfig.language),
    })
    const res = await chain.call({
      input_documents: docs,
      question,
    })

    return res.text || res.output_text || res.choices[0].text
  }, [config?.configs, question, userConfig.language])

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

    await getChat()
    setLoading(false)
  }, [getChat, question])

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
