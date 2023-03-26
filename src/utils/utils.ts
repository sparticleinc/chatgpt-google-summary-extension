import Browser from 'webextension-polyfill'
import { Theme, BASE_URL } from '@/config'

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const isFirefox = navigator.userAgent.indexOf('Firefox') != -1

export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

export const AppName = 'Glarity-Summary for Google/YouTube (ChatGPT)'

export function detectSystemColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark
  }
  return Theme.Light
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}

export const changeToast: { type: 'success'; text: string } = {
  text: 'Changes saved',
  type: 'success',
}

export function tabSendMsg(tab) {
  const { id, url } = tab
  if (url.includes(`${BASE_URL}/chat`)) {
    Browser.tabs
      .sendMessage(id, { type: 'CHATGPT_TAB_CURRENT', data: { isLogin: true } })
      .catch(() => {})
  } else {
    Browser.tabs
      .sendMessage(id, { type: 'CHATGPT_TAB_CURRENT', data: { isLogin: false } })
      .catch(() => {})
  }
}
