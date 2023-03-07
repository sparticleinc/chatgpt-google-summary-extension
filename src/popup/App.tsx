import { GearIcon, GlobeIcon } from '@primer/octicons-react'
import { useCallback } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import '../base.css'
import logo from '../logo.png'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const accessTokenQuery = useSWR(
    'accessToken',
    () => Browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
    { shouldRetryOnError: false },
  )
  const hideShortcutsTipQuery = useSWR('hideShortcutsTip', async () => {
    const { hideShortcutsTip } = await Browser.storage.local.get('hideShortcutsTip')
    return !!hideShortcutsTip
  })

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const openShortcutsPage = useCallback(() => {
    Browser.storage.local.set({ hideShortcutsTip: true })
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  return (
    <div className="glarity--flex glarity--flex-col glarity--h-full">
      <div className="glarity--mb-2 glarity--flex glarity--flex-row glarity--items-center glarity--px-1">
        <img src={logo} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        <p className="glarity--text-sm glarity--font-semibold glarity--m-0 glarity--ml-1">
          Glarity
        </p>
        <div className="glarity--grow"></div>
        <span className="glarity--cursor-pointer glarity--leading-[0]" onClick={openOptionsPage}>
          <GearIcon size={16} />
        </span>
      </div>
      {isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && (
        <p className="glarity--m-0 glarity--mb-2">
          Tip:{' '}
          <a onClick={openShortcutsPage} className="glarity--underline glarity--cursor-pointer">
            setup shortcuts
          </a>{' '}
          for faster access.
        </p>
      )}
      {(() => {
        if (accessTokenQuery.isLoading) {
          return (
            <div className="glarity--grow glarity--justify-center glarity--items-center glarity--flex glarity--animate-bounce">
              <GlobeIcon size={24} />
            </div>
          )
        }
        if (accessTokenQuery.data) {
          return (
            <iframe src="https://chat.openai.com" className="glarity--grow glarity--border-none" />
          )
        }
        return (
          <div className="glarity--grow glarity--flex glarity--flex-col glarity--justify-center">
            <p className="glarity--text-base glarity--px-2 glarity--text-center">
              Please login and pass Cloudflare check at{' '}
              <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                chat.openai.com
              </a>
            </p>
          </div>
        )
      })()}
    </div>
  )
}

export default App
