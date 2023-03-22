import Browser from 'webextension-polyfill'
import { Theme } from './config'

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

export const defaultPrompt = 'Summarize the above content highlights.'

export const defaultPromptSearch = `Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.`

export const customizePrompt = `Title: "{{Title}}"
Transcript: "{{Transcript}}"`

export const customizePromptSearch = `Your output should use the following template:
#### Summary
#### Highlights
- [Emoji] Bulletpoint

Your task is to summarise the text I have given you in up to seven concise bullet points, starting with a short highlight. Choose an appropriate emoji for each bullet point. Use the text above: {{Title}} {{Transcript}}.`

export const customizePrompt1 = `Your output should use the following template:
#### Summary
#### Highlights
- [Emoji] Bulletpoint

Your task is to summarise the text I have given you in up to seven concise bullet points, starting with a short highlight. Choose an appropriate emoji for each bullet point. Use the text above: {{Title}} {{Transcript}}.
`

export const customizePromptClickbait = `What is the clickbait likelihood of the title and transcript for this video? Please provide a score and a brief explanation for your score, the clickbait score is up to 10, if the clickbait score is less than 5 then answer: 👍 Clickbait Score : Low, otherwise answer: 👎 Clickbait Score : High.

Example response:
> The lower the Clickbait score, the better.
#### Clickbait Score:
👍 Clickbait Score : Low or 👎 Clickbait Score : High
#### Explanation:
The title is a bit exaggerated.
`
export const changeToast: { type: 'success'; text: string } = {
  text: 'Changes saved',
  type: 'success',
}
