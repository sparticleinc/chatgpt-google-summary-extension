import { Button, Divider, Card } from '@geist-ui/core'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import '../base.css'
import logo from '../logo.png'
import { extractFromHtml } from '@extractus/article-extractor'
import ChatGPTQuery from '../content-script/ChatGPTQuery'
import { getUserConfig, Language, getProviderConfigs } from '../config'
import { getSummaryPrompt } from '../content-script/prompt'
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
          Glarity Summary
        </p>
        <div className="glarity--grow"></div>

        {/* <span className="glarity--cursor-pointer glarity--leading-[0]" onClick={openOptionsPage}>
          <GearIcon size={16} />
        </span> */}

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

      {/* <div className="glarity--popup--card">
        <Divider />

        <div class="glarity--container">
          <div class="glarity--chatgpt">
            <div class="markdown-body gpt-markdown" id="gpt-answer" dir="auto">
              <div class="glarity--chatgpt--header">
                <div class="gpt--feedback">
                  <span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      class="octicon octicon-thumbsup"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="currentColor"
                      style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
                    >
                      <path d="M8.834.066c.763.087 1.5.295 2.01.884.505.581.656 1.378.656 2.3 0 .467-.087 1.119-.157 1.637L11.328 5h1.422c.603 0 1.174.085 1.668.333.508.254.911.679 1.137 1.2.453.998.438 2.447.188 4.316l-.04.306c-.105.79-.195 1.473-.313 2.033-.131.63-.315 1.209-.668 1.672C13.97 15.847 12.706 16 11 16c-1.848 0-3.234-.333-4.388-.653-.165-.045-.323-.09-.475-.133-.658-.186-1.2-.34-1.725-.415A1.75 1.75 0 0 1 2.75 16h-1A1.75 1.75 0 0 1 0 14.25v-7.5C0 5.784.784 5 1.75 5h1a1.75 1.75 0 0 1 1.514.872c.258-.105.59-.268.918-.508C5.853 4.874 6.5 4.079 6.5 2.75v-.5c0-1.202.994-2.337 2.334-2.184ZM4.5 13.3c.705.088 1.39.284 2.072.478l.441.125c1.096.305 2.334.598 3.987.598 1.794 0 2.28-.223 2.528-.549.147-.193.276-.505.394-1.07.105-.502.188-1.124.295-1.93l.04-.3c.25-1.882.189-2.933-.068-3.497a.921.921 0 0 0-.442-.48c-.208-.104-.52-.174-.997-.174H11c-.686 0-1.295-.577-1.206-1.336.023-.192.05-.39.076-.586.065-.488.13-.97.13-1.328 0-.809-.144-1.15-.288-1.316-.137-.158-.402-.304-1.048-.378C8.357 1.521 8 1.793 8 2.25v.5c0 1.922-.978 3.128-1.933 3.825a5.831 5.831 0 0 1-1.567.81ZM2.75 6.5h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                    </svg>
                  </span>
                  <span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      class="octicon octicon-thumbsdown"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="currentColor"
                      style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
                    >
                      <path d="M7.083 15.986c-.763-.087-1.499-.295-2.011-.884-.504-.581-.655-1.378-.655-2.299 0-.468.087-1.12.157-1.638l.015-.112H3.167c-.603 0-1.174-.086-1.669-.334a2.415 2.415 0 0 1-1.136-1.2c-.454-.998-.438-2.447-.188-4.316l.04-.306C.32 4.108.41 3.424.526 2.864c.132-.63.316-1.209.669-1.672C1.947.205 3.211.053 4.917.053c1.848 0 3.234.332 4.388.652l.474.133c.658.187 1.201.341 1.726.415a1.75 1.75 0 0 1 1.662-1.2h1c.966 0 1.75.784 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-1a1.75 1.75 0 0 1-1.514-.872c-.259.105-.59.268-.919.508-.671.491-1.317 1.285-1.317 2.614v.5c0 1.201-.994 2.336-2.334 2.183Zm4.334-13.232c-.706-.089-1.39-.284-2.072-.479l-.441-.125c-1.096-.304-2.335-.597-3.987-.597-1.794 0-2.28.222-2.529.548-.147.193-.275.505-.393 1.07-.105.502-.188 1.124-.295 1.93l-.04.3c-.25 1.882-.19 2.933.067 3.497a.923.923 0 0 0 .443.48c.208.104.52.175.997.175h1.75c.685 0 1.295.577 1.205 1.335-.022.192-.049.39-.075.586-.066.488-.13.97-.13 1.329 0 .808.144 1.15.288 1.316.137.157.401.303 1.048.377.307.035.664-.237.664-.693v-.5c0-1.922.978-3.127 1.932-3.825a5.878 5.878 0 0 1 1.568-.809Zm1.75 6.798h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25Z"></path>
                    </svg>
                  </span>
                  <span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      class="octicon octicon-copy"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="currentColor"
                      style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
                    >
                      <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                      <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                    </svg>
                  </span>
                </div>
              </div>
              <p>
                ChatGPT是由OpenAI开发的一种语言模型。它是一种大型的、预先训练的基于Transformer的神经网络，旨在根据用户提供的提示生成类人文本。它已经被训练在各种互联网文本上，并可以回答广泛的话题，包括常识问题、对话回应和创意写作。而Glarity-
                Google/YouTube摘要是一款浏览器扩展，它可以同时在Google搜索结果和Youtube中显示ChatGPT的摘要。
              </p>
            </div>
          </div>
        </div>
      </div> */}

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
