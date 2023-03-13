import { useState, useCallback } from 'preact/hooks'
import { Note, Description, Button, Divider, Card, Text, Link } from '@geist-ui/core'
import { XCircleFillIcon, CopyIcon, ShareIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from '../content-script/ChatGPTQuery'
import { extractFromHtml } from '@extractus/article-extractor'
import { getUserConfig, Language, getProviderConfigs } from '../config'
import { getSummaryPrompt } from '../content-script/prompt'
import logoWhite from '../logo-white.png'
import logo from '../logo.png'

function WebSummary(props) {
  const [showCard, setShowCard] = useState(false)
  const [question, setQuestion] = useState('')

  const onBack = () => {
    Browser.runtime.sendMessage({
      type: 'GO_BACK',
    })
  }

  const onSwitch = () => {
    setShowCard((state) => {
      return !state
    })
  }

  const onSummary = useCallback(async () => {
    const html = document.querySelector('html')?.outerHTML
    const url = location.href

    if (!html) {
      return
    }

    const article = await extractFromHtml(html, url)
    console.log('article', article)

    if (article.content) {
      const language = window.navigator.language
      const userConfig = await getUserConfig()
      const providerConfigs = await getProviderConfigs()

      setQuestion(`Content:  ${getSummaryPrompt(
        article.content.replace(/<[^>]+>/g, ''),
        providerConfigs.provider,
      )}

Instructions: Please use the contents to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.
      `)
    }
  }, [])

  return (
    <>
      {showCard ? (
        <div className="glarity--summary__card">
          <Card shadow width="100%">
            <Card.Content className="glarity--flex glarity--justify-between">
              <div className="glarity--summary__card--title">
                <img src={logo} /> Glarity Summary
              </div>

              <Button
                type="secondary"
                className="glarity--summary__card--close"
                iconRight={<XCircleFillIcon />}
                auto
                inline
                onClick={onSwitch}
              />
            </Card.Content>

            <Divider my={0} />

            <Card.Content className="glarity--summary__card--content">
              {question ? (
                <div className="glarity--container">
                  <div className="glarity--chatgpt">
                    <ChatGPTQuery question={question} />
                  </div>
                </div>
              ) : (
                <Button type="success" scale={0.5} onClick={onSummary}>
                  Summarize
                </Button>
              )}
            </Card.Content>

            {/* <Card.Footer className="glarity--justify-end">
              <Button scale={0.25} type="success" ghost icon={<CopyIcon />} auto>
                Copy
              </Button>
              <Button scale={0.25} type="secondary" ghost icon={<ShareIcon />} auto>
                Share
              </Button>
            </Card.Footer> */}
          </Card>
        </div>
      ) : (
        <Button className={'glarity--summary__btn'} type="success" auto inline onClick={onSwitch}>
          <img src={logoWhite} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        </Button>
      )}
    </>
  )
}

export default WebSummary
