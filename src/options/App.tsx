import {
  CssBaseline,
  GeistProvider,
  Radio,
  Select,
  Text,
  Toggle,
  useToasts,
  Divider,
} from '@geist-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import '@/assets/styles/base.scss'
import {
  getUserConfig,
  Language,
  Theme,
  TriggerMode,
  TRIGGER_MODE_TEXT,
  updateUserConfig,
  DEFAULT_PAGE_SUMMARY_BLACKLIST,
} from '@/config'
import { PageSummaryProps } from './components/PageSummary'
import ProviderSelect from './components/ProviderSelect'
import { config as supportSites } from '@/content-script/search-engine-configs'
import { isIOS } from '@/utils/utils'
import Header from './components/Header'
import CustomizePrompt from './components/CustomizePrompt'
import PageSummaryComponent from './components/PageSummary'
import PageSelectionComponent, { PageSelectionProps } from './components/PageSelection'
import EnableGlarity from './components/EnableGlarity'
import { detectSystemColorScheme } from '@/utils/utils'
import {
  videoSummaryPromptHightligt,
  searchPromptHighlight,
  pageSummaryPromptHighlight,
  commentSummaryPromptHightligt,
} from '@/utils/prompt'

import './styles.scss'

function OptionsPage(
  props: {
    theme: Theme
    continueConversation: boolean
    onThemeChange: (theme: Theme) => void
  } & PageSummaryProps &
    PageSelectionProps,
) {
  const {
    setPageSummaryEnable,
    pageSummaryEnable,
    pageSummaryWhitelist,
    pageSummaryBlacklist,
    setPageSummaryWhitelist,
    setPageSummaryBlacklist,
    pageSelectionEnable,
    setPageSelectionEnable,
    continueConversation,
  } = props
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)
  const [language, setLanguage] = useState<Language>(Language.Auto)
  const { setToast } = useToasts()
  const [allSites, setAllSites] = useState<string[]>([])
  const [enableSites, setEnableSites] = useState<string[]>([])
  const [prompt, setPrompt] = useState<string>('')
  const [promptSearch, setPromptSearch] = useState<string>('')
  const [promptPage, setPromptPage] = useState<string>('')
  const [promptComment, setPromptComment] = useState<string>('')

  const onTriggerModeChange = useCallback(
    (mode: TriggerMode) => {
      setTriggerMode(mode)
      updateUserConfig({ triggerMode: mode })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const onThemeChange = useCallback(
    (theme: Theme) => {
      updateUserConfig({ theme })
      props.onThemeChange(theme)
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [props, setToast],
  )

  const onContinueChange = useCallback(
    (continueConversation: boolean) => {
      updateUserConfig({ continueConversation })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )
  const onLanguageChange = useCallback(
    (language: Language) => {
      updateUserConfig({ language })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const getSplitString = (str: string) => {
    if (str && str.includes('Chinese')) {
      return `Chinese (${str.split('Chinese')[1] || ''})`
    }

    return str ?? ''
  }

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
      setLanguage(config.language)

      setPrompt(config.prompt ? config.prompt : videoSummaryPromptHightligt)
      setPromptSearch(config.promptSearch ? config.promptSearch : searchPromptHighlight)
      setPromptPage(config.promptPage ? config.promptPage : pageSummaryPromptHighlight)
      setPromptComment(config.promptComment ? config.promptComment : commentSummaryPromptHightligt)

      const sites =
        Object.values(supportSites).map((site) => {
          return site.siteValue
        }) || []

      setAllSites(sites)
      const enableSites = config.enableSites
      setEnableSites(enableSites ? enableSites : sites)
    })
  }, [])

  return (
    <div className="glarity--container glarity--mx-auto">
      <Header />

      <main className="glarity--w-[900px] glarity--mx-auto glarity--mt-14 glarity--options">
        <Text h2>Options</Text>

        {/* Trigger Mode */}
        {!isIOS && (
          <>
            <Text h3 className="glarity--mt-5">
              Trigger Mode
            </Text>
            <Radio.Group
              value={triggerMode}
              onChange={(val) => onTriggerModeChange(val as TriggerMode)}
            >
              {Object.entries(TRIGGER_MODE_TEXT).map(([value, texts]) => {
                return (
                  <Radio key={value} value={value}>
                    {texts.title}
                    <Radio.Description>{texts.desc}</Radio.Description>
                  </Radio>
                )
              })}
            </Radio.Group>
          </>
        )}

        {/* Theme */}
        <Text h3 className="glarity--mt-5">
          Theme
        </Text>
        <Radio.Group value={props.theme} onChange={(val) => onThemeChange(val as Theme)} useRow>
          {Object.entries(Theme).map(([k, v]) => {
            return (
              <Radio key={v} value={v}>
                {k}
              </Radio>
            )
          })}
        </Radio.Group>

        {/* Continue conversation */}
        <Text h3 className="glarity--mt-5 glarity--mb-0">
          ChatGPT continue conversation
        </Text>
        <Text className="glarity--my-1">Turning it on will add ChatGPT chat history.</Text>
        <Radio.Group
          value={continueConversation ? 1 : 0}
          onChange={(val) => {
            console.log(val)
            onContinueChange(val > 0)
          }}
          useRow
        >
          <Radio key={1} value={1}>
            Open
          </Radio>
          <Radio key={0} value={0}>
            Close
          </Radio>
        </Radio.Group>

        {/* Language */}
        <Text h3 className="glarity--mt-5 glarity--mb-0">
          Language
        </Text>
        <Text className="glarity--my-1">
          The language used in ChatGPT response. <span className="glarity--italic">Auto</span> is
          recommended.
        </Text>
        <Select
          value={language}
          placeholder="Choose one"
          onChange={(val) => onLanguageChange(val as Language)}
        >
          {Object.entries(Language).map(([k, v]) => (
            <Select.Option key={k} value={v}>
              {getSplitString(String(k))}
            </Select.Option>
          ))}
        </Select>

        {/* AI Provider */}
        <Text h3 className="glarity--mt-5 glarity--mb-0">
          AI Provider
        </Text>
        <ProviderSelect />

        {/* Page Selection */}
        <PageSelectionComponent
          pageSelectionEnable={pageSelectionEnable}
          setPageSelectionEnable={setPageSelectionEnable}
        />

        <CustomizePrompt
          prompt={prompt}
          promptSearch={promptSearch}
          setPrompt={setPrompt}
          setPromptSearch={setPromptSearch}
          promptPage={promptPage}
          setPromptPage={setPromptPage}
          promptComment={promptComment}
          setPromptComment={setPromptComment}
        />

        {/* Enable/Disable Glarity */}
        <EnableGlarity
          enableSites={enableSites}
          setEnableSites={setEnableSites}
          allSites={allSites}
          supportSites={supportSites}
        />

        {/* Misc */}
        {/* <Text h3 className="glarity--mt-8">
          Misc
        </Text>
        <div className="glarity--flex glarity--flex-row glarity--items-center glarity--gap-4">
          <Toggle initialChecked disabled />
          <Text b margin={0}>
            Auto delete conversations generated by search
          </Text>
        </div> */}

        {/* <Divider /> */}

        {/* Page Summary */}
        <PageSummaryComponent
          pageSummaryEnable={pageSummaryEnable}
          setPageSummaryEnable={setPageSummaryEnable}
          pageSummaryWhitelist={pageSummaryWhitelist}
          pageSummaryBlacklist={pageSummaryBlacklist}
          setPageSummaryWhitelist={setPageSummaryWhitelist}
          setPageSummaryBlacklist={setPageSummaryBlacklist}
        />
      </main>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(Theme.Auto)
  const [continueConversation, setContinueConversation] = useState(true)
  const [pageSummaryEnable, setPageSummaryEnable] = useState(true)
  const [pageSummaryWhitelist, setPageSummaryWhitelist] = useState<string>('')
  const [pageSummaryBlacklist, setPageSummaryBlacklist] = useState<string>('')
  const [pageSelectionEnable, setPageSelectionEnable] = useState(true)

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => {
      setTheme(config.theme)
      setContinueConversation(config.continueConversation)
      setPageSummaryEnable(config.pageSummaryEnable)
      setPageSummaryWhitelist(config.pageSummaryWhitelist)
      setPageSummaryBlacklist(
        config.pageSummaryBlacklist ? config.pageSummaryBlacklist : DEFAULT_PAGE_SUMMARY_BLACKLIST,
      )
      setPageSelectionEnable(config.pageSelectionEnable)
    })
  }, [])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <OptionsPage
        theme={theme}
        continueConversation={continueConversation}
        onThemeChange={setTheme}
        setPageSummaryEnable={setPageSummaryEnable}
        pageSummaryEnable={pageSummaryEnable}
        pageSummaryWhitelist={pageSummaryWhitelist}
        pageSummaryBlacklist={pageSummaryBlacklist}
        setPageSummaryWhitelist={setPageSummaryWhitelist}
        setPageSummaryBlacklist={setPageSummaryBlacklist}
        pageSelectionEnable={pageSelectionEnable}
        setPageSelectionEnable={setPageSelectionEnable}
      />
    </GeistProvider>
  )
}

export default App
