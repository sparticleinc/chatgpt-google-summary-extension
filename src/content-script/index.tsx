import { render } from 'preact'
import '@/assets/styles/base.scss'
import { getUserConfig } from '@/config'
import ChatGPTTip from '@/content-script/compenents/ChatGPTTip'
import { config } from '@/content-script/search-engine-configs'
import Browser from 'webextension-polyfill'
import PageSummary from '@/content-script/compenents/PageSummary'
import mount from '@/content-script/compenents/Mount'
import getQuestion from './compenents/GetQuestion'
import { siteConfig as sietConfigFn } from './utils'
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
  document.body.prepend(container)
  render(
    <PageSummary
      pageSummaryEnable={userConfig.pageSummaryEnable}
      pageSummaryWhitelist={userConfig.pageSummaryWhitelist}
      pageSummaryBlacklist={userConfig.pageSummaryBlacklist}
      siteRegex={siteRegex}
    />,
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
        render(<ChatGPTTip isLogin={data.isLogin} />, container)
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
