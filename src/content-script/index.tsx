import { render } from 'preact'
import '../base.scss'
import { getUserConfig, Language, Theme, getProviderConfigs } from '../config'
import { defaultPromptSearch, detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import ChatGPTTip from './ChatGPTTip'
import { config, SearchEngine } from './search-engine-configs'
import Browser from 'webextension-polyfill'
import {
  getPossibleElementByQuerySelector,
  getSearchParam,
  getLangOptionsWithLink,
  waitForElm,
  getConverTranscript,
} from './utils'
import { getSummaryPrompt } from './prompt'
import PageSummary from './PageSummary'
import { defaultPrompt } from '../utils'
import { getBiliTranscript, getBiliVideoId } from '../utils/bilibili'
import {
  articlePrompt,
  googlePatentsPromptHighlight,
  videoPrompt,
  searchPrompt,
} from '../utils/prompt'
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
    : hostname.includes('ncbi.nlm.nih.gov')
    ? 'pubmed'
    : hostname === 'newspicks.com'
    ? 'newspicks'
    : hostname.includes('nikkei.com')
    ? 'nikkei'
    : hostname.includes('github.com')
    ? 'github'
    : hostname.includes('patents.google.com')
    ? 'googlePatents'
    : hostname.match(siteRegex)
    ? hostname.match(siteRegex)![0]
    : ''

console.log('siteName', siteName)

const siteConfig = config[siteName]

async function mount(props: MountProps) {
  const { question, siteConfig, transcript, langOptionsWithLink } = props
  if (!siteConfig) {
    return
  }
  const userConfig = await getUserConfig()

  const sites = Object.values(config).map((site) => {
    return site.siteValue
  })

  const enableSites = userConfig.enableSites ? userConfig.enableSites : sites

  const regexList = []
  Object.values(enableSites).map((v) => {
    const item = config[v]

    if (item.regex) {
      regexList.push(item.regex)
    }
  })

  if (regexList.length <= 0) {
    return
  }
  const sitesRegex = new RegExp(regexList.join('|'))

  if (!sitesRegex.test(hostname)) {
    return
  }

  if (document.querySelector('section.glarity--container')) {
    document.querySelector('section.glarity--container')?.remove()
  }

  const container = document.createElement('section')
  container.className = 'b_glarity'
  container.classList.add('glarity--container')
  container.id = 'glarity--container'

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
    container.classList.add('glarity--chatgpt--pubmed')

    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )

    console.log('appendContainer', appendContainer)

    appendContainer?.prepend(container)
  } else if (siteName === 'yahooJpNews') {
    container.classList.add('glarity--chatgpt--yahoonews')

    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'newspicks') {
    container.classList.add('glarity--chatgpt--newspicks')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'nikkei') {
    container.classList.add('glarity--chatgpt--nikkei')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'github') {
    container.classList.add('glarity--chatgpt--github')
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.extabarContainerQuery || [],
    )
    appendContainer?.prepend(container)
  } else if (siteName === 'googlePatents') {
    const extabarContainerQuery =
      siteConfig.extabarContainerQuery && siteConfig.extabarContainerQuery[0]

    if (!extabarContainerQuery) {
      return
    }

    waitForElm(extabarContainerQuery).then(() => {
      container.classList.add('glarity--chatgpt--googlePatents')
      const appendContainer = getPossibleElementByQuerySelector(
        siteConfig.extabarContainerQuery || [],
      )
      appendContainer?.prepend(container)
    })
  } else if (siteName === 'youtube') {
    container.classList.add('glarity--chatgpt--youtube')
    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
      document.querySelector('#secondary.style-scope.ytd-watch-flexy')?.prepend(container)
    })
  } else if (siteName === 'bilibili') {
    container.classList.add('glarity--chatgpt--bilibili')
    // const appendContainer = getPossibleElementByQuerySelector(
    //   siteConfig.extabarContainerQuery || [],
    // )
    // appendContainer?.prepend(container)

    waitForElm(siteConfig.extabarContainerQuery[0]).then(() => {
      container.classList.add('glarity--chatgpt--bilibili')
      const appendContainer = getPossibleElementByQuerySelector(
        siteConfig.extabarContainerQuery || [],
      )
      appendContainer?.insertAdjacentElement('beforebegin', container)
    })
  } else {
    if (siteName === 'bing') {
      if (!/bing.com\/search\?/g.test(location.href)) {
        return
      }
      container.classList.add('glarity--chatgpt--bing')
    }
    const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)

    if (siderbarContainer) {
      siderbarContainer.prepend(container)
    } else {
      if (siteConfig.extabarContainerQuery && document.querySelector('#center_col')?.nextSibling) {
        container.classList.add('glarity--full-container')
        const appendContainer = getPossibleElementByQuerySelector(siteConfig.extabarContainerQuery)
        if (appendContainer) {
          appendContainer.appendChild(container)
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

  // const root = createRoot(document.getElementById('glarity--container'), {
  //   unstable_enableAsyncRendering: true,
  // })

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

  // root.render(
  //   <>
  //     <ChatGPTContainer
  //       question={question}
  //       transcript={transcript}
  //       siteConfig={siteConfig}
  //       langOptionsWithLink={langOptionsWithLink}
  //       triggerMode={userConfig.triggerMode || 'always'}
  //     />
  //   </>,
  // )
}

async function Run() {
  Browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    console.log('run message', message)

    const { type, data } = message

    if (type === 'CHATGPT_TAB_CURRENT') {
      const container = document.createElement('section')
      container.className = 'glarity--chatgpt--tips'
      container.id = 'glarity--chatgpt--tips'
      document.body.prepend(container)

      render(<ChatGPTTip isLogin={data.isLogin} />, container)
    } else if (type === 'GET_DOM') {
      console.log('GET_DOM')
      sendResponse({ html: document.querySelector('html')?.outerHTML })
    }
  })

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
      pageSummary={userConfig.pageSummary}
      pageSummarySites={userConfig.pageSummarySites}
      siteRegex={siteRegex}
    />,
    container,
  )

  const questionData = await getQuestion(true)
  if (questionData) mount(questionData)
}

export async function getQuestion(loadInit?: boolean) {
  if (!siteConfig) {
    return
  }

  const language = window.navigator.language
  const userConfig = await getUserConfig()

  const providerConfigs = await getProviderConfigs()

  console.log('providerConfigs', providerConfigs, siteName)

  // PubMed
  if (siteName === 'pubmed') {
    if (
      !/(pubmed\.ncbi\.nlm\.nih.gov\/\d{8,})|(ncbi\.nlm\.nih\.gov\/pmc\/articles\/\w+)/.test(
        location.href,
      )
    ) {
      return null
    }

    const articleTitle = document.title || ''
    const contentElement = getPossibleElementByQuerySelector(siteConfig.contentContainerQuery || [])

    document.querySelector('div#abstract-1 + #body-1')
    let articleText
    if (contentElement) {
      articleText = contentElement?.textContent
    } else {
      const eles = [
        'div#abstract-1',
        '#body-1',
        'div#sec2',
        'div#sec3',
        'div#sec4',
        'div#sec5',
        'div#sec6',
        'div#sec7',
        'div#sec8',
        'div#sec9',
        'div#sec10',
      ]

      for (let index = 0; index < eles.length; index++) {
        const text = document.querySelector(eles[index])?.textContent

        if (text) {
          articleText = articleText + ' ' + text
        }
      }
    }

    if (!articleText) {
      return null
    }
    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
    })

    return { question: queryText, siteConfig }
  }

  // Yahoo Japan News
  if (siteName === 'yahooJpNews') {
    if (!/\/articles\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }
    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
    })

    return { question: queryText, siteConfig }
  }

  // newspicks
  if (siteName === 'newspicks') {
    if (!/\/news\/\d+\/body\//g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
    })

    return { question: queryText, siteConfig }
  }

  // nikkei
  if (siteName === 'nikkei') {
    if (!/nikkei\.com\/article\/\w+/g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
    })

    return { question: queryText, siteConfig }
  }

  // github
  if (siteName === 'github') {
    if (!/github\.com\/\w+\/\w+/g.test(location.href)) {
      return null
    }

    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = getPossibleElementByQuerySelector(
      siteConfig.contentContainerQuery || [],
    )?.textContent

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
    })

    return { question: queryText, siteConfig }
  }

  // Google Patents
  if (siteName === 'googlePatents') {
    if (!/patents.google.com\/patent\/\w+/g.test(location.href)) {
      return null
    }

    console.log('siteConfig', siteConfig)

    await waitForElm(siteConfig.contentContainerQuery[0])

    let contentDesc

    if (document.querySelector('div.description.patent-text')) {
      contentDesc = await waitForElm('div.description.patent-text')
    } else {
      // document.querySelector('#text #description')
      contentDesc = await waitForElm('#text #description')
    }

    // console.log('contentDesc', contentDesc, contentDesc2)

    const articleTitle = document.title || ''
    // const articleUrl = location.href
    const articleText = contentDesc?.textContent

    console.log('googlePatents articleText', articleText)

    if (!articleText) {
      return null
    }

    const content = getSummaryPrompt(articleText, providerConfigs.provider)

    const queryText = articlePrompt({
      title: articleTitle,
      content: content,
      language: userConfig.language === Language.Auto ? language : userConfig.language,
      prompt: googlePatentsPromptHighlight,
    })

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
    console.log('transcriptList', transcriptList)

    const videoTitle = document.title
    // const videoUrl = window.location.href

    const transcript = (
      transcriptList.map((v) => {
        return `${v.text}`
      }) || []
    ).join('')

    const Instructions = userConfig.prompt ? `${userConfig.prompt}` : defaultPrompt

    const queryText = videoPrompt({
      title: videoTitle,
      transcript: getSummaryPrompt(transcript, providerConfigs.provider),
      language: userConfig.language === Language.Auto ? language : userConfig.language,
      prompt: Instructions,
    })

    return {
      question: transcript.length > 0 ? queryText : '',
      siteConfig,
      transcript: transcriptList,
      langOptionsWithLink,
    }
  }

  // Bilibili
  if (siteName === 'bilibili') {
    const id = getBiliVideoId(window.location.href)
    if (!id) {
      return
    }

    const transcriptList = await getBiliTranscript(window.location.href)

    if (!transcriptList) {
      return
    }

    const { transcript = [], desc } = transcriptList
    const videoTitle = document.title
    let videoDesc =
      document?.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    videoDesc = videoDesc.split('视频播放量')[0]

    const content = transcript
      ? (
          transcript.map((v) => {
            return `${v.content}`
          }) || []
        ).join('')
      : desc + videoDesc

    const Instructions = userConfig.prompt ? `${userConfig.prompt}` : defaultPrompt

    const queryText = videoPrompt({
      title: videoTitle,
      transcript: getSummaryPrompt(content, providerConfigs.provider),
      language: userConfig.language === Language.Auto ? language : userConfig.language,
      prompt: Instructions,
    })

    return {
      question: content ? queryText : null,
      siteConfig,
    }
  }

  // bing
  if (siteName === 'bing') {
    const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
    if (!searchInput) return null
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.value
        : `${searchInput.value}(in ${userConfig.language})`

    console.log('searchValueWithLanguageOption', searchValueWithLanguageOption)

    let searchList = ''

    //  Result list
    const listElms = document.querySelectorAll('main > ol > li.b_algo')
    const resultList =
      listElms.length > 0 ? listElms : document.querySelectorAll('ol#b_results > li.b_algo')

    if (resultList.length > 0) {
      for (let i = 0; i < resultList.length; i++) {
        const v = resultList[i]
        const text =
          v.querySelector('.b_lineclamp2')?.textContent ||
          v.querySelector('.b_lineclamp3')?.textContent
        const index = i + 1
        let url =
          v.querySelector('a.sh_favicon')?.href ||
          v.querySelector('h2.b_topTitle > a')?.href ||
          v.querySelector('.b_title  a')?.href ||
          v.querySelector('h2  a')?.href

        if (text && url && index <= 6) {
          url = url.replace(/https?:/, '')
          searchList =
            searchList +
            `
  [${index}] ${text}\r\n
  [${index}] URL: ${url}\r\n`
        } else {
          break
        }
      }
    }

    const Instructions = userConfig.promptSearch
      ? `${userConfig.promptSearch}`
      : defaultPromptSearch

    const queryText = searchPrompt({
      query: searchInput.value,
      results: getSummaryPrompt(searchList, providerConfigs.provider),
      language: userConfig.language === Language.Auto ? language : userConfig.language,
      prompt: Instructions,
    })

    return {
      question: searchList ? queryText : searchValueWithLanguageOption,
      siteConfig,
    }
  }

  // Google
  await waitForElm(siteConfig.inputQuery[0])
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  console.log('searchInput', searchInput)
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
          const moreText = v.querySelector('div.IThcWe')?.textContent || ''
          text = text + moreText
        }

        // console.log(title, text, url)

        // if (title && loadInit) {
        //   const html = xss(`<span class="glarity--summary--highlight">[${index}] </span> `)
        //   title.insertAdjacentHTML('afterbegin', html)
        // }

        if (text && url && index <= 6) {
          url = url.replace(/https?:/, '')
          searchList =
            searchList +
            `
[${index}] ${text}\r\n
[${index}]URL: ${url}\r\n\r\n`
        }
      })
    }

    const Instructions = userConfig.promptSearch
      ? `${userConfig.promptSearch}`
      : defaultPromptSearch

    const queryText = searchPrompt({
      query: searchInput.value,
      results: getSummaryPrompt(searchList, providerConfigs.provider),
      language: userConfig.language === Language.Auto ? language : userConfig.language,
      prompt: Instructions,
    })

    return {
      question: searchList ? queryText : searchValueWithLanguageOption,
      siteConfig,
    }
  }
}

Run()

if (siteConfig?.watchRouteChange) {
  siteConfig.watchRouteChange(Run)
}
