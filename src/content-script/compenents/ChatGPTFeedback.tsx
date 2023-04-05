import {
  ThumbsdownIcon,
  ThumbsupIcon,
  CopyIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@primer/octicons-react'
import { memo } from 'react'
import { useEffect, useCallback, useState } from 'preact/hooks'
import Browser from 'webextension-polyfill'

interface Props {
  messageId: string
  conversationId: string
  answerText: string
  showContent?: boolean
  setShowContent?: (show: boolean) => void
}

function ChatGPTFeedback(props: Props) {
  const { showContent, setShowContent } = props
  const [copied, setCopied] = useState(false)
  const [action, setAction] = useState<'thumbsUp' | 'thumbsDown' | null>(null)

  const clickThumbsUp = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsUp')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsUp',
      },
    })
  }, [action, props.conversationId, props.messageId])

  const clickThumbsDown = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsDown')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsDown',
        text: '',
        tags: [],
      },
    })
  }, [action, props.conversationId, props.messageId])

  const clickCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(props.answerText)
    setCopied(true)
  }, [props.answerText])

  const switchShowContent = () => {
    setShowContent((state) => !state)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div className="gpt--feedback">
      <span
        onClick={clickThumbsUp}
        className={action === 'thumbsUp' ? 'gpt--feedback--selected' : undefined}
      >
        <ThumbsupIcon size={14} />
      </span>
      <span
        onClick={clickThumbsDown}
        className={action === 'thumbsDown' ? 'gpt--feedback--selected' : undefined}
      >
        <ThumbsdownIcon size={14} />
      </span>
      <span onClick={clickCopyToClipboard}>
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </span>

      <span onClick={switchShowContent}>
        {showContent ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
      </span>
    </div>
  )
}

export default memo(ChatGPTFeedback)
