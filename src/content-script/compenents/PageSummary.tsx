import { useState, useCallback, useEffect, useContext } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon, GearIcon, CircleSlashIcon } from '@primer/octicons-react'
import { ConfigProvider, Popover, Divider, Modal, Typography, Tooltip } from 'antd'
import Browser from 'webextension-polyfill'
import ChatGPTQuery, { QueryStatus } from '@/content-script/compenents/ChatGPTQuery'
// import { extractFromHtml } from '@/utils/article-extractor/cjs/article-extractor.esm'
import {
  getUserConfig,
  Language,
  getProviderConfigs,
  APP_TITLE,
  updateUserConfig,
  UserConfig,
} from '@/config'
import { getSummaryPrompt } from '@/content-script/prompt'
import { isIOS, getPDFText } from '@/utils/utils'
import {
  getPageSummaryContent,
  getPageSummaryComments,
  pagePromptList,
  PromptItem,
} from '@/content-script/utils'
import {
  commentSummaryPrompt,
  commentSummaryPromptHightligt,
  pageSummaryPrompt,
  pageSummaryPromptHighlight,
  selectionSummaryPrompt,
} from '@/utils/prompt'
import logoWhite from '@/assets/img/logo-white.png'
import logo from '@/assets/img/logo.png'
import Draggable from 'react-draggable'
import { debounce } from 'lodash-es'
import { AppContext } from '@/content-script/model/AppProvider/Context'
import { queryParam } from 'gb-url'

const { Paragraph, Text, Link } = Typography

interface Props {
  pageSummaryEnable: boolean
  pageSummaryWhitelist: string
  pageSummaryBlacklist: string
  siteRegex: RegExp
}

interface MenuPosition {
  x: number
  y: number
}

function PageSummary(props: Props) {
  const { pageSummaryEnable, pageSummaryWhitelist, pageSummaryBlacklist, siteRegex } = props
  // const [showCard, setShowCard] = useState(false)
  const { showCard, setShowCard } = useContext(AppContext)
  const [supportSummary, setSupportSummary] = useState(true)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState<boolean>(false)
  const [isDrag, setIsDrag] = useState<boolean>(false)
  const [status, setStatus] = useState<QueryStatus>()
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const [showSelectionMenu, setShowSelectionMenu] = useState<boolean>(false)
  const [selectionText, setSelectionText] = useState<string>('')
  const [isSelection, setIsSelection] = useState<boolean>(false)
  const [promptItem, setPromptItem] = useState<PromptItem>()
  const [isShowDisabledPageSelection, setShowIsDisabledPageSelection] = useState(false)
  const [pageSelectionEnable, setPageSelectionEnable] = useState(true)
  const [userConfigData, setUserConfigData] = useState<UserConfig>()

  const onSwitch = useCallback(() => {
    const contentType = document.querySelector('embed')?.type
    if (contentType === 'application/pdf') {
      Browser.runtime
        .sendMessage({
          type: 'GET_URL',
        })
        .then((tabs) => {
          const tab = tabs[0]
          console.log('getCurrent tab', tab)
        })

      return
    }

    setShowCard((state) => {
      const cardState = !state

      if (cardState) {
        setQuestion('')
        setIsSelection(false)
        setLoading(false)
      }

      return cardState
    })
  }, [setShowCard])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const onSummary = useCallback(
    async (type?: string, isSelection?: boolean) => {
      setIsSelection(isSelection ?? false)
      console.log('onSummary')
      setLoading(true)
      setShowCard(true)
      setSupportSummary(true)
      setQuestion('')

      const userConfig = userConfigData ?? (await getUserConfig())
      const providerConfigs = await getProviderConfigs()

      const language = window.navigator.language
      const replyLanguage = userConfig.language === Language.Auto ? language : userConfig.language
      const url = type === 'tweet' ? location.href : null

      let promptPage = ''
      let promptComment = ''

      if (type) {
        const item = pagePromptList.filter((item) => item.key === type)[0]
        const itemPrompt = item?.prompt as unknown
        const prompt = itemPrompt instanceof Function ? itemPrompt(replyLanguage) : itemPrompt

        setPromptItem(item)

        if (type === 'summary') {
          promptComment = userConfig.promptComment
            ? userConfig.promptComment
            : commentSummaryPromptHightligt

          promptPage = userConfig.promptPage ? userConfig.promptPage : pageSummaryPromptHighlight
        } else {
          promptPage = promptComment = prompt
        }
      }

      // PDF
      const pageUrl = location.href
      const pdfUrl = queryParam('file', pageUrl)
      if (
        /^(chrome-extension:\/\/)(\s|\S)+\/pdf\/web\/viewer.html\?file=(\s|\S)+/.test(pageUrl) &&
        pdfUrl
      ) {
        const pdfText = await getPDFText(pdfUrl)

        const promptContent = getSummaryPrompt(
          pdfText.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
          providerConfigs,
        )

        setQuestion(
          pageSummaryPrompt({
            content: promptContent,
            language: replyLanguage,
            prompt: promptPage,
          }),
        )
        return
      }

      if (isSelection) {
        const promptContent = getSummaryPrompt(
          selectionText.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
          providerConfigs,
        )

        setQuestion(
          selectionSummaryPrompt({
            content: promptContent,
            url,
            language: replyLanguage,
            prompt: promptPage,
            isTranslation: type === 'translation',
          }),
        )
        return
      }

      const pageComments = await getPageSummaryComments()
      const pageContent = await getPageSummaryContent()
      const article = pageComments?.content ? pageComments : pageContent

      const title = article?.title || document.title || ''
      const description =
        article?.description ||
        document.querySelector('meta[name="description"]')?.getAttribute('content') ||
        ''
      const content = article?.content ? description + article?.content : title + description

      if (article?.content || description) {
        const promptContent = getSummaryPrompt(
          content.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
          providerConfigs,
        )

        const promptRate = getSummaryPrompt(
          article?.['rate']?.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
          providerConfigs,
        )

        const prompt = pageComments?.content
          ? commentSummaryPrompt({
              content: promptContent,
              url,
              language: replyLanguage,
              prompt: promptComment,
              rate: promptRate || '-1',
            })
          : pageSummaryPrompt({
              content: promptContent,
              url,
              language: replyLanguage,
              prompt: promptPage,
            })

        setQuestion(prompt)
        return
      }

      setLoading(false)
      setSupportSummary(false)
    },
    [selectionText, setShowCard, userConfigData],
  )

  const onSwitchSelection = useCallback(() => {
    setPageSelectionEnable(false)
    updateUserConfig({ pageSelectionEnable: false })
    setShowIsDisabledPageSelection(false)
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
  }, [setShowCard, showCard])

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

  useEffect(() => {
    const second = debounce(() => {
      const selection = window.getSelection()
      const selectionText = selection?.toString().trim()

      if (selection && selectionText) {
        setSelectionText(selectionText)

        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        const position = { x: rect.left, y: rect.top }
        const size = { width: rect.width, height: rect.height }

        setMenuPosition({
          x: position.x + size.width / 2,
          // y: position.y + size.height + 5,
          y: position.y,
        })

        setShowSelectionMenu(true)
      }
    }, 500)

    const onMouseDown = () => {
      setShowSelectionMenu(false)
    }

    const onScroll = () => {
      setShowSelectionMenu(false)
    }

    document.addEventListener('click', onMouseDown)
    document.addEventListener('selectionchange', second)
    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('selectionchange', second)
      document.removeEventListener('click', onMouseDown)
      document.removeEventListener('scroll', onScroll)
    }
  }, [setShowSelectionMenu])

  useEffect(() => {
    async function getConfig() {
      const userConfig = await getUserConfig()

      setPageSelectionEnable(userConfig?.pageSelectionEnable ?? true)
      setUserConfigData(userConfig)
    }
    getConfig()
  }, [])

  return (
    <>
      <ConfigProvider prefixCls="glarity-" iconPrefixCls="glarity--icon-">
        <Draggable
          // axis="y"
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
                        promptItem?.key === 'summary'
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
                        promptItem?.key === 'tweet'
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
                        promptItem?.key === 'qa'
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
                        promptItem?.key === 'important'
                          ? 'glarity--btn__primary'
                          : 'glarity--btn__primary--ghost',
                        'glarity--btn__small',
                        'glarity--nodrag',
                      )}
                      onClick={() => {
                        onSummary('important')
                      }}
                      disabled={loading}
                    >
                      Important
                    </button>
                  </div>

                  <Divider></Divider>

                  {selectionText && isSelection && (
                    <>
                      <div className="glarity--card__content--body">
                        <h3 className="glarity--card__content--title">Content</h3>
                        <div className="glarity--card__content--text">{selectionText}</div>
                      </div>

                      <Divider></Divider>

                      {(status === 'success' || status === 'done') && (
                        <h3 className="glarity--card__content--title glarity--card__content--title__summary">
                          {promptItem?.name ? promptItem.name : 'Summary'}
                        </h3>
                      )}
                    </>
                  )}

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

        {pageSelectionEnable && (
          <>
            <Popover
              // trigger="click"
              className="glarity--popover"
              open={showSelectionMenu}
              title={
                <div className={'glarity--selection__title'}>
                  <a href="https://glarity.app" rel="noreferrer" target="_blank">
                    <img src={logo} alt={APP_TITLE} />
                    Glarity
                  </a>

                  <Tooltip title="Disable Page Selection">
                    <button
                      className={classNames('glarity--btn', 'glarity--btn__icon')}
                      onClick={() => {
                        setShowIsDisabledPageSelection(true)
                      }}
                    >
                      <CircleSlashIcon size={12} />
                    </button>
                  </Tooltip>
                </div>
              }
              content={
                <ul className={'glarity--list'}>
                  <li
                    className="glarity--list__item"
                    onClick={() => {
                      onSummary('summary', true)
                    }}
                  >
                    Summary
                  </li>
                  <li
                    className="glarity--list__item"
                    onClick={() => {
                      onSummary('tweet', true)
                    }}
                  >
                    Create a tweet
                  </li>
                  <li
                    className="glarity--list__item"
                    onClick={() => {
                      onSummary('explain', true)
                    }}
                  >
                    Explain
                  </li>
                  <li
                    className="glarity--list__item"
                    onClick={() => {
                      onSummary('translation', true)
                    }}
                  >
                    Translation
                  </li>
                </ul>
              }
            >
              <div
                className={classNames(
                  'glarity--selection__menu',
                  !showSelectionMenu && 'glarity--selection__menu__hidden',
                )}
                style={{
                  left: `${menuPosition.x}px`,
                  top: `${menuPosition.y}px`,
                  right: 'auto',
                  bottom: 'auto',
                }}
              >
                <img
                  src={logoWhite}
                  alt={APP_TITLE}
                  className="glarity--w-5 glarity--h-5 glarity--rounded-sm glarity--launch__icon"
                />
              </div>
            </Popover>

            <Modal
              title={`${APP_TITLE}  tips`}
              open={isShowDisabledPageSelection}
              onOk={onSwitchSelection}
              onCancel={() => {
                setShowIsDisabledPageSelection(false)
              }}
              closable={false}
              okText="Confirm"
            >
              <Typography>
                <Paragraph>Do you really want to disable Page Selection?</Paragraph>
                <Paragraph>
                  <Text mark>
                    You can turn it on in the <Link onClick={openOptionsPage}>Options</Link> {`>>`}{' '}
                    Page Selection.
                  </Text>
                </Paragraph>
              </Typography>
            </Modal>
          </>
        )}
      </ConfigProvider>
    </>
  )
}

export default PageSummary
