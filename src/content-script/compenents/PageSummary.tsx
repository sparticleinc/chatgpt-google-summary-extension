import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from '@/content-script/compenents/ChatGPTQuery'
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
} from '@/utils/prompt'
import logoWhite from '@/assets/img/logo-white.png'
import logo from '@/assets/img/logo.png'
import Draggable from 'react-draggable'
import { AppProvider } from '@/content-script/model/AppProvider/Provider'
// import Draggable from '@camdarragh/react-draggable'

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

  const onSummary = useCallback(async () => {
    console.log('onSummary')
    setLoading(true)
    setSupportSummary(true)

    setQuestion('')

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
      const userConfig = await getUserConfig()
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

      const prompt = pageComments?.content
        ? commentSummaryPrompt({
            content: promptContent,
            language: replyLanguage,
            prompt: userConfig.promptComment
              ? userConfig.promptComment
              : commentSummaryPromptHightligt,
            rate: promptRate || '-1',
          })
        : pageSummaryPrompt({
            content: promptContent,
            language: replyLanguage,
            prompt: userConfig.promptPage ? userConfig.promptPage : pageSummaryPromptHighlight,
          })

      setQuestion(prompt)
      return
    }

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
                  {question ? (
                    <div className="glarity--container">
                      <div className="glarity--chatgpt">
                        <ChatGPTQuery question={question} />
                      </div>
                    </div>
                  ) : (
                    <div className="glarity--card__empty">
                      {!supportSummary ? (
                        'Sorry, the summary of this page is not supported.'
                      ) : (
                        <button
                          className={classNames(
                            'glarity--btn',
                            'glarity--btn__primary',
                            // 'glarity--btn__large',
                            'glarity--btn__block',
                            'need-interaction',
                            'glarity--nodrag',
                          )}
                          onClick={onSummary}
                          disabled={loading}
                        >
                          Summary
                        </button>
                      )}
                    </div>
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
