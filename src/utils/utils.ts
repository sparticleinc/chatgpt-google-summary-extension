import Browser from 'webextension-polyfill'
import { Theme } from '@/config'

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
