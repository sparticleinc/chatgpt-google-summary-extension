import Browser from 'webextension-polyfill'
import { Theme } from './config'

export function detectSystemColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark
  }
  return Theme.Light
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}

export const defaultPrompt = 'Summarize the above content highlights.'
// export const defaultPrompt = `Your output should use the following template:
// ### Summary
// ### Highlights
// - [Emoji] Bulletpoint

// Your task is to summarise the text I have given you in up to seven concise bullet points, starting with a short highlight. Choose an appropriate emoji for each bullet point. Use the text above: {{Title}} {{Transcript}}.
// `
