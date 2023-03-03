import { render } from 'preact'
import '../base.css'
import { getUserConfig, Language, Theme, getProviderConfigs, ProviderType } from '../config'
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

interface MountProps {
  question: string
  siteConfig: SearchEngine
  transcript?: any
  langOptionsWithLink?: any
}

const hostname = location.hostname
const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName =
  hostname === 'news.yahoo.co.jp'
    ? 'yahooJpNews'
    : hostname === 'pubmed.ncbi.nlm.nih.gov'
    ? 'pubmed'
    : hostname === 'newspicks.com'
    ? 'newspicks'
    : hostname.match(siteRegex)![0]
const siteConfig = config[siteName]

async function mount(props: MountProps) {
  const { question, siteConfig, transcript, langOptionsWithLink } = props

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

  if (siteName === 'pubmed') {
    const eleSideBar = siteConfig.extabarContainerQuery ? siteConfig.extabarContainerQuery[0] : ''
    container.classList.add('glarity--chatgpt--pubmed')
    document.querySelector(eleSideBar)?.prepend(container)
  } else if (siteName === 'yahooJpNews') {
    const eleSideBar = siteConfig.extabarContainerQuery ? siteConfig.extabarContainerQuery[0] : ''
    container.classList.add('glarity--chatgpt--yahoonews')
    document.querySelector(eleSideBar)?.prepend(container)
  } else if (siteName === 'newspicks') {
    const eleSideBar = siteConfig.extabarContainerQuery ? siteConfig.extabarContainerQuery[0] : ''
    container.classList.add('glarity--chatgpt--newspicks')
    document.querySelector(eleSideBar)?.prepend(container)
  } else if (siteName === 'youtube') {
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
  const questionData = await getQuestion(true)
  if (questionData) mount(questionData)
}

export async function getQuestion(loadInit?: boolean) {
  const language = window.navigator.language
  const userConfig = await getUserConfig()

  const providerConfigs = await getProviderConfigs()

  console.log('providerConfigs', providerConfigs)

  // PubMed
  if (siteName === 'pubmed') {
    if (!/pubmed\.ncbi\.nlm\.nih.gov\/\d{8,}/.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = document.querySelector(siteConfig.contentContainerQuery || '')?.textContent

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    console.log('content', content)

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:  ${content}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('Yahoo Japan News queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // Yahoo Japan News
  if (siteName === 'yahooJpNews') {
    if (!/\/articles\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = document.querySelector(siteConfig.contentContainerQuery || '')?.textContent

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('Yahoo Japan News queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // newspicks
  if (siteName === 'newspicks') {
    if (!/\/news\/\d+\/body\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = document.querySelector(siteConfig.contentContainerQuery || '')?.textContent

    console.log('newspiii', document.querySelector(siteConfig.contentContainerQuery || ''))

    if (!articleText) {
      return null
    }

    const queryText = `
Title: ${articleTitle}
URL: ${articleUrl}
Content:${getSummaryPrompt(articleText, providerConfigs.provider)}

Instructions: Please use the above to summarize the highlights.

Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('newspicks queryText', queryText)

    return { question: queryText, siteConfig }
  }

  // Youtube
  if (siteName === 'youtube') {
    const videoId = getSearchParam(window.location.href)?.v

    if (!videoId) {
      return ''
    }

    // Get Transcript Language Options & Create Language Select Btns
    const langOptionsWithLink = await getLangOptionsWithLink(videoId)

    console.log('langOptionsWithLink', langOptionsWithLink)

    const transcriptList = await getConverTranscript({ langOptionsWithLink, videoId, index: 0 })

    const videoTitle = document.title
    const videoUrl = window.location.href

    const transcript = (
      transcriptList.map((v) => {
        return `${v.text}`
      }) || []
    ).join('')

    const Instructions = userConfig.prompt ? `${userConfig.prompt}` : defaultPrompt

    const queryText = `Title: ${videoTitle}
Transcript: ${getSummaryPrompt(transcript, providerConfigs.provider)}

Instructions: ${Instructions}
Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.
`

    console.log('youtube queryText', queryText)

    return {
      question: transcript.length > 0 ? queryText : '',
      siteConfig,
      transcript: transcriptList,
      langOptionsWithLink,
    }
  }

  // Google
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.value) {
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`

    console.log('searchValueWithLanguageOption', searchValueWithLanguageOption)

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

        if (title && loadInit) {
          const html = xss(`<span class="glarity--summary--highlight">[${index}] </span> `)
          title.insertAdjacentHTML('afterbegin', html)
        }

        if (text && url && index <= 6) {
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

${getSummaryPrompt(searchList, providerConfigs.provider)}

Current date: ${year}/${month}/${day}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.
Query: ${searchInput.value}
Please write in ${userConfig.language === Language.Auto ? language : userConfig.language} language.`

    console.log('searchList', searchList)
    console.log('queryText', queryText)
    console.log('siteConfig', siteConfig)

    return {
      question: searchList ? queryText : searchValueWithLanguageOption,
      siteConfig,
    }
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}
