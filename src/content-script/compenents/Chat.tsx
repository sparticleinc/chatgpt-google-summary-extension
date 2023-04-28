import { useState, useCallback, useEffect, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { RocketIcon } from '@primer/octicons-react'
import { ConfigProvider, Input, Space, Button } from 'antd'
import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PromptTemplate } from 'langchain/prompts'

// const openAimModel = new OpenAI({
//   openAIApiKey: '',
//   temperature: 0,
//   modelName: 'gpt-3.5-turbo',
//   // streaming: true,
// })

interface ChatList {
  role: string
  id: string
  content: string
}

const chatListMock = [
  { role: 'user', id: '1', content: 'google 是谁' },
  { role: 'robot', id: '1', content: 'Google 是一家美国跨国科技企业。' },
]

function Chat() {
  const [chatList, setChatList] = useState<ChatList[]>(chatListMock)
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
  }, [])

  const onSubmit = useCallback(() => {
    if (question.trim() === '') {
      return
    }
    setChatList([...chatList, { role: 'user', id: '1', content: question }])
    setQuestion('')
    setLoading(true)

    setTimeout(() => {
      setChatList((chatList) => {
        return [...chatList, { role: 'robot', id: '1', content: '哈哈哈，我不知道呀' }]
      })
      setLoading(false)
    }, 2000)
  }, [chatList, question])

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
                  <div className="glarity--chat__item--message">{item.content}</div>
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
