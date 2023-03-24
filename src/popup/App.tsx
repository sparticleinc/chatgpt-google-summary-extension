import { Button, Divider } from '@geist-ui/core'
import { useCallback, useState } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import '@/assets/styles/base.scss'
import logo from '@/assets/img/logo.png'
import { extractFromHtml } from '@extractus/article-extractor'
import ChatGPTQuery from '@/content-script/compenents/ChatGPTQuery'
import { getUserConfig, Language, getProviderConfigs, APP_TITLE } from '@/config'
import { getSummaryPrompt } from '@/content-script/prompt'
import './styles.scss'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const [question, setQuestion] = useState('')

  const accessTokenQuery = useSWR(
    'accessToken',
    () => Browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
    { shouldRetryOnError: false },
  )
  const hideShortcutsTipQuery = useSWR('hideShortcutsTip', async () => {
    const { hideShortcutsTip } = await Browser.storage.local.get('hideShortcutsTip')
    return !!hideShortcutsTip
  })

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const openShortcutsPage = useCallback(() => {
    Browser.storage.local.set({ hideShortcutsTip: true })
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  const onSummary = useCallback(async () => {
    const tabs = await Browser.tabs.query({ currentWindow: true, active: true })

    const [tab] = tabs

    console.log('tab', tab)

    if (!tab.id) {
      return
    }

    const html = await Browser.tabs.sendMessage(tab.id, { type: 'GET_DOM', data: { tab } })

    console.log('html', html)

    const article = await extractFromHtml(html.html, tab.url)
    console.log('article', article)

    if (article.content) {
      const language = window.navigator.language
      const userConfig = await getUserConfig()
      const providerConfigs = await getProviderConfigs()

      setQuestion(`Content:  ${getSummaryPrompt(
        article.content.replace(/<[^>]+>/g, ''),
        providerConfigs.provider,
      )}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.
      `)
    }
  }, [])

  return (
    <div className="glarity--flex glarity--flex-col glarity--h-full glarity--popup">
      <div className="glarity--mb-1 glarity--flex glarity--flex-row glarity--items-center glarity--px-1">
        <img src={logo} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        <p className="glarity--text-sm glarity--font-semibold glarity--m-0 glarity--ml-1">
          {APP_TITLE}
        </p>
        <div className="glarity--grow"></div>

        <Button auto type="success" scale={0.5} onClick={onSummary}>
          Summarize
        </Button>
      </div>
      {isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && (
        <p className="glarity--m-0 glarity--mb-1">
          Tip:{' '}
          <a onClick={openShortcutsPage} className="glarity--underline glarity--cursor-pointer">
            setup shortcuts
          </a>{' '}
          for faster access.
        </p>
      )}

      <Divider />

      {question && (
        <div className="glarity--popup--card">
          <div className="glarity--container">
            <div className="glarity--chatgpt">
              <ChatGPTQuery question={question} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
