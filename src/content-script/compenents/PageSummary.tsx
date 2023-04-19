import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery, { QueryStatus } from '@/content-script/compenents/ChatGPTQuery'
// import { extractFromHtml } from '@/utils/article-extractor/cjs/article-extractor.esm'
import { getUserConfig, Language, getProviderConfigs, APP_TITLE } from '@/config'
import { getSummaryPrompt } from '@/content-script/prompt'
import { isIOS } from '@/utils/utils'
import { getPageSummaryContntent, getPageSummaryComments } from '@/content-script/utils'
import {
  commentSummaryPrompt,
  commentSummaryPromptHightligt,
  pageSummaryPrompt,
  pageSummaryPromptHighlight,
  customizePromptQA,
  customizePromptBulletPoints,
  customizePromptTweet,
} from '@/utils/prompt'
import logoWhite from '@/assets/img/logo-white.png'
import logo from '@/assets/img/logo.png'
import Draggable from 'react-draggable'
import { AppProvider } from '@/content-script/model/AppProvider/Provider'

interface Props {
  pageSummaryEnable: boolean
  pageSummaryWhitelist: string
  pageSummaryBlacklist: string
  siteRegex: RegExp
}

function PageSummary(props: Props) {
  const { pageSummaryEnable, pageSummaryWhitelist, pageSummaryBlacklist, siteRegex } = props
  const [showCard, setShowCard] = useState(false)
  const [supportSummary, setSupportSummary] = useState(true)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState<boolean>(false)
  const [isDrag, setIsDrag] = useState<boolean>(false)
  const [activeButton, setActiveButton] = useState<string>('')
  const [status, setStatus] = useState<QueryStatus>()

  const onSwitch = useCallback(() => {
    setShowCard((state) => {
      const cardState = !state

      if (cardState) {
        setQuestion('')
        setLoading(false)
      }

      return cardState
    })
  }, [])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const onSummary = useCallback(async (type?: string) => {
    console.log('onSummary')
    setLoading(true)
    setSupportSummary(true)

    setActiveButton(type ?? '')

    setQuestion('')

    const userConfig = await getUserConfig()

    let promptPage = ''
    let promptComment = ''

    switch (type) {
      case 'qa': {
        promptPage = customizePromptQA
        promptComment = customizePromptQA
        break
      }

      case 'points': {
        promptPage = customizePromptBulletPoints
        promptComment = customizePromptBulletPoints
        break
      }

      case 'tweet': {
        promptPage = customizePromptTweet
        promptComment = customizePromptTweet
        break
      }

      default: {
        promptPage = userConfig.promptComment
          ? userConfig.promptComment
          : commentSummaryPromptHightligt

        promptComment = userConfig.promptPage ? userConfig.promptPage : pageSummaryPromptHighlight
        break
      }
    }

    const pageComments = await getPageSummaryComments()
    const pageContent = await getPageSummaryContntent()
    const article = pageComments?.content ? pageComments : pageContent

    const title = article?.title || document.title || ''
    const description =
      article?.description ||
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      ''
    const content = article?.content ? description + article?.content : title + description

    if (article?.content || description) {
      const language = window.navigator.language
      const providerConfigs = await getProviderConfigs()

      const promptContent = getSummaryPrompt(
        content.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
        providerConfigs.provider,
      )

      const promptRate = getSummaryPrompt(
        article?.['rate']?.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
        providerConfigs.provider,
      )
      const replyLanguage = userConfig.language === Language.Auto ? language : userConfig.language

      const url = type === 'tweet' ? location.href : null

      const prompt = pageComments?.content
        ? commentSummaryPrompt({
            content: promptContent,
            url,
            language: replyLanguage,
            prompt: promptPage,
            rate: promptRate || '-1',
          })
        : pageSummaryPrompt({
            content: promptContent,
            url,
            language: replyLanguage,
            prompt: promptComment,
          })

      setQuestion(prompt)
      return
    }

    setLoading(false)
    setSupportSummary(false)
  }, [])

  useEffect(() => {
    Browser.runtime.onMessage.addListener((message) => {
      const { type } = message
      if (type === 'OPEN_WEB_SUMMARY') {
        if (showCard) {
          return
        }

        setQuestion('')
        setShowCard(true)
        setLoading(false)
      }
    })
  }, [showCard])

  useEffect(() => {
    const hostname = location.hostname
    const blacklist = pageSummaryBlacklist.replace(/[\s\r\n]+/g, '')
    const whitelist = pageSummaryWhitelist.replace(/[\s\r\n]+/g, '')

    const inWhitelist = !whitelist
      ? !blacklist.includes(hostname)
      : !blacklist.includes(hostname) && pageSummaryWhitelist.includes(hostname)

    const show =
      pageSummaryEnable && ((isIOS && inWhitelist) || (inWhitelist && !siteRegex?.test(hostname)))

    setShow(show)
  }, [pageSummaryBlacklist, pageSummaryEnable, pageSummaryWhitelist, siteRegex])

  useEffect(() => {
    if (status === 'done' || status === 'error') {
      setLoading(false)
    }
  }, [status])

  return (
    <>
      <AppProvider>
        <Draggable
          axis="y"
          // onMouseDown={(e) => {
          //   e.preventDefault()
          //   setIsDrag(true)
          // }}
          // onStart={(e) => {
          //   e.preventDefault()
          //   setIsDrag(true)
          // }}
          onStop={(e) => {
            setIsDrag(false)
            const { target, type } = e

            if (target && type === 'touchend') {
              try {
                target?.click()
              } catch (error) {
                console.error(error)
              }
            }
          }}
          onDrag={(e) => {
            e.preventDefault()
            setIsDrag(true)
          }}
          cancel={'[class*="glarity--nodrag"]'}
        >
          <div className={'glarity--page__summary'}>
            {showCard ? (
              <div
                className={classNames(
                  'glarity--card',
                  'glarity--page__summary',
                  isDrag && 'glarity--move',
                )}
              >
                <div className="glarity--card__head ">
                  <div className="glarity--card__head--title">
                    <a
                      href="https://glarity.app"
                      rel="noreferrer"
                      target="_blank"
                      className={'glarity--nodrag'}
                    >
                      <img src={logo} alt={APP_TITLE} /> {APP_TITLE}
                    </a>{' '}
                    <button
                      className={classNames(
                        'glarity--btn',
                        'glarity--btn__icon',
                        'glarity--nodrag',
                      )}
                      onClick={openOptionsPage}
                    >
                      <GearIcon size={14} />
                    </button>
                  </div>

                  <div className="glarity--card__head--action glarity--nodrag">
                    <button
                      className={classNames('glarity--btn', 'glarity--btn__icon')}
                      onClick={onSwitch}
                    >
                      <XCircleFillIcon />
                    </button>
                  </div>
                </div>

                <div className="glarity--card__content glarity--nodrag">
                  <div className="glarity--card__content--head">
                    <button
                      className={classNames(
                        'glarity--btn',
                        activeButton === 'summary'
                          ? 'glarity--btn__primary'
                          : 'glarity--btn__primary--ghost',
                        'glarity--btn__small',
                        'glarity--nodrag',
                      )}
                      onClick={() => {
                        onSummary('summary')
                      }}
                      disabled={loading}
                    >
                      Summary
                    </button>

                    <button
                      className={classNames(
                        'glarity--btn',
                        activeButton === 'tweet'
                          ? 'glarity--btn__primary'
                          : 'glarity--btn__primary--ghost',
                        'glarity--btn__small',
                        'glarity--nodrag',
                      )}
                      onClick={() => {
                        onSummary('tweet')
                      }}
                      disabled={loading}
                    >
                      Create a tweet
                    </button>

                    <button
                      className={classNames(
                        'glarity--btn',
                        activeButton === 'qa'
                          ? 'glarity--btn__primary'
                          : 'glarity--btn__primary--ghost',
                        'glarity--btn__small',
                        'glarity--nodrag',
                      )}
                      onClick={() => {
                        onSummary('qa')
                      }}
                      disabled={loading}
                    >
                      Q&A
                    </button>

                    <button
                      className={classNames(
                        'glarity--btn',
                        activeButton === 'points'
                          ? 'glarity--btn__primary'
                          : 'glarity--btn__primary--ghost',
                        'glarity--btn__small',
                        'glarity--nodrag',
                      )}
                      onClick={() => {
                        onSummary('points')
                      }}
                      disabled={loading}
                    >
                      3 bullet points.
                    </button>
                  </div>

                  {question ? (
                    <div className="glarity--container">
                      <div className="glarity--chatgpt">
                        <ChatGPTQuery question={question} onStatusChange={setStatus} />
                      </div>
                    </div>
                  ) : (
                    <>{!supportSummary && 'Sorry, the summary of this page is not supported.'}</>
                  )}
                </div>
              </div>
            ) : (
              show && (
                <>
                  <button
                    onClick={onSwitch}
                    className={classNames(
                      'glarity--btn',
                      'glarity--btn__launch',
                      'glarity--btn__primary',
                      isDrag && 'glarity--move',
                    )}
                  >
                    <img
                      src={logoWhite}
                      alt={APP_TITLE}
                      className="glarity--w-5 glarity--h-5 glarity--rounded-sm glarity--launch__icon"
                    />
                  </button>{' '}
                </>
              )
            )}
          </div>
        </Draggable>
      </AppProvider>
    </>
  )
}

export default PageSummary
