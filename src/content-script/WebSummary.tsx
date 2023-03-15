import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon, ShareIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from '../content-script/ChatGPTQuery'
import { extractFromHtml } from '@extractus/article-extractor'
import { getUserConfig, Language, getProviderConfigs } from '../config'
import { getSummaryPrompt } from '../content-script/prompt'
import { config as siteConfig } from './search-engine-configs'
import logoWhite from '../logo-white.png'
import logo from '../logo.png'

interface Props {
  webSummary: string
  webSummarySites: string
}

function WebSummary(props: Props) {
  const { webSummary, webSummarySites } = props
  const [showCard, setShowCard] = useState(false)
  const [question, setQuestion] = useState('')
  const [siteRegex, setSiteRegex] = useState<RegExp>()

  const onSwitch = useCallback(() => {
    setShowCard((state) => {
      const cardState = !state

      if (cardState) {
        setQuestion('')
      }

      return cardState
    })
  }, [])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const onSummary = useCallback(async () => {
    setQuestion('')
    const html = document.querySelector('html')?.outerHTML
    const url = location.href

    if (!html) {
      return
    }

    const article = await extractFromHtml(html, url)
    console.log('article', article)

    if (article?.content) {
      const language = window.navigator.language
      const userConfig = await getUserConfig()
      const providerConfigs = await getProviderConfigs()

      setQuestion(`Content:  ${getSummaryPrompt(
        (article.description + article.content).replace(/<[^>]+>/g, ''),
        providerConfigs.provider,
      )}

Instructions: Please use the contents to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.
      `)
    }
  }, [])

  useEffect(() => {
    Browser.runtime.onMessage.addListener((message) => {
      const { type } = message
      if (type === 'OPEN_WEB_SUMMARY') {
        setShowCard(true)
      }
    })

    const siteRegex = new RegExp(
      Object.values(siteConfig)
        .map((v) => {
          return v.regex
        })
        .join('|'),
    )

    setSiteRegex(siteRegex)
  }, [])

  return (
    <>
      {showCard ? (
        <div className="glarity--card">
          <div className="glarity--card__head ">
            <div className="glarity--card__head--title">
              <a href="https://glarity.app" rel="noreferrer" target="_blank">
                <img src={logo} /> Glarity Summary
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
                <button
                  className={classNames(
                    'glarity--btn',
                    'glarity--btn__primary',
                    'glarity--btn__large',
                    'glarity--btn__block',
                  )}
                  onClick={onSummary}
                >
                  Summary
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        ((webSummary === 'custom' && webSummarySites.includes(location.hostname)) ||
          webSummary === 'all') &&
        !siteRegex?.test(location.hostname) && (
          <button
            onClick={onSwitch}
            className={classNames('glarity--btn', 'glarity--btn__launch', 'glarity--btn__primary')}
          >
            <img src={logoWhite} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
          </button>
        )
      )}
    </>
  )
}

export default WebSummary
