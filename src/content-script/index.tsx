import { render } from 'preact'
import '../base.css'
import { getUserConfig, Language, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import { config, SearchEngine } from './search-engine-configs'
import {
  getPossibleElementByQuerySelector,
  getSearchParam,
  getLangOptionsWithLink,
  getTranscriptHTML,
  getRawTranscript,
  waitForElm,
  getConverTranscript,
} from './utils'
import { getSummaryPrompt } from './prompt'
import xss from 'xss'
import { defaultPrompt } from '../utils'
import './styles.scss'

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)![0]
const siteConfig = config[siteName]

async function mount(
  question: string,
  siteConfig: SearchEngine,
  transcript?: any,
  langOptionsWithLink?: any,
) {
  if (document.querySelector('div.glarity--container')) {
    document.querySelector('div.glarity--container')?.remove()
  }

  const container = document.createElement('div')
  container.className = 'glarity--container'

  const userConfig = await getUserConfig()
  let theme: Theme
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme()
  } else {
    theme = userConfig.theme
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt--dark')
  } else {
    container.classList.add('gpt--light')
  }

  if (siteName === 'youtube') {
    container.classList.add('glarity--chatgpt--youtube')
    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
      document.querySelector('#secondary.style-scope.ytd-watch-flexy')?.prepend(container)
    })
  } else {
    const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)

    console.log(
      'siderbarContainer',
      siderbarContainer,
      document.querySelector('#center_col')?.nextSibling,
    )

    if (siderbarContainer) {
      siderbarContainer.prepend(container)
    } else {
      // container.classList.add('sidebar--free')
      // const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
      // if (appendContainer) {
      //   appendContainer.appendChild(container)
      // }

      if (siteConfig.extabarContainerQuery && document.querySelector('#center_col')?.nextSibling) {
        container.classList.add('glarity--full-container')
        const appendContainer = getPossibleElementByQuerySelector(siteConfig.extabarContainerQuery)
        if (appendContainer) {
          appendContainer.appendChild(container)
        }
      } else {
        container.classList.add('sidebar--free')
        const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
        if (appendContainer) {
          appendContainer.appendChild(container)
        }
      }
    }
  }

  render(
    <ChatGPTContainer
      question={question}
      transcript={transcript}
      siteConfig={siteConfig}
      langOptionsWithLink={langOptionsWithLink}
      triggerMode={userConfig.triggerMode || 'always'}
    />,
    container,
  )
}

async function run() {
  const language = window.navigator.language
  const userConfig = await getUserConfig()
  console.debug('Mount ChatGPT on', siteName)

  // Youtube
  if (siteName === 'youtube') {
    const videoId = getSearchParam(window.location.href)?.v

    if (!videoId) {
      return
    }

    // Get Transcript Language Options & Create Language Select Btns
    const langOptionsWithLink = await getLangOptionsWithLink(videoId)

    console.log('langOptionsWithLink', langOptionsWithLink)

    const transcriptList = await getConverTranscript({ langOptionsWithLink, videoId, index: 0 })

    // const transcript =
    //   transcriptList.map((v) => {
    //     return `(${v.time}):${v.text}`
    //   }) || []

    // let transcriptText = transcript.join('. \r\n ')

    // transcriptText =
    //   transcriptText.length > 3700 ? transcriptText.substring(0, 3700) : transcriptText

    const videoTitle = document.title
    const videoUrl = window.location.href

    const transcript = (
      transcriptList.map((v) => {
        return `${v.text}`
      }) || []
    ).join('')

    //     const queryText = `Video transcript:

    // ${suttitleText}

    // Instructions: Use the transcript information above to summarise the highlights of this video.

    // Reply in ${userConfig.language === Language.Auto ? language : userConfig.language} Language.`

    const Instructions = userConfig.prompt ? `${userConfig.prompt}` : defaultPrompt

    const queryText = `
Title: ${videoTitle}
URL: ${videoUrl}
Transcript:${getSummaryPrompt(transcript)}

Instructions: ${Instructions}

Reply in ${userConfig.language === Language.Auto ? language : userConfig.language} Language.`

    //     const queryText = `Title: ${videoTitle}
    // URL: ${videoUrl}

    // Transcript:${getSummaryPrompt(transcript)}

    // Instructions: The above is the transcript and title of a youtube video I would like to analyze for exaggeration. Based on the content, please give a Clickbait score(Full score of 10) of the title. Please provide a brief explanation for your rating. and give a most accurate title according to the transcript and summarize the highlights of the video.

    // Reply format:
    // "Reply in the following format:"
    // **Summary**:
    // xxx \r\n
    // **Clickbait score**: x/10 \r\n
    // **Explanation**:
    // xxx \r\n
    // **Most accurate title**:
    // xxx \r\n

    // Reply in ${userConfig.language === Language.Auto ? language : userConfig.language} Language.`

    console.log('youtube queryText', queryText)

    mount(transcript.length > 0 ? queryText : '', siteConfig, transcriptList, langOptionsWithLink)
    return
  }

  // Google
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.value) {
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`

    console.log('searchValueWithLanguageOption', searchValueWithLanguageOption)
    // mount(searchValueWithLanguageOption, siteConfig)

    let searchList = ''

    //  Result list
    const resultList = document.querySelectorAll('div.MjjYud')
    if (resultList.length > 0) {
      resultList.forEach((v, i) => {
        let url = ''
        let text = ''
        const index = i + 1
        let titleWrap: Element | null = null
        let title: Element | null = null

        if (v.contains(v.querySelector('block-component'))) {
          // featured snippets
          titleWrap = v.querySelector('div.yuRUbf')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          url = titleWrap?.querySelector('a')?.href || ''
          text = v.querySelector('span.ILfuVd')?.textContent || ''
        } else if (v.contains(v.querySelector('video-voyager'))) {
          // video
          titleWrap = v.querySelector('div.ct3b9e')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          // url = titleWrap?.querySelector('a')?.href || ''
          // text = v.querySelector('div.Uroaid')?.textContent || ''
          url = ''
          text = ''
        } else {
          // link
          titleWrap = v.querySelector('div.yuRUbf')
          title = titleWrap?.querySelector('h3.LC20lb') || null
          url = titleWrap?.querySelector('a')?.href || ''
          text = v.querySelector('div.VwiC3b')?.textContent || ''
        }

        console.log(title, text, url)

        if (title) {
          const html = xss(`<span class="glarity--summary--highlight">[${index}] </span> `)
          title.insertAdjacentHTML('afterbegin', html)
        }

        if (text && url && index <= 5) {
          searchList =
            searchList +
            `
[${index}] ${text}
URL: ${url}

          `
        }
      })
    }

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const queryText = `Web search results:

${searchList}

Current date: ${year}/${month}/${day}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.
Query: ${searchInput.value}
Reply in ${userConfig.language === Language.Auto ? language : userConfig.language}`

    console.log('searchList', searchList)
    console.log('queryText', queryText)
    console.log('siteConfig', siteConfig)

    mount(searchList ? queryText : '', siteConfig, '', '')
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}
