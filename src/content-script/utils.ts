import Browser from 'webextension-polyfill'
import $ from 'jquery'
import copy from 'copy-to-clipboard'
import { config } from './search-engine-configs'
import { extractFromHtml } from '@/utils/article-extractor/cjs/article-extractor.esm'

export function getPossibleElementByQuerySelector<T extends Element>(
  queryArray: string[],
): T | undefined {
  for (const query of queryArray) {
    const element = document.querySelector(query)
    if (element) {
      return element as T
    }
  }
  return undefined
}

export function endsWithQuestionMark(question: string) {
  return (
    question.endsWith('?') || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟') || // Arabic
    question.endsWith('⸮') // Arabic
  )
}

export function isBraveBrowser() {
  return (navigator as any).brave?.isBrave()
}

export async function shouldShowRatingTip() {
  const { ratingTipShowTimes = 0 } = await Browser.storage.local.get('ratingTipShowTimes')
  if (ratingTipShowTimes >= 5) {
    return false
  }
  await Browser.storage.local.set({ ratingTipShowTimes: ratingTipShowTimes + 1 })
  return ratingTipShowTimes >= 2
}

export function removeHtmlTags(str: string) {
  return str.replace(/<[^>]+>/g, '')
}

export async function getLangOptionsWithLink(videoId) {
  // Get a transcript URL
  const videoPageResponse = await fetch('https://www.youtube.com/watch?v=' + videoId)
  const videoPageHtml = await videoPageResponse.text()
  const splittedHtml = videoPageHtml.split('"captions":')

  if (splittedHtml.length < 2) {
    return
  } // No Caption Available

  const captions_json = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''))
  const captionTracks = captions_json.playerCaptionsTracklistRenderer.captionTracks
  const languageOptions = Array.from(captionTracks).map((i) => {
    return i.name.simpleText
  })

  const first = 'English' // Sort by English first
  languageOptions.sort(function (x, y) {
    return x.includes(first) ? -1 : y.includes(first) ? 1 : 0
  })
  languageOptions.sort(function (x, y) {
    return x == first ? -1 : y == first ? 1 : 0
  })

  return Array.from(languageOptions).map((langName, index) => {
    const link = captionTracks.find((i) => i.name.simpleText === langName).baseUrl
    return {
      language: langName,
      link: link,
    }
  })
}

export async function getRawTranscript(link) {
  // Get Transcript
  const transcriptPageResponse = await fetch(link) // default 0
  const transcriptPageXml = await transcriptPageResponse.text()

  // Parse Transcript
  const jQueryParse = $.parseHTML(transcriptPageXml)
  const textNodes = jQueryParse[1].childNodes

  return Array.from(textNodes).map((i) => {
    return {
      start: i.getAttribute('start'),
      duration: i.getAttribute('dur'),
      text: i.textContent,
    }
  })
}

export async function getTranscriptHTML(rawTranscript: string[], videoId) {
  const scriptObjArr = [],
    timeUpperLimit = 60,
    charInitLimit = 300,
    charUpperLimit = 500
  let loop = 0,
    chars = [],
    charCount = 0,
    timeSum = 0,
    tempObj = {},
    remaining = {}

  // Sum-up to either total 60 seconds or 300 chars.
  Array.from(rawTranscript).forEach((obj, i, arr) => {
    // Check Remaining Text from Prev Loop
    if (remaining.start && remaining.text) {
      tempObj.start = remaining.start
      chars.push(remaining.text)
      remaining = {} // Once used, reset to {}
    }

    // Initial Loop: Set Start Time
    if (loop == 0) {
      tempObj.start = remaining.start ? remaining.start : obj.start
    }

    loop++

    const startSeconds = Math.round(tempObj.start)
    const seconds = Math.round(obj.start)
    timeSum = seconds - startSeconds
    charCount += obj.text.length
    chars.push(obj.text)

    if (i == arr.length - 1) {
      tempObj.text = chars.join(' ').replace(/\n/g, ' ')
      scriptObjArr.push(tempObj)
      resetNums()
      return
    }

    if (timeSum > timeUpperLimit) {
      tempObj.text = chars.join(' ').replace(/\n/g, ' ')
      scriptObjArr.push(tempObj)
      resetNums()
      return
    }

    if (charCount > charInitLimit) {
      if (charCount < charUpperLimit) {
        if (obj.text.includes('.')) {
          const splitStr = obj.text.split('.')

          // Case: the last letter is . => Process regulary
          if (splitStr[splitStr.length - 1].replace(/\s+/g, '') == '') {
            tempObj.text = chars.join(' ').replace(/\n/g, ' ')
            scriptObjArr.push(tempObj)
            resetNums()
            return
          }

          // Case: . is in the middle
          // 1. Get the (length - 2) str, then get indexOf + str.length + 1, then substring(0,x)
          // 2. Create remaining { text: str.substring(x), start: obj.start } => use the next loop
          const lastText = splitStr[splitStr.length - 2]
          const substrIndex = obj.text.indexOf(lastText) + lastText.length + 1
          const textToUse = obj.text.substring(0, substrIndex)
          remaining.text = obj.text.substring(substrIndex)
          remaining.start = obj.start

          // Replcae arr element
          chars.splice(chars.length - 1, 1, textToUse)
          tempObj.text = chars.join(' ').replace(/\n/g, ' ')
          scriptObjArr.push(tempObj)
          resetNums()
          return
        } else {
          // Move onto next loop to find .
          return
        }
      }

      tempObj.text = chars.join(' ').replace(/\n/g, ' ')
      scriptObjArr.push(tempObj)
      resetNums()
      return
    }
  })

  return Array.from(scriptObjArr).map((obj) => {
    const t = Math.round(obj.start)
    const hhmmss = convertIntToHms(t)

    return {
      time: hhmmss,
      text: obj.text,
      start: t,
    }
  })

  function resetNums() {
    ;(loop = 0), (chars = []), (charCount = 0), (timeSum = 0), (tempObj = {})
  }
}

function convertIntToHms(num) {
  const h = num < 3600 ? 14 : 11
  return new Date(num * 1000).toISOString().substring(h, 19).toString()
}

export function copyTranscript(videoId, subtitle) {
  let contentBody = ''
  const url = `https://www.youtube.com/watch?v=${videoId}`
  contentBody += `${document.title}\n`
  contentBody += `${url}\n\n`

  contentBody += `Transcript:\n`

  if (!subtitle) {
    return
  }

  if (subtitle.length <= 0) {
    return
  }

  subtitle.forEach((v) => {
    contentBody += `(${v.time}) ${v.text.replaceAll('&#39;', "'")}\n`
  })

  copy(contentBody)
}

export function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export async function getConverTranscript({ langOptionsWithLink, videoId, index }) {
  const rawTranscript = !langOptionsWithLink
    ? []
    : await getRawTranscript(langOptionsWithLink[index ? index : 0].link)

  const transcriptList = !langOptionsWithLink ? [] : await getTranscriptHTML(rawTranscript, videoId)

  return transcriptList
}

export function matchSites(site: string) {
  return /(^(www\.)?(google|baidu)\.)|(^(search\.)?yahoo\.)|(^(www|cn)\.?bing\.)|(^(www\.)?kagi\.)|(^(search\.)?naver\.)|(^(search\.)?brave\.)|(^(www\.)?duckduckgo\.)|(^(\w+\.)?yandex\.)|(^(www\.)?searx\.be)|(^news\.yahoo\.co\.jp)|(^(\w+\.)?ncbi\.nlm\.nih\.gov)|(^(www\.)?newspicks\.com)|(^(www\.)?nikkei\.com)|(^(www\.)?github\.com)|(^(www\.)?youtube\.com)/.test(
    site,
  )
}

export const hostname = location.hostname

export function siteName() {
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
      ? hostname.match(siteRegex)?.[0] || ''
      : ''
  return siteName
}

export function siteConfig() {
  return config[siteName()]
}

export const getPageSummaryContntent = async () => {
  const html = document.querySelector('html')?.outerHTML
  const url = location.href

  if (!html) {
    return
  }

  const article = await extractFromHtml(html, url)

  return article
}

export const pageSummaryJSON: {
  title: string | null
  content: string | null
  description: string | null
  rate?: string | null
} = {
  title: null,
  content: null,
  description: null,
}

export const getReviewsSites = () => {
  const hostname = location.hostname.replace(/^www\./, '')
  const site = /amazon.\w{2,}/gi.test(hostname) ? 'amazon' : hostname

  return site
}

export const getPageSummaryComments = async () => {
  const site = getReviewsSites()

  switch (site) {
    case 'amazon': {
      const reviews = document.querySelector('.cr-widget-FocalReviews')?.textContent || ''
      const rate = document.querySelector('.AverageCustomerReviews')?.textContent || ''
      let otherCountriesReviews = ''

      document
        .querySelectorAll('#cm-cr-global-review-list div.review.aok-relative')
        .forEach((review) => {
          const reviewTitle =
            review.querySelector('span.review-title.review-title-content')?.textContent || ''
          const reviewText =
            review.querySelector('div.reviewText.review-text-content')?.textContent || ''
          otherCountriesReviews += `${reviewTitle}\n${reviewText}\n\n`
        })

      return { ...pageSummaryJSON, ...{ content: reviews + otherCountriesReviews, rate } }
    }

    case 'youtube.com': {
      let reviews = ''
      document.querySelectorAll('.ytd-comments #contents #content-text').forEach((review) => {
        reviews += review?.textContent || ''
      })

      return { ...pageSummaryJSON, ...{ content: reviews, rate: '-1' } }
    }

    case 'temu.com': {
      const reviews = document.querySelector('#reviewContent')?.textContent || ''
      return { ...pageSummaryJSON, ...{ content: reviews, rate: '-1' } }
    }

    default: {
      return { ...pageSummaryJSON }
    }
  }
}
