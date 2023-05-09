import { useEffect, useState, useCallback, useRef, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { memo, useMemo } from 'react'
import { Loading } from '@geist-ui/core'
import { PlusCircleIcon, NoEntryIcon } from '@primer/octicons-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '@/messaging'
import ChatGPTFeedback from './ChatGPTFeedback'
import { debounce } from 'lodash-es'
import { isBraveBrowser, shouldShowRatingTip } from '@/content-script/utils'
import { BASE_URL, BOX_HEIGHT, getSessionValue, setSessionValue } from '@/config'
import { isIOS, isSafari } from '@/utils/utils'
import '@/content-script/styles.scss'
import Translation from './Translation'
import { AppContext } from '@/content-script/model/AppProvider/Context'

export type QueryStatus = 'success' | 'error' | 'done' | undefined

interface Props {
  question: string
  onStatusChange?: (status: QueryStatus) => void
  ignoreTranslation?: boolean
  setTranslationStatus?: (status: QueryStatus) => void
}

function ChatGPTQuery(props: Props) {
  const { onStatusChange, question, ignoreTranslation, setTranslationStatus } = props

  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [status, setStatus] = useState<QueryStatus>()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [showContent, setShowContent] = useState<boolean>(true)
  const { boxHeight, setBoxHeight, setConversationId, setTriggered } = useContext(AppContext)

  const stepValue = 50

  const requestGpt = useMemo(() => {
    console.log('question', question)

    return debounce(() => {
      setStatus(undefined)
      // setTriggered(false)
      // setError('error')
      // setStatus('error')
      // return

      setDone(true)
      setStatus('done')
      setAnswer({
        text: `Glarity Summary is a ChatGPT for YouTube/Google extension that can summarize YouTube videos and Google searches, also supports Yahoo! ニュース, PubMed, PMC, NewsPicks, Github, Nikkei, Bing, Google Patents and any page summary.Glarity Summary is a ChatGPT for YouTube/Google extension that can summarize YouTube videos and Google searches, also supports Yahoo! ニュース, PubMed, PMC, NewsPicks, Github, Nikkei, Bing, Google Patents and any page summary.Glarity Summary is a ChatGPT for YouTube/Google extension that can summarize YouTube videos and Google searches, also supports Yahoo! ニュース, PubMed, PMC, NewsPicks, Github, Nikkei, Bing, Google Patents and any page summary.Glarity Summary is a ChatGPT for YouTube/Google extension that can summarize YouTube videos and Google searches, also supports Yahoo! ニュース, PubMed, PMC, NewsPicks, Github, Nikkei, Bing, Google Patents and any page summary.Glarity Summary is a ChatGPT for YouTube/Google extension that can summarize YouTube videos and Google searches, also supports Yahoo! ニュース, PubMed, PMC, NewsPicks, Github, Nikkei, Bing, Google Patents and any page summary.`,
      })
      return

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
      port.postMessage({ question })
      return () => {
        port.onMessage.removeListener(listener)
        port.disconnect()
      }
    }, 1000)
  }, [question])

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

  const onChangeBoxHeight = useCallback(async (type?: string) => {
    const wrap: HTMLDivElement | null = wrapRef.current
    if (!wrap) {
      return
    }

    if (type === 'plus') {
      setBoxHeight((value) => {
        const height = value + stepValue
        setSessionValue({ key: 'boxHeight', value: height })
        return height
      })
    } else {
      setBoxHeight((value) => {
        const height = value - stepValue
        setSessionValue({ key: 'boxHeight', value: height })
        if (height <= 60) {
          return 60
        }
        return height
      })
    }
  }, [])

  useEffect(() => {
    onStatusChange?.(status)
    setTranslationStatus?.(status)
  }, [onStatusChange, setTranslationStatus, status])

  useEffect(() => {
    setAnswer(null)
    requestGpt()
  }, [retry, requestGpt])

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

    getSessionValue('boxHeight').then((value) => {
      setBoxHeight(Number(value || BOX_HEIGHT))
    })
  }, [setBoxHeight])

  useEffect(() => {
    const wrap: HTMLDivElement | null = wrapRef.current
    if (!wrap) {
      return
    }

    if (answer) {
      wrap.scrollTo({
        top: 10000,
        behavior: 'smooth',
      })

      setConversationId(answer.conversationId)
    }
  }, [answer, setConversationId])

  useEffect(() => {
    console.log('Query', question)
  }, [])

  if (answer) {
    return (
      <>
        <div className="markdown-body gpt-markdown" id="gpt-answer" dir="auto">
          <div className="glarity--chatgpt--header">
            <ChatGPTFeedback
              messageId={answer.messageId}
              conversationId={answer.conversationId}
              answerText={answer.text}
              showContent={showContent}
              setShowContent={setShowContent}
              status={status}
              setStatus={setStatus}
              // onStatusChange={onStatusChange}
            />
          </div>
          <div
            className="glarity--chatgpt--content glarity--nodrag"
            ref={wrapRef}
            style={{
              display: showContent ? 'block' : 'none',
              minHeight: boxHeight + 'px',
              // maxHeight: boxHeight + 'px',
            }}
          >
            <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
              {answer.text}
            </ReactMarkdown>
            {/* <button
              className={classNames('glarity--btn', 'glarity--btn__primary', 'glarity--btn__small')}
            >
              Stop responding
            </button> */}
          </div>

          {/* {done && showTip && (
            <p className="glarity--italic glarity--mt-2">
              Enjoy this extension? Give us a 5-star rating at{' '}
              <a
                href="https://chrome.google.com/webstore/detail/chatgpt-glarity%EF%BC%8Csummarize/cmnlolelipjlhfkhpohphpedmkfbobjc"
                target="_blank"
                rel="noreferrer"
              >
                Chrome Web Store
              </a>
            </p>
          )} */}
        </div>

        {!ignoreTranslation && (
          <Translation
            answerText={answer.text}
            status={status}
            showContent={showContent}
            onStatusChange={onStatusChange}
          />
        )}

        {!ignoreTranslation && (
          <div className="glarity--chatgpt__footer glarity--nodrag">
            <button
              onClick={() => {
                onChangeBoxHeight()
              }}
              disabled={boxHeight <= 60 ? true : false}
              className={classNames('glarity--btn', 'glarity--btn__icon')}
            >
              <NoEntryIcon size={14} />
            </button>

            <button
              onClick={() => {
                onChangeBoxHeight('plus')
              }}
              className={classNames('glarity--btn', 'glarity--btn__icon')}
            >
              <PlusCircleIcon size={14} />
            </button>
          </div>
        )}
      </>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className={'glarity--nodrag'}>
        {isSafari ? (
          <>
            Please set OpenAI API Key in the{' '}
            <button
              className={classNames('glarity--btn', 'glarity--btn__primary', 'glarity--btn__small')}
              onClick={openOptionsPage}
            >
              extension options
            </button>
            .
          </>
        ) : (
          <>
            {' '}
            Please login and pass Cloudflare check at{' '}
            <button
              className={classNames('glarity--btn', 'glarity--btn__primary', 'glarity--btn__small')}
              onClick={newTab}
            >
              chat.openai.com
            </button>
            .
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
                  <button
                    className={classNames(
                      'glarity--btn',
                      'glarity--btn__primary',
                      'glarity--btn__small',
                    )}
                    onClick={openOptionsPage}
                  >
                    extension options
                  </button>
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
      <p className={'glarity--nodrag'}>
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
        <button
          className={classNames('glarity--btn', 'glarity--btn__primary', 'glarity--btn__small')}
          onClick={openOptionsPage}
        >
          extension options
        </button>
        .
      </p>
    )
  }

  return <Loading />
}

export default memo(ChatGPTQuery)
