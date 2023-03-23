import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from './ChatGPTQuery'
import { extractFromHtml } from '../utils/article-extractor/cjs/article-extractor.esm'
import { getUserConfig, Language, getProviderConfigs } from '@/config'
import { getSummaryPrompt } from './prompt'
import { isIOS } from '../utils/utils'
import { pageSummaryPrompt } from '../utils/prompt'
import logoWhite from '@/logo-white.png'
import logo from '@/logo.png'

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
    setLoading(true)
    setSupportSummary(true)

    setQuestion('')
    const html = document.querySelector('html')?.outerHTML
    const url = location.href

    if (!html) {
      setSupportSummary(false)
      return
    }

    const article = await extractFromHtml(html, url)
    // console.log('article', article)

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

      const prompt = pageSummaryPrompt({
        content: getSummaryPrompt(content.replace(/<[^>]+>/g, ''), providerConfigs.provider),
        language: userConfig.language === Language.Auto ? language : userConfig.language,
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
      {showCard ? (
        <div className="glarity--card">
          <div className="glarity--card__head ">
            <div className="glarity--card__head--title">
              <a href="https://glarity.app" rel="noreferrer" target="_blank">
                <img src={logo} alt="Glarity Summary" /> Glarity Summary
              </a>{' '}
              <button
                className={classNames('glarity--btn', 'glarity--btn__icon')}
                onClick={openOptionsPage}
              >
                <GearIcon size={14} />
              </button>
            </div>

            <div className="glarity--card__head--action">
              <button
                className={classNames('glarity--btn', 'glarity--btn__icon')}
                onClick={onSwitch}
              >
                <XCircleFillIcon />
              </button>
            </div>
          </div>

          <div className="glarity--card__content">
            {question ? (
              <div className="glarity--container">
                <div className="glarity--chatgpt">
                  <ChatGPTQuery question={question} />
                </div>
              </div>
            ) : (
              <div className="glarity--card__empty ">
                {!supportSummary ? (
                  'Sorry, the summary of this page is not supported.'
                ) : (
                  <button
                    className={classNames(
                      'glarity--btn',
                      'glarity--btn__primary',
                      // 'glarity--btn__large',
                      'glarity--btn__block',
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
          <button
            onClick={onSwitch}
            className={classNames('glarity--btn', 'glarity--btn__launch', 'glarity--btn__primary')}
          >
            <img
              src={logoWhite}
              alt="Glarity Summary"
              className="glarity--w-5 glarity--h-5 glarity--rounded-sm"
            />
          </button>
        )
      )}
    </>
  )
}

export default PageSummary
