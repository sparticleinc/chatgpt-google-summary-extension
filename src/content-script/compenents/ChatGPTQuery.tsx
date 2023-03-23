import { useEffect, useState, useCallback } from 'preact/hooks'
import { memo, useMemo } from 'react'
import { Loading, Button } from '@geist-ui/core'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '@/messaging'
import ChatGPTFeedback from './ChatGPTFeedback'
import { debounce } from 'lodash-es'
import { isBraveBrowser, shouldShowRatingTip } from '@/content-script/utils'
import { BASE_URL } from '@/config'
import { isIOS } from '@/utils/utils'
import '@/content-script/styles.scss'

export type QueryStatus = 'success' | 'error' | 'done' | undefined

interface Props {
  question: string
  onStatusChange?: (status: QueryStatus) => void
  currentTime?: number
}

function ChatGPTQuery(props: Props) {
  const { onStatusChange, currentTime, question } = props

  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [status, setStatus] = useState<QueryStatus>()

  const requestGpt = useMemo(() => {
    return debounce(() => {
      setStatus(undefined)
      // setError('error')
      // setStatus('error')
      // return

      const port = Browser.runtime.connect()
      const listener = (msg: any) => {
        if (msg.text) {
          let text = msg.text || ''
          text = text.replace(/^(\s|:\n\n)+|(:)+|(:\s)$/g, '')

          setAnswer({ ...msg, ...{ text } })
          setStatus('success')
        } else if (msg.error) {
          setError(msg.error)
          setStatus('error')
        } else if (msg.event === 'DONE') {
          setDone(true)
          setStatus('done')
        }
      }
      port.onMessage.addListener(listener)
      port.postMessage({ question: props.question })
      return () => {
        port.onMessage.removeListener(listener)
        port.disconnect()
      }
    }, 1000)
  }, [])

  const newTab = useCallback(() => {
    Browser.runtime.sendMessage({
      type: 'NEW_TAB',
      data: {
        url: `${BASE_URL}/chat`,
      },
    })
  }, [])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  useEffect(() => {
    onStatusChange?.(status)
  }, [onStatusChange, status])

  useEffect(() => {
    requestGpt()
  }, [question, retry, currentTime, requestGpt])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  useEffect(() => {
    shouldShowRatingTip().then((show) => setShowTip(show))
  }, [])

  if (answer) {
    return (
      <div className="markdown-body gpt-markdown" id="gpt-answer" dir="auto">
        <div className="glarity--chatgpt--header">
          <ChatGPTFeedback
            messageId={answer.messageId}
            conversationId={answer.conversationId}
            answerText={answer.text}
          />
        </div>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
        {/* {done && showTip && (
          <p className="glarity--italic glarity--mt-2">
            Enjoy this extension? Give us a 5-star rating at{' '}
            <a
              href="https://chatgpt4google.com/chrome?utm_source=rating_tip"
              target="_blank"
              rel="noreferrer"
            >
              Chrome Web Store
            </a>
          </p>
        )} */}
      </div>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p>
        {isIOS ? (
          <>
            Please set OpenAI API Key in the{' '}
            <Button type="success" ghost auto scale={0.5} onClick={openOptionsPage}>
              extension options
            </Button>
            .
          </>
        ) : (
          <>
            {' '}
            Please login and pass Cloudflare check at{' '}
            <Button type="success" ghost auto scale={0.5} onClick={newTab}>
              chat.openai.com
            </Button>
          </>
        )}

        {retry > 0 &&
          !isIOS &&
          (() => {
            if (isBraveBrowser()) {
              return (
                <span className="glarity--block glarity--mt-2">
                  Still not working? Follow{' '}
                  <a href="https://github.com/sparticleinc/chatgpt-google-summary-extension#troubleshooting">
                    Brave Troubleshooting
                  </a>
                </span>
              )
            } else {
              return (
                <span className="glarity--italic glarity--block glarity--mt-2 glarity--text-xs">
                  OpenAI requires passing a security check every once in a while. If this keeps
                  happening, change AI provider to OpenAI API in the{' '}
                  <Button type="success" ghost auto scale={0.5} onClick={openOptionsPage}>
                    extension options
                  </Button>
                  .
                </span>
              )
            }
          })()}
      </p>
    )
  }
  if (error) {
    return (
      <p>
        Failed to load response from ChatGPT:
        <span className="glarity--break-all glarity--block">{error}</span>
        <a
          href="javascript:void(0)"
          onClick={() => {
            setError('')
            setRetry((r) => r + 1)
          }}
        >
          Retry
        </a>
        <br />
        If this keeps happening, change AI provider to OpenAI API in the{' '}
        <Button type="success" ghost auto scale={0.5} onClick={openOptionsPage}>
          extension options
        </Button>
        .
      </p>
    )
  }

  return <Loading />
}

export default memo(ChatGPTQuery)
