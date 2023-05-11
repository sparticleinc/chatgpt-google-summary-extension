import classNames from 'classnames'
import { useCallback } from 'preact/hooks'
import { Button } from 'antd'
import { isSafari, isIOS } from '@/utils/utils'
import { isBraveBrowser } from '@/content-script/utils'
import Browser from 'webextension-polyfill'
import { BASE_URL, ProviderType } from '@/config'

interface ErrorProps {
  error: string
  type?: string
  retry: number
  setError: (error: string) => void
  setRetry: (retry: React.SetStateAction<number>) => void
}

function Error(props: ErrorProps) {
  const { error, type, retry = 0, setError, setRetry } = props

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const newTab = useCallback(() => {
    Browser.runtime.sendMessage({
      type: 'NEW_TAB',
      data: {
        url: `${BASE_URL}/chat`,
      },
    })
  }, [])

  const handleRetry = useCallback(() => {
    setError('')
    setRetry((r) => {
      return r + 1
    })
  }, [setError, setRetry])

  if (error === 'NOTSUPPORTED') {
    return <p className={'glarity--nodrag'}>Sorry, this page is not supported.</p>
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className={'glarity--nodrag'}>
        {isSafari ? (
          <>
            Please set OpenAI API Key in the{' '}
            <Button type="link" size="small" onClick={openOptionsPage}>
              extension options
            </Button>
          </>
        ) : (
          <>
            Please login and pass Cloudflare check at{' '}
            <Button type="link" size="small" onClick={newTab}>
              chat.openai.com
            </Button>
          </>
        )}
        {retry > 0 &&
          !isIOS &&
          (() => {
            if (isBraveBrowser()) {
              return (
                <span className="glarity--block glarity--mt-2">
                  Still not working? Follow
                  <Button
                    type="link"
                    size="small"
                    href="https://github.com/sparticleinc/chatgpt-google-summary-extension#troubleshooting"
                  >
                    Brave Troubleshooting
                  </Button>
                </span>
              )
            } else {
              return (
                <>
                  .<br />
                  OpenAI requires passing a security check every once in a while. If this keeps
                  happening, change AI provider to OpenAI API in the
                  <Button type="link" size="small" onClick={openOptionsPage}>
                    extension options
                  </Button>
                </>
              )
            }
          })()}{' '}
        and{' '}
        <Button type="link" size="small" onClick={handleRetry}>
          retry
        </Button>
        .
      </p>
    )
  }

  if (error) {
    return (
      <p className={'glarity--nodrag'}>
        {type === ProviderType.GPT3 ? (
          <>
            {error === '401' ? (
              <>Failed to load response, please check the API key.</>
            ) : (
              <>Failed to load response: {error}</>
            )}
            <br />
            <Button type="link" size="small" onClick={handleRetry}>
              Retry
            </Button>
          </>
        ) : (
          <>
            {' '}
            Failed to load response from ChatGPT:
            <span className="glarity--break-all glarity--block">{error}</span>
            <Button type="link" size="small" onClick={handleRetry}>
              Retry
            </Button>
            <br />
            If this keeps happening, change AI provider to OpenAI API in the
            <Button type="link" size="small" onClick={openOptionsPage}>
              extension options
            </Button>
            .
          </>
        )}
      </p>
    )
  }

  return <></>
}

export default Error
