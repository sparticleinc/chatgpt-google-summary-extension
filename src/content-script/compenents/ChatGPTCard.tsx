import { SearchIcon } from '@primer/octicons-react'
import { useContext, useEffect } from 'preact/hooks'
import { AppContext } from '@/content-script/model/AppProvider/Context'
import { TriggerMode } from '@/config'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'

interface Props {
  question: string
  triggerMode: TriggerMode
  onStatusChange?: (status: QueryStatus) => void
}

function ChatGPTCard(props: Props) {
  const { triggerMode, question, onStatusChange } = props
  const { triggered, setTriggered } = useContext(AppContext)

  useEffect(() => {
    console.log('Card triggered', triggered)
  }, [triggered])

  if (triggerMode === TriggerMode.Always) {
    return <ChatGPTQuery question={question} onStatusChange={onStatusChange} />
  }

  if (triggered) {
    return (
      <>
        <ChatGPTQuery question={question} onStatusChange={onStatusChange} />
      </>
    )
  }
  return (
    <a
      href="javascript:;"
      onClick={async () => {
        setTriggered(true)
      }}
    >
      <SearchIcon size="small" /> Ask ChatGPT to summarize
    </a>
  )
}

export default ChatGPTCard
