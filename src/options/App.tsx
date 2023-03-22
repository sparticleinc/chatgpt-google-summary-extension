import {
  CssBaseline,
  GeistProvider,
  Radio,
  Select,
  Text,
  Toggle,
  useToasts,
  Textarea,
  Card,
  Button,
  Checkbox,
  Spacer,
  Tag,
  Divider,
} from '@geist-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import '../base.scss'
import {
  getUserConfig,
  Language,
  Theme,
  TriggerMode,
  TRIGGER_MODE_TEXT,
  updateUserConfig,
  PageSummary,
} from '../config'

import ProviderSelect from './ProviderSelect'
import { config as supportSites } from '../content-script/search-engine-configs'
import { isIOS } from '../utils/utils'
import Header from './components/Header'
import CustomizePrompt from './components/CustomizePrompt'
import PageSummaryComponent from './components/PageSummary'
import { defaultPrompt, defaultPromptSearch, detectSystemColorScheme } from '../utils'
import './styles.scss'

function OptionsPage(props: {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  pageSummary: any
  onPageSummaryChange: (pageSummary) => void
}) {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)
  const [language, setLanguage] = useState<Language>(Language.Auto)
  const { setToast } = useToasts()
  const [allSites, setAllSites] = useState([])
  const [enableSites, setEnableSites] = useState([])
  const [allSelect, setAllSelect] = useState(true)
  const [pageSummaryState, setPageSummaryState] = useState<string>(props.pageSummary)
  const [pageSummarySites, setPageSummarysites] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [promptSearch, setPromptSearch] = useState<string>('')

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

  const onPageSummaryChange = useCallback((pageSummary) => {
    setPageSummaryState(pageSummary)
  }, [])

  const onPageSummarySitesChange = useCallback((e) => {
    const value = e.target.value || ''
    setPageSummarysites(value)
  }, [])

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

  const onSaveSelect = useCallback(() => {
    updateUserConfig({ enableSites })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [setToast, enableSites])

  const onChangeSites = (value) => {
    setEnableSites(value)
  }

  const onChangeSelectAll = (e) => {
    if (e.target.checked) {
      setEnableSites(allSites)
    } else {
      setEnableSites([])
    }
  }

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
      setLanguage(config.language)

      onPageSummaryChange(config.pageSummary)
      setPageSummarysites(config.pageSummarySites)

      setPrompt(config.prompt ? config.prompt : defaultPrompt)
      setPromptSearch(config.promptSearch ? config.promptSearch : defaultPromptSearch)

      const sites =
        Object.values(supportSites).map((site) => {
          return site.siteValue
        }) || []

      setAllSites(sites)
      setEnableSites(config.enableSites ? config.enableSites : sites)
    })
  }, [])

  useEffect(() => {
    if (enableSites.length === allSites.length) {
      setAllSelect(true)
    } else {
      setAllSelect(false)
    }
  }, [enableSites, allSites])

  return (
    <div className="glarity--container glarity--mx-auto">
      <Header />

      <main className="glarity--w-[900px] glarity--mx-auto glarity--mt-14 glarity--options">
        <Text h2>Options</Text>

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

        <Text h3 className="glarity--mt-5 glarity--mb-0">
          AI Provider
        </Text>
        <ProviderSelect />

        <CustomizePrompt
          prompt={prompt}
          promptSearch={promptSearch}
          setPrompt={setPrompt}
          setPromptSearch={setPromptSearch}
        />

        {!isIOS && (
          <>
            <Text h3 className="glarity--mt-5">
              Enable/Disable Glarity
              <Text font="12px" my={0}>
                You can enable/disable the Glarity Summary on the following website.
              </Text>
            </Text>

            <Card>
              <Card.Content>
                <Checkbox.Group
                  value={enableSites}
                  onChange={onChangeSites}
                  className="glarity--support__sites"
                >
                  {Object.entries(supportSites).map(([k, v]) => {
                    return (
                      <Checkbox
                        key={k}
                        value={v.siteValue}
                        className="glarity--support__sites--item"
                      >
                        {v.siteName}
                      </Checkbox>
                    )
                  })}
                </Checkbox.Group>
              </Card.Content>
              <Card.Footer>
                <Checkbox checked={allSelect} value="selectAll" onChange={onChangeSelectAll}>
                  Select All / Reverse
                </Checkbox>
                <Spacer w={2} />
                <Button type="secondary" auto scale={1 / 3} onClick={onSaveSelect}>
                  Save
                </Button>
              </Card.Footer>
            </Card>
          </>
        )}

        <Text h3 className="glarity--mt-8">
          Misc
        </Text>
        <div className="glarity--flex glarity--flex-row glarity--items-center glarity--gap-4">
          <Toggle initialChecked disabled />
          <Text b margin={0}>
            Auto delete conversations generated by search
          </Text>
        </div>

        <Divider />

        <PageSummaryComponent
          pageSummaryState={pageSummaryState}
          setPageSummaryState={setPageSummaryState}
          pageSummarySites={pageSummarySites}
          setPageSummarySites={setPageSummarysites}
        />
      </main>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(Theme.Auto)
  const [pageSummary, setPageSummary] = useState('all')

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => {
      setTheme(config.theme)
      setPageSummary(config.pageSummary)
    })
  }, [])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <OptionsPage
        theme={theme}
        onThemeChange={setTheme}
        pageSummary={pageSummary}
        onPageSummaryChange={setPageSummary}
      />
    </GeistProvider>
  )
}

export default App
