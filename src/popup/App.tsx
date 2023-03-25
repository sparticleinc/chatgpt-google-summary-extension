import logo from '@/assets/img/logo.png'
import '@/assets/styles/base.scss'
import { APP_TITLE } from '@/config'
import { useCallback, useState } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import './styles.scss'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const [question, setQuestion] = useState('')

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
    <div className="glarity--flex glarity--flex-col glarity--h-full glarity--popup">
      <div className="glarity--mb-1 glarity--flex glarity--flex-row glarity--items-center glarity--px-1">
        <img src={logo} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        <p className="glarity--text-sm glarity--font-semibold glarity--m-0 glarity--ml-1">
          {APP_TITLE}
        </p>
      </div>
      {isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && (
        <p className="glarity--m-0 glarity--mb-1">
          Tip:{' '}
          <a onClick={openShortcutsPage} className="glarity--underline glarity--cursor-pointer">
            setup shortcuts
          </a>{' '}
          for faster access.
        </p>
      )}
    </div>
  )
}

export default App
