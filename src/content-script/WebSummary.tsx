import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon, ShareIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from '../content-script/ChatGPTQuery'
import { extractFromHtml } from '@extractus/article-extractor'
import { getUserConfig, Language, getProviderConfigs } from '../config'
import { getSummaryPrompt } from '../content-script/prompt'
import logoWhite from '../logo-white.png'
import logo from '../logo.png'

function WebSummary() {
  const [showCard, setShowCard] = useState(false)
  const [question, setQuestion] = useState('')

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
        <button
          onClick={onSwitch}
          className={classNames('glarity--btn', 'glarity--btn__launch', 'glarity--btn__primary')}
        >
          <img src={logoWhite} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        </button>
      )}

      {/* {showCard ? (

    

        <div className="glarity--summary__card">
          <Card>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="glarity--flex glarity--justify-between"
            >
              <div className="glarity--summary__card--title">
                <img src={logo} /> Glarity Summary
              </div>

              <Button
                variant="outlined"
                size="small"
                className="glarity--summary__card--close"
                startIcon={<XCircleFillIcon />}
                onClick={onSwitch}
              ></Button>
            </Typography>

            <Divider my={0} />

            <Card.Content className="glarity--summary__card--content">
              <Button variant="text">Text</Button>
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
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

      {/* ) : (
        <Button className={'glarity--summary__btn'} type="success" auto inline onClick={onSwitch}>
          <img src={logoWhite} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        </Button>
      )} */}
    </>
  )
}

export default WebSummary
