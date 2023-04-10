import { Button, Input, Spinner, useInput, useToasts, Radio, Card, Grid } from '@geist-ui/core'
import { FC, useCallback, useState, useEffect } from 'react'
import useSWR from 'swr'
import {
  CHAT_MODEL,
  ChatModelType,
  getProviderConfigs,
  ProviderConfigs,
  ProviderType,
  saveProviderConfigs,
} from '@/config'
import { Select as Aselect } from 'antd'
const { Option } = Aselect
import { isSafari } from '@/utils/utils'

interface ConfigProps {
  config: ProviderConfigs
  models: string[]
}

const ConfigPanel: FC<ConfigProps> = ({ config, models }) => {
  const [tab, setTab] = useState<ProviderType>(isSafari ? ProviderType.GPT3 : config.provider)
  const { bindings: apiKeyBindings } = useInput(config.configs[ProviderType.GPT3]?.apiKey ?? '')
  const { bindings: apiHostBindings } = useInput(config.configs[ProviderType.GPT3]?.apiHost ?? '')
  const [model, setModel] = useState(config.configs[ProviderType.GPT3]?.model ?? models[0])
  const [chatModel, setChatModel] = useState(config.chatModel ?? CHAT_MODEL[0]?.code)
  const [chatModelDesc, setChatModelDesc] = useState(
    CHAT_MODEL[chatModel]?.desc ?? CHAT_MODEL[0]?.desc,
  )
  const { setToast } = useToasts()

  const save = useCallback(async () => {
    if (tab === ProviderType.GPT3) {
      if (!apiKeyBindings.value) {
        alert('Please enter your OpenAI API key')
        return
      }

      if (!model || !models.includes(model)) {
        alert('Please select a valid model')
        return
      }
    }

    let apiHost = apiHostBindings.value || ''
    apiHost = apiHost.replace(/^http(s)?:\/\//, '')

    await saveProviderConfigs(
      tab,
      {
        [ProviderType.GPT3]: {
          model,
          apiKey: apiKeyBindings.value,
          apiHost: apiHost,
        },
      },
      chatModel,
    )
    setToast({ text: 'Changes saved', type: 'success' })
  }, [apiHostBindings.value, apiKeyBindings.value, model, models, setToast, tab, chatModel])

  useEffect(() => {
    const chatModelObj = CHAT_MODEL.find((v) => v.code === chatModel)
    setChatModelDesc(chatModelObj?.desc ?? CHAT_MODEL[0]?.desc)
  }, [chatModel])

  useEffect(() => {
    console.log('config', config)
    console.log('models', models)
  }, [config, models])

  return (
    <>
      <Card className="glarity--card">
        <div className="glarity--flex glarity--flex-col glarity--gap-3">
          <Radio.Group value={tab} onChange={(v) => setTab(v as ProviderType)}>
            {!isSafari && (
              <>
                <Radio value={ProviderType.ChatGPT}>
                  ChatGPT webapp
                  <Radio.Desc>
                    <Aselect
                      defaultValue={chatModel}
                      onChange={(v) => setChatModel(v as ChatModelType)}
                      placeholder="model"
                      optionLabelProp="label"
                      style={{ width: '140px' }}
                    >
                      {CHAT_MODEL.map((m) => (
                        <Option key={m.code} value={m.code} label={m.name}>
                          {m.name}
                        </Option>
                      ))}
                    </Aselect>{' '}
                    {chatModelDesc}
                  </Radio.Desc>
                </Radio>
              </>
            )}

            <Radio value={ProviderType.GPT3}>
              OpenAI API
              <Radio.Desc>
                <div className="glarity--flex glarity--flex-col glarity--gap-2">
                  <span>
                    OpenAI official API, more stable,{' '}
                    <span className="glarity--font-semibold">charge by usage</span>
                  </span>
                  <div className="glarity--flex glarity--flex-row glarity--gap-2 glarity--geist--select">
                    <Grid.Container gap={2}>
                      <Grid md={8} sm={24}>
                        <Input
                          htmlType="text"
                          placeholder="api.openai.com"
                          label="API Host"
                          scale={2 / 3}
                          clearable
                          {...apiHostBindings}
                        />
                      </Grid>
                      <Grid md={8} sm={24}>
                        <Aselect
                          defaultValue={model}
                          onChange={(v) => setModel(v as string)}
                          placeholder="model"
                          optionLabelProp="label"
                          style={{ width: '170px' }}
                        >
                          {models.map((m) => (
                            <Option key={m} value={m} label={m}>
                              {m}
                            </Option>
                          ))}
                        </Aselect>
                      </Grid>
                      <Grid md={8} sm={24}>
                        <Input
                          htmlType="password"
                          placeholder="sk-********"
                          label="API key"
                          scale={2 / 3}
                          clearable
                          {...apiKeyBindings}
                        />
                      </Grid>
                    </Grid.Container>
                  </div>
                  <span className="glarity--italic glarity--text-xs">
                    You can find or create your API key{' '}
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noreferrer"
                    >
                      here
                    </a>
                  </span>
                </div>
              </Radio.Desc>
            </Radio>
          </Radio.Group>
          <Card.Footer>
            <Button scale={2 / 3} style={{ width: 20 }} type="success" onClick={save}>
              Save
            </Button>
          </Card.Footer>
        </div>
      </Card>
    </>
  )
}

function ProviderSelect() {
  const query = useSWR('provider-configs', async () => {
    const [config] = await Promise.all([getProviderConfigs()])

    return { config }
  })

  const models = [
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0301',
    'text-davinci-003',
    // 'text-curie-001',
    // 'text-babbage-001',
    // 'text-ada-001',
    // 'text-chat-davinci-002-20221122',
  ]

  if (query.isLoading) {
    return <Spinner />
  }
  return <ConfigPanel config={query.data!.config} models={models} />
}

export default ProviderSelect
