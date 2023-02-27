import { LightBulbIcon, SearchIcon } from '@primer/octicons-react'
import { useState, useEffect } from 'preact/hooks'
import { TriggerMode } from '../config'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'
import { endsWithQuestionMark } from './utils.js'

interface Props {
  question: string
  triggerMode: TriggerMode
  onStatusChange?: (status: QueryStatus) => void
  run: (isRefresh?: boolean) => Promise<void>
  isRefresh?: boolean
  currentTime?: number
}

function ChatGPTCard(props: Props) {
  const { isRefresh, triggerMode, question, onStatusChange, run, currentTime } = props

  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (isRefresh && currentTime) setTriggered(true)
  }, [currentTime, isRefresh])

  if (triggerMode === TriggerMode.Always) {
    return (
      <ChatGPTQuery isRefresh={isRefresh} question={question} onStatusChange={onStatusChange} />
    )
  }
  if (triggerMode === TriggerMode.QuestionMark) {
    if (endsWithQuestionMark(question.trim())) {
      return (
        <ChatGPTQuery isRefresh={isRefresh} question={question} onStatusChange={onStatusChange} />
      )
    }
    return (
      <p className="icon-and-text">
        <LightBulbIcon size="small" /> Trigger ChatGPT by appending a question mark after your query
      </p>
    )
  }
  if (triggered) {
    return (
      <>
        <ChatGPTQuery
          currentTime={currentTime}
          isRefresh={isRefresh}
          question={question}
          onStatusChange={onStatusChange}
        />
      </>
    )
  }
  return (
    <a
      href="javascript:;"
      onClick={() => {
        setTriggered(true)
        run(true)
      }}
    >
      <SearchIcon size="small" /> Ask ChatGPT to summarize
    </a>
  )
}

export default ChatGPTCard
