import { useState, useCallback, useEffect, useMemo } from 'react'
import { Spinner, GeistProvider, Loading, Divider } from '@geist-ui/core'
import { SearchIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
// import useSWRImmutable from 'swr/immutable'
import { SearchEngine } from './search-engine-configs'
import { TriggerMode, Theme, getUserConfig } from '../config'
import ChatGPTCard from './ChatGPTCard'
import { QueryStatus } from './ChatGPTQuery'
import { getSearchParam, copyTranscript, getConverTranscript } from './utils'
import { detectSystemColorScheme } from '../utils'
import {
  GearIcon,
  CheckIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertIcon,
  SyncIcon,
} from '@primer/octicons-react'
import { queryParam } from 'gb-url'
import { getQuestion } from '.'

interface Props {
  question: string
  transcript?: any
  triggerMode: TriggerMode
  siteConfig: SearchEngine
  langOptionsWithLink?: any
  currentTime?: number
}

function ChatGPTContainer(props: Props) {
  const [queryStatus, setQueryStatus] = useState<QueryStatus>()
  const [copied, setCopied] = useState(false)
  const [transcriptShow, setTranscriptShow] = useState(false)
  const [selectedOption, setSelectedOption] = useState(0)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(Theme.Auto)
  const [questionProps, setQuestionProps] = useState<Props>({ ...props })
  const [currentTranscript, setCurrentTranscript] = useState(props.transcript)

  const { triggerMode } = props

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  const handleChange = async (event) => {
    const val = event.target.value || ''
    const videoId = queryParam('v', window.location.href || '')

    if (val < 0 || !videoId) {
      return
    }

    setSelectedOption(val)

    const transcriptList = await getConverTranscript({
      langOptionsWithLink: questionProps.langOptionsWithLink,
      videoId,
      index: val,
    })

    setTranscriptShow(true)

    setCurrentTranscript(transcriptList)
  }

  const copytSubtitle = () => {
    const videoId = getSearchParam(window.location.href)?.v
    copyTranscript(videoId, currentTranscript)
    setCopied(true)
  }

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const onRefresh = useCallback(async () => {
    if (loading) {
      return
    }

    setLoading(true)

    let questionData = (await getQuestion()) as Props
    console.log('getQuestion', questionData, props)

    if (!questionData) {
      setLoading(false)
      return
    }
    questionData = Object.assign(questionData, { currentTime: Date.now() })

    setQuestionProps({ ...props, ...questionData })

    setQueryStatus(undefined)
  }, [props, loading])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  useEffect(() => {
    console.log('ChatGPTContainer props', props)
    setQuestionProps({ ...props })
    setCurrentTranscript([...props.transcript])
  }, [props])

  useEffect(() => {
    console.log('ChatGPTContainer questionProps', questionProps)
  }, [questionProps])

  useEffect(() => {
    console.log('queryStatus', queryStatus)
    if (queryStatus) {
      setLoading(false)
    }
  }, [queryStatus])

  useEffect(() => {
    getUserConfig().then((config) => setTheme(config.theme))
  }, [])

  useEffect(() => {
    const goLink = (e) => {
      e.preventDefault()
      console.log('e', e, e.target)
    }
    document.querySelector('div.glarity--main__container')?.addEventListener('click', goLink)

    return () => {
      document.querySelector('div.glarity--main__container')?.removeEventListener('click', goLink)
    }
  }, [])

  const switchtranscriptShow = () => {
    setTranscriptShow((state) => !state)
  }

  return (
    <>
      <GeistProvider themeType={themeType}>
        <div className="glarity--chatgpt">
          <div className="glarity--header">
            <div>
              <a
                href="https://glarity.app"
                rel="noreferrer"
                target="_blank"
                className="glarity--header__logo"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGoGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDItMDZUMTg6MDY6MjUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAyLTE1VDE1OjMzOjAxKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTAyLTE1VDE1OjMzOjAxKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjZTc0MWYzNy1mZDg3LTQ3M2YtOWJlMi1kYmM5YWYxMzg5NWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozNjAyNmVmMC04NzQ0LTlkNDUtODgxZi0zOGY4MjdiYWIwYjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0Y2YwZjI2Ni1kNjMyLTQwZjMtYWIyMC05YzZjOTQ5NGM5NzgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjRjZjBmMjY2LWQ2MzItNDBmMy1hYjIwLTljNmM5NDk0Yzk3OCIgc3RFdnQ6d2hlbj0iMjAyMy0wMi0wNlQxODowNjoyNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1NTVmMWI5LWRkNjEtNDc1Ny04Y2MzLTgxODdhNjU2MmI0NCIgc3RFdnQ6d2hlbj0iMjAyMy0wMi0xNVQxNTozMjoyNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNlNzQxZjM3LWZkODctNDczZi05YmUyLWRiYzlhZjEzODk1YiIgc3RFdnQ6d2hlbj0iMjAyMy0wMi0xNVQxNTozMzowMSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/4FzagAAFaJJREFUaIHtm3mQncV1t59+l7vfO3eZfZc0WobRLoyQQGLf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"
                  alt="Glarity"
                />
                Glarity Summary
              </a>
              <a href="javascript:;" className="glarity--header__logo" onClick={openOptionsPage}>
                <GearIcon size={14} />
              </a>

              {loading ? (
                <span className="glarity--header__logo">
                  <Spinner className="glarity--icon--loading" />
                </span>
              ) : (
                <a href="javascript:;" className="glarity--header__logo" onClick={onRefresh}>
                  <SyncIcon size={14} />
                </a>
              )}
            </div>

            <div className="glarity--chatgpt__action"></div>
          </div>

          <div className="glarity--main">
            <div className="glarity--main__container">
              {questionProps.question ? (
                <>
                  {triggerMode === TriggerMode.Manually && !questionProps.currentTime ? (
                    <a
                      href="javascript:;"
                      onClick={() => {
                        onRefresh()
                      }}
                    >
                      <SearchIcon size="small" /> Ask ChatGPT to summarize
                    </a>
                  ) : (
                    <>
                      {loading && (
                        <div className="glarity--main__loading">
                          <Loading />
                        </div>
                      )}
                      <ChatGPTCard
                        question={questionProps.question}
                        triggerMode={questionProps.triggerMode}
                        onStatusChange={setQueryStatus}
                        currentTime={questionProps.currentTime}
                      />
                    </>
                  )}
                </>
              ) : questionProps.siteConfig?.name === 'youtube' ? (
                <>
                  <p>No Transcription Available... </p>
                  <p>
                    Try{' '}
                    <a
                      href="https://huggingface.co/spaces/jeffistyping/Youtube-Whisperer"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Youtube Whisperer
                    </a>{' '}
                    to transcribe!
                  </p>
                </>
              ) : (
                <p>
                  <AlertIcon size={14} /> No results.
                </p>
              )}
            </div>
          </div>

          {questionProps.question && currentTranscript && (
            <div className="glarity--main">
              <div className="glarity--main__header">
                <div className="glarity--main__header--title">
                  Transcript
                  {questionProps.langOptionsWithLink.length > 1 && (
                    <>
                      {' '}
                      <select
                        className="glarity--select"
                        value={selectedOption}
                        onChange={handleChange}
                      >
                        {questionProps.langOptionsWithLink &&
                          Array.from(questionProps.langOptionsWithLink).map((v, i) => {
                            return (
                              <option key={i} value={i}>
                                {v.language}
                              </option>
                            )
                          })}
                      </select>
                    </>
                  )}
                </div>
                <div className="glarity--main__header--action">
                  <a href="javascript:;" onClick={copytSubtitle}>
                    {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  </a>

                  <a href="javascript:;" onClick={switchtranscriptShow}>
                    {transcriptShow ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </a>
                </div>
              </div>

              <div
                className="glarity--main__container glarity--main__container--subtitle"
                style={{
                  display: transcriptShow ? 'block' : 'none',
                }}
              >
                {currentTranscript.map((v, i) => {
                  const { time, text } = v

                  return (
                    <div className="glarity--subtitle" key={i}>
                      <div className="subtitle--time">{time}</div>
                      <div
                        className="subtitle--text"
                        dangerouslySetInnerHTML={{ __html: text }}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </GeistProvider>
    </>
  )
}

export default ChatGPTContainer
