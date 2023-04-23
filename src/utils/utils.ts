import Browser from 'webextension-polyfill'
import { Theme, BASE_URL } from '@/config'
import GPT3Tokenizer from 'gpt3-tokenizer'
const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

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

export function isTokenExceedsLimit(text: string, limit: number) {
  const tokenLimit = limit || 400
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(text)
  const bytes = encoded.bpe.length

  console.log('isTokenExceedsLimit bytes', bytes)

  if (bytes > tokenLimit) {
    return true
  }
  return false
}

export const tokenExceedsLimitToast: { type: 'warning'; text: string } = {
  text: 'Sorry, the Prompt is over the limit, try translating it into English and saving it or reducing the word count.',
  type: 'warning',
}
