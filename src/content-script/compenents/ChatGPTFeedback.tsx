import {
  ThumbsdownIcon,
  ThumbsupIcon,
  CopyIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SkipFillIcon,
} from '@primer/octicons-react'
import { memo } from 'react'
import { useEffect, useCallback, useState } from 'preact/hooks'
import classNames from 'classnames'
import Browser from 'webextension-polyfill'
import type { QueryStatus } from './ChatGPTQuery'
import { getSessionValue } from '@/config'

interface Props {
  messageId: string
  conversationId: string
  answerText: string
  showContent?: boolean
  setShowContent?: (state: boolean) => void
  status: QueryStatus
  setStatus: (status: QueryStatus) => void
}

function ChatGPTFeedback(props: Props) {
  const { showContent, setShowContent, status, setStatus } = props
  const [copied, setCopied] = useState(false)
  const [action, setAction] = useState<'thumbsUp' | 'thumbsDown' | null>(null)
  const [stopStatus, setStopStatus] = useState<QueryStatus>(status)

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

  const clickStop = useCallback(async () => {
    const taskId = await getSessionValue('taskId')

    setStatus('done')
    setStopStatus('done')

    await Browser.runtime.sendMessage({
      type: 'STOP_TASK',
      data: {
        taskId,
      },
    })
  }, [setStatus])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  useEffect(() => {
    setStopStatus(status)
  }, [status])

  return (
    <div className="gpt--feedback glarity--nodrag">
      {stopStatus === 'success' && (
        <span
          onClick={clickStop}
          className={classNames('glarity--blink', 'glarity--btn', 'glarity--btn__default')}
        >
          <SkipFillIcon size={12} /> Stop
        </span>
      )}

      {(stopStatus === 'done' || stopStatus === 'error') && (
        <>
          <span
            onClick={clickThumbsUp}
            className={action === 'thumbsUp' ? 'gpt--feedback--selected' : undefined}
          >
            <ThumbsupIcon size={13} />
          </span>
          <span
            onClick={clickThumbsDown}
            className={action === 'thumbsDown' ? 'gpt--feedback--selected' : undefined}
          >
            <ThumbsdownIcon size={13} />
          </span>

          <span onClick={clickCopyToClipboard}>
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          </span>
        </>
      )}

      <span onClick={switchShowContent}>
        {showContent ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
      </span>
    </div>
  )
}

export default memo(ChatGPTFeedback)
