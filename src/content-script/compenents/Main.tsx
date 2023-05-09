import { useState, useEffect, useMemo } from 'preact/hooks'
import { GeistProvider } from '@geist-ui/core'
import { AppProvider } from '@/content-script/model/AppProvider/Provider'
import ChatGPTContainer, { ContainerProps } from '@/content-script/compenents/ChatGPTContainer'
import { detectSystemColorScheme } from '@/utils/utils'
import { Theme, getUserConfig } from '@/config'

function Main(props: ContainerProps) {
  const { question, transcript, langOptionsWithLink, siteConfig, triggerMode } = props

  const [theme, setTheme] = useState(Theme.Auto)

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => {
      setTheme(config.theme)
    })
  }, [])

  return (
    <>
      <GeistProvider themeType={themeType}>
        <AppProvider>
          <>
            <ChatGPTContainer
              question={question}
              transcript={transcript}
              siteConfig={siteConfig}
              langOptionsWithLink={langOptionsWithLink}
              triggerMode={triggerMode}
            />
          </>
        </AppProvider>
      </GeistProvider>
    </>
  )
}

export default Main
