import { waitForElm } from './utils'
import { queryParam } from 'gb-url'
import { getBiliVideoId } from '../utils/bilibili'
export interface SearchEngine {
  inputQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  extabarContainerQuery?: string[]
  contentContainerQuery: string[]
  watchRouteChange?: (callback: () => void) => void
  name?: string
  siteName: string
  siteValue: string
  regex: string
  searchRegExp?: string
}

export const config: Record<string, SearchEngine> = {
  google: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    contentContainerQuery: [],
    name: 'gogole',
    siteName: 'Google',
    siteValue: 'google',
    regex: '(^(www.)?google.)',
  },
  bing: {
    inputQuery: ["[name='q']"],
    sidebarContainerQuery: ['ol#b_context'],
    appendContainerQuery: ['#b_content'],
    contentContainerQuery: [],
    siteName: 'Bing',
    siteValue: 'bing',
    regex: '(^(www|cn).?bing.com)',
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
    appendContainerQuery: ['#cols', '#contents__wrap'],
    contentContainerQuery: [],
    siteName: 'Yahoo!',
    siteValue: 'yahoo',
    regex: '(^(search.)?yahoo.)',
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.results--sidebar.js-results-sidebar'],
    appendContainerQuery: ['#links_wrapper'],
    contentContainerQuery: [],
    siteName: 'DuckDuckGo',
    siteValue: 'duckduckgo',
    regex: '(^(www.)?duckduckgo.com)',
  },
  baidu: {
    inputQuery: ["input[name='wd']"],
    sidebarContainerQuery: ['#content_right'],
    appendContainerQuery: ['#container'],
    contentContainerQuery: [],
    watchRouteChange(callback) {
      const targetNode = document.getElementById('wrapper_wrapper')!
      const observer = new MutationObserver(function (records) {
        for (const record of records) {
          if (record.type === 'childList') {
            for (const node of record.addedNodes) {
              if ('id' in node && node.id === 'container') {
                callback()
                return
              }
            }
          }
        }
      })
      observer.observe(targetNode, { childList: true })
    },
    siteName: 'Baidu',
    siteValue: 'baidu',
    regex: '(^(www.)?baidu.com)',
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
    appendContainerQuery: ['#_0_app_content'],
    contentContainerQuery: [],
    siteName: 'kagi',
    siteValue: 'kagi',
    regex: '(^(www.)?kagi.com)',
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ['#search-result-aside'],
    appendContainerQuery: [],
    contentContainerQuery: [],
    siteName: 'Yandex',
    siteValue: 'yandex',
    regex: '(^(w+.)?yandex.)',
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['#sub_pack'],
    appendContainerQuery: ['#content'],
    contentContainerQuery: [],
    siteName: 'NAVER',
    siteValue: 'naver',
    regex: '(^(search.)?naver.com)',
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#side-right'],
    appendContainerQuery: [],
    contentContainerQuery: [],
    siteName: 'Brave',
    siteValue: 'brave',
    regex: `(^(search.)?brave.com)`,
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#sidebar_results'],
    appendContainerQuery: [],
    contentContainerQuery: [],
    siteName: 'searX',
    siteValue: 'searx',
    regex: '(^(www.)?searx.be)',
  },
  youtube: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    contentContainerQuery: [],
    name: 'youtube',
    watchRouteChange(callback) {
      let currentUrl = window.location.href

      setInterval(() => {
        const videoId = queryParam('v', window.location.href)
        if (window.location.href !== currentUrl && videoId) {
          waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
            if (document.querySelector('section.glarity--container')) {
              document.querySelector('section.glarity--container')?.remove()
            }
          })

          callback()
          currentUrl = window.location.href
        }
      }, 1000)
    },
    siteName: 'YouTube',
    siteValue: 'youtube',
    regex: '(^(www.)?youtube.com)',
  },
  yahooJpNews: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#yjnFixableArea.sc-feJyhm'],
    contentContainerQuery: ['div.article_body'],
    name: 'yahooJpNews',
    siteName: 'Yahoo! JAPAN ニュース',
    siteValue: 'yahooJpNews',
    regex: '(^news.yahoo.co.jp)',
  },
  pubmed: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    // extabarContainerQuery: ['aside.page-sidebar > div.inner-wrap'],
    extabarContainerQuery: ['aside.page-sidebar', 'aside.pmc-sidebar'],
    contentContainerQuery: ['div#abstract'],
    name: 'pubmed',
    siteName: 'PubMed',
    siteValue: 'pubmed',
    regex: '((w+.)?ncbi.nlm.nih.gov)',
  },
  newspicks: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['div.right-container'],
    contentContainerQuery: ['div#body div.article-body'],
    name: 'newspicks',
    siteName: 'NewsPicks',
    siteValue: 'newspicks',
    regex: '(^(www.)?newspicks.com)',
  },
  nikkei: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['aside.aside_au9xyxw'],
    contentContainerQuery: ['section.container_c1suc6un'],
    name: 'nikkei',
    siteName: 'Nikkei',
    siteValue: 'nikkei',
    regex: '(^(www.)?nikkei.com)',
  },
  github: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['div.Layout-sidebar'],
    contentContainerQuery: ['div.Box-body'],
    name: 'github',
    siteName: 'GitHub',
    siteValue: 'github',
    regex: '(^(www.)?github.com)',
  },
  googlePatents: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['section.knowledge-card.patent-result'],
    contentContainerQuery: ['#descriptionText'],
    name: 'googlePatents',
    siteName: 'Google Patents',
    siteValue: 'googlePatents',
    regex: '(^(patents).google.com)',
    watchRouteChange(callback) {
      let currentUrl = window.location.href

      setInterval(() => {
        if (window.location.href !== currentUrl) {
          if (/patents.google.com\/patent\/\w+/g.test(location.href)) {
            waitForElm(config.googlePatents.extabarContainerQuery?.[0]).then(() => {
              if (document.querySelector('section.glarity--container')) {
                document.querySelector('section.glarity--container')?.remove()
              }
            })

            callback()
          }

          currentUrl = window.location.href
        }
      }, 1000)
    },
  },
  bilibili: {
    inputQuery: [],
    sidebarContainerQuery: [],
    appendContainerQuery: [],
    extabarContainerQuery: ['div.bpx-player-auxiliary'],
    contentContainerQuery: [],
    name: 'bilibili',
    siteName: 'Bilibili',
    siteValue: 'bilibili',
    regex: '(^(www.)?bilibili.com)',
    watchRouteChange(callback) {
      let currentUrl = window.location.href

      setInterval(() => {
        if (window.location.href !== currentUrl) {
          if (getBiliVideoId(location.href)) {
            waitForElm(config.bilibili.extabarContainerQuery?.[0]).then(() => {
              if (document.querySelector('section.glarity--container')) {
                document.querySelector('section.glarity--container')?.remove()
              }
            })

            callback()
          }

          currentUrl = window.location.href
        }
      }, 1000)
    },
  },
}
