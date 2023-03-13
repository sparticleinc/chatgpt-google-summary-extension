import Browser from 'webextension-polyfill'
import { getProviderConfigs, ProviderType } from '../config'
import { ChatGPTProvider, getChatGPTAccessToken, sendMessageFeedback } from './providers/chatgpt'
import { OpenAIProvider } from './providers/openai'
import { Provider } from './types'
import { tabSendMsg } from '../content-script/utils'
import { BASE_URL } from '../config'

async function generateAnswers(port: Browser.Runtime.Port, question: string) {
  const providerConfigs = await getProviderConfigs()

  let provider: Provider
  if (providerConfigs.provider === ProviderType.ChatGPT) {
    const token = await getChatGPTAccessToken()
    provider = new ChatGPTProvider(token)
  } else if (providerConfigs.provider === ProviderType.GPT3) {
    const { apiKey, model } = providerConfigs.configs[ProviderType.GPT3]!
    provider = new OpenAIProvider(apiKey, model)
  } else {
    throw new Error(`Unknown provider ${providerConfigs.provider}`)
  }

  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
    cleanup?.()
  })

  const { cleanup } = await provider.generateAnswer({
    prompt: question,
    signal: controller.signal,
    onEvent(event) {
      if (event.type === 'done') {
        port.postMessage({ event: 'DONE' })
        return
      }
      port.postMessage(event.data)
    },
  })
}

async function createTab(url) {
  Browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    console.log('getCurrent', tabs)
    const tab = tabs[0]

    if (tab.id) {
      Browser.storage.local.set({ glarityTabId: tab.id })
    }
  })

  const oldTabId = await Browser.storage.local.get('pinnedTabId')
  let tab
  if (oldTabId.pinnedTabId) {
    try {
      tab = await Browser.tabs.get(oldTabId.pinnedTabId)
      Browser.tabs.update(tab.id, { active: true, pinned: true })
    } catch (error) {
      console.error(error)
    }
  }
  if (!tab) {
    tab = await Browser.tabs.create({
      url,
      pinned: true,
      active: true,
    })
  }
  Browser.storage.local.set({ pinnedTabId: tab.id })
  return { pinnedTabId: tab.id }
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg)
    try {
      await generateAnswers(port, msg.question)
    } catch (err: any) {
      // console.error(err)
      port.postMessage({ error: err.message })
    }
  })
})

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'FEEDBACK') {
    const token = await getChatGPTAccessToken()
    await sendMessageFeedback(token, message.data)
  } else if (message.type === 'OPEN_OPTIONS_PAGE') {
    Browser.runtime.openOptionsPage()
  } else if (message.type === 'GET_ACCESS_TOKEN') {
    return getChatGPTAccessToken()
  } else if (message.type === 'NEW_TAB') {
    return createTab(message.data.url)
  } else if (message.type === 'GO_BACK') {
    const tab = await Browser.storage.local.get('glarityTabId')

    if (tab.glarityTabId) {
      Browser.tabs.update(tab.glarityTabId, { active: true }).catch(() => {
        Browser.tabs.create({ url: 'about:newtab', active: true })
      })
    } else {
      Browser.tabs.create({ url: 'about:newtab', active: true })
    }
  }
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.runtime.openOptionsPage()
  }
})

Browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const oldTabId = await Browser.storage.local.get('pinnedTabId')

  Browser.tabs.get(tabId).then((tab) => {
    console.log('tabId', tabId, tab, changeInfo)

    // Browser.tabs.query({}).then((tabs) => {
    //   tabs.forEach((tab) => {
    //     if (
    //       changeInfo.status === 'complete' &&
    //       tab.id &&
    //       tab.id &&
    //       oldTabId.pinnedTabId === tab.id
    //     ) {
    //       Browser.runtime.sendMessage(tab.id, { type: 'CHATGPT_TAB_CURRENT_' }).catch(() => {})
    //     }
    //   })
    // })

    if (
      tab.url?.includes(BASE_URL) &&
      changeInfo.status === 'complete' &&
      tab.id &&
      oldTabId.pinnedTabId === tab.id
    ) {
      console.log('onUpdated', oldTabId, tab)
      tabSendMsg(tab)
    }
  })
})
