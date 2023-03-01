import {
  CssBaseline,
  GeistProvider,
  Radio,
  Select,
  Text,
  Toggle,
  useToasts,
  Code,
  Textarea,
  Card,
  Divider,
  Button,
} from '@geist-ui/core'
import { capitalize } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import '../base.css'
import {
  getUserConfig,
  Language,
  Theme,
  TriggerMode,
  TRIGGER_MODE_TEXT,
  updateUserConfig,
} from '../config'
import { defaultPrompt } from '../utils'
import logo from '../logo.png'
import { detectSystemColorScheme, getExtensionVersion } from '../utils'
import ProviderSelect from './ProviderSelect'
import './styles.scss'

function CustomizePrompt() {
  return `Title: "{{Title}}"
Transcript: "{{Transcript}}"`
}

function OptionsPage(props: { theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)
  const [language, setLanguage] = useState<Language>(Language.Auto)
  const { setToast } = useToasts()
  const [prompt, setPrompt] = useState<string>('')

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
      setLanguage(config.language)

      setPrompt(config.prompt ? config.prompt : defaultPrompt)
    })
  }, [])

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

  const onLanguageChange = useCallback(
    (language: Language) => {
      updateUserConfig({ language })
      setToast({ text: 'Changes saved', type: 'success' })
    },
    [setToast],
  )

  const onPromptChange = useCallback((e) => {
    const prompt = e.target.value || ''
    setPrompt(prompt)
    updateUserConfig({ prompt })
  }, [])

  const onSetPrompt = useCallback(() => {
    setPrompt(defaultPrompt)
  }, [])

  const getSplitString = (str: string) => {
    if (str.includes('Chinese')) {
      return `Chinese (${str.split('Chinese')[1] || ''})`
    }

    return str
  }

  return (
    <div className="container mx-auto">
      <nav className="flex flex-row justify-between items-center mt-5 px-2">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-lg" />
          <span className="font-semibold">
            Glarity-Summary for Google/YouTube (ChatGPT) (v
            {getExtensionVersion()})
          </span>
        </div>
        <div className="flex flex-row gap-3">
          {/* <a href="https://chatgpt-for-google.canny.io/changelog" target="_blank" rel="noreferrer">
            Changelog
          </a> */}
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          {/* <a href="https://twitter.com/chatgpt4google" target="_blank" rel="noreferrer">
            Twitter
          </a> */}
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </div>
      </nav>
      <main className="w-[500px] mx-auto mt-14">
        <Text h2>Options</Text>
        <Text h3 className="mt-5">
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
        <Text h3 className="mt-5">
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
        <Text h3 className="mt-5 mb-0">
          Language
        </Text>
        <Text className="my-1">
          The language used in ChatGPT response. <span className="italic">Auto</span> is
          recommended.
        </Text>
        <Select
          value={language}
          placeholder="Choose one"
          onChange={(val) => onLanguageChange(val as Language)}
        >
          {Object.entries(Language).map(([k, v]) => (
            <Select.Option key={k} value={v}>
              {capitalize(getSplitString(k))}
            </Select.Option>
          ))}
        </Select>

        <Text h3 className="mt-5 mb-0">
          Customize Prompt for Summary(YouTube)
        </Text>
        <Card className="glarity--card">
          <Text className="my-1">
            <Code block my={0}>
              <CustomizePrompt />
            </Code>
          </Text>
          <Textarea placeholder="Please enter a Prompt." value={prompt} onChange={onPromptChange} />
          <Divider />
          <Button type="secondary" ghost scale={1 / 3} onClick={onSetPrompt}>
            Use default
          </Button>
        </Card>
        <Text className="my-1">Example Prompts: </Text>
        <ul>
          <li>Summarize the above content highlights.</li>
          <li>Summarize the above in 3 bullet points.</li>
          <li>What's key takeaways from the above?</li>
          <li>Extract the gist of the above.</li>
        </ul>

        <Text h3 className="mt-5 mb-0">
          AI Provider
        </Text>
        <ProviderSelect />
        <Text h3 className="mt-8">
          Misc
        </Text>
        <div className="flex flex-row items-center gap-4">
          <Toggle initialChecked disabled />
          <Text b margin={0}>
            Auto delete conversations generated by search
          </Text>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(Theme.Auto)

  const themeType = useMemo(() => {
    if (theme === Theme.Auto) {
      return detectSystemColorScheme()
    }
    return theme
  }, [theme])

  useEffect(() => {
    getUserConfig().then((config) => setTheme(config.theme))
  }, [])

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <OptionsPage theme={theme} onThemeChange={setTheme} />
    </GeistProvider>
  )
}

export default App
