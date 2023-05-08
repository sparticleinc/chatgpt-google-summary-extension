import { render } from 'preact'
import '@/assets/styles/base.scss'
import { getUserConfig, getSessionValue, setSessionValue } from '@/config'
import ChatGPTTip from '@/content-script/compenents/ChatGPTTip'
import { config } from '@/content-script/search-engine-configs'
import Browser from 'webextension-polyfill'
import PageSummary from '@/content-script/compenents/PageSummary'
import mount from '@/content-script/compenents/Mount'
import getQuestion from './compenents/GetQuestion'
import { AppProvider } from '@/content-script/model/AppProvider/Provider'
import { siteConfig as sietConfigFn, waitForElm } from './utils'
import '@/content-script/styles.scss'

const siteConfig = sietConfigFn()

async function Run() {
  const userConfig = await getUserConfig()
  const siteRegex = new RegExp(
    Object.values(config)
      .map((v) => {
        return v.regex
      })
      .join('|'),
  )
  const container = document.createElement('section')
  container.className = 'glarity--summary'

  if (document.querySelector('section.glarity--summary')) {
    document.querySelector('section.glarity--summary')?.remove()
  }

  document.body.prepend(container)
  render(
    <AppProvider>
      <PageSummary
        pageSummaryEnable={userConfig.pageSummaryEnable}
        pageSummaryWhitelist={userConfig.pageSummaryWhitelist}
        pageSummaryBlacklist={userConfig.pageSummaryBlacklist}
        siteRegex={siteRegex}
      />
    </AppProvider>,
    container,
  )

  const questionData = await getQuestion()
  if (questionData) {
    mount(questionData)
  }

  Browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    const { type, data } = message
    switch (type) {
      case 'CHATGPT_TAB_CURRENT': {
        const container = document.createElement('section')
        container.className = 'glarity--chatgpt--tips'
        container.id = 'glarity--chatgpt--tips'
        document.body.prepend(container)
        render(
          <ChatGPTTip isLogin={data.isLogin} showChatGPTTip={userConfig.showChatGPTTip} />,
          container,
        )
        break
      }
      case 'GET_DOM': {
        sendResponse({ html: document.querySelector('html')?.outerHTML })
        break
      }
    }
  })
}

Run()

if (siteConfig?.watchRouteChange) {
  siteConfig.watchRouteChange(Run)
}

window.onload = async () => {
  if (window.location.hostname === 'chat.openai.com') {
    await waitForElm('textarea')

    const textarea = document.querySelector('textarea')
    const button = textarea?.nextElementSibling as HTMLButtonElement

    const prompt = (await getSessionValue('glarityChatGPTPrompt')) as string

    if (window.location.search === '?ref=glarity' && textarea && button) {
      setTimeout(async () => {
        if (prompt) {
          textarea.style.height = `${textarea.scrollHeight}px`

          textarea.value = prompt

          textarea.focus()
          button.disabled = false
          button.click()

          await setSessionValue({ key: 'glarityChatGPTPrompt', value: '' })
        }
      }, 1500)
    }
  }
}
