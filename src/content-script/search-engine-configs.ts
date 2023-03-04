import { getSearchParam, waitForElm } from './utils'
export interface SearchEngine {
  inputQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  extabarContainerQuery?: string[]
  name?: string
  contentContainerQuery?: string[]
  watchRouteChange?: (callback: () => void) => void
}

export const config: Record<string, SearchEngine> = {
  google: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    name: 'gogole',
  },
  bing: {
    inputQuery: ["[name='q']"],
    sidebarContainerQuery: ['#b_context'],
    appendContainerQuery: [],
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
    appendContainerQuery: ['#cols', '#contents__wrap'],
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.results--sidebar.js-results-sidebar'],
    appendContainerQuery: ['#links_wrapper'],
  },
  baidu: {
    inputQuery: ["input[name='wd']"],
    sidebarContainerQuery: ['#content_right'],
    appendContainerQuery: ['#container'],
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
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
    appendContainerQuery: ['#_0_app_content'],
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ['#search-result-aside'],
    appendContainerQuery: [],
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['#sub_pack'],
    appendContainerQuery: ['#content'],
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#side-right'],
    appendContainerQuery: [],
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#sidebar_results'],
    appendContainerQuery: [],
  },
  youtube: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#extabar'],
    name: 'youtube',
    watchRouteChange(callback) {
      let currentUrl = window.location.href

      setInterval(() => {
        const videoId = getSearchParam(window.location.href)?.v
        if (window.location.href !== currentUrl && videoId) {
          waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
            if (document.querySelector('div.glarity--container')) {
              document.querySelector('div.glarity--container')?.remove()
            }
          })

          callback()
          currentUrl = window.location.href
        }
      }, 1000)
    },
  },
  yahooJpNews: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['#yjnFixableArea.sc-feJyhm'],
    contentContainerQuery: ['div.article_body'],
    name: 'yahooJpNews',
  },
  pubmed: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    // extabarContainerQuery: ['aside.page-sidebar > div.inner-wrap'],
    extabarContainerQuery: ['aside.page-sidebar', 'aside.pmc-sidebar'],
    contentContainerQuery: ['div#abstract'],
    name: 'pubmed',
  },
  newspicks: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['div.right-container'],
    contentContainerQuery: ['div#body div.article-body'],
    name: 'newspicks',
  },
  nikkei: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    extabarContainerQuery: ['aside.aside_au9xyxw'],
    contentContainerQuery: ['section.container_c1suc6un'],
    name: 'nikkei',
  },
}
