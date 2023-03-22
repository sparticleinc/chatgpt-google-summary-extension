import React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import {
  Text,
  Code,
  Textarea,
  Card,
  Button,
  Snippet,
  Tag,
  Collapse,
  useToasts,
} from '@geist-ui/core'
import { Space, Tooltip } from 'antd'
import { updateUserConfig } from '../../config'
import { isIOS } from '../../utils/utils'
import {
  defaultPrompt,
  defaultPromptSearch,
  customizePrompt,
  customizePromptSearch,
  customizePrompt1,
  customizePromptClickbait,
  changeToast,
} from '../../utils'

interface Props {
  prompt: string
  setPrompt: (prompt: string) => void
  promptSearch: string
  setPromptSearch: (promptSearch: string) => void
}

function CustomizePrompt(props: Props) {
  const { prompt, setPrompt, promptSearch, setPromptSearch } = props
  const { setToast } = useToasts()

  const onPromptChange = useCallback(
    (e: React.ChangeEvent, type?: string | undefined) => {
      const prompt = e.target.value || ''
      switch (type) {
        case 'search': {
          setPromptSearch(prompt)
          break
        }

        default: {
          setPrompt(prompt)
          break
        }
      }
    },
    [setPrompt, setPromptSearch],
  )

  const onSetPrompt = useCallback(
    (type?: string) => {
      switch (type) {
        case 'search': {
          setPromptSearch(defaultPromptSearch)
          updateUserConfig({ promptSearch: defaultPromptSearch })
          break
        }

        default: {
          setPrompt(defaultPrompt)
          updateUserConfig({ prompt: defaultPrompt })
          break
        }
      }

      setToast(changeToast)
    },
    [setPrompt, setPromptSearch, setToast],
  )

  const onSavePrompt = useCallback(
    (type?: string) => {
      switch (type) {
        case 'search': {
          setPromptSearch(promptSearch)
          updateUserConfig({ promptSearch: promptSearch })
          break
        }

        default: {
          setPrompt(prompt)
          updateUserConfig({ prompt })
          break
        }
      }

      updateUserConfig({ prompt })
      setToast(changeToast)
    },
    [prompt, setToast, setPromptSearch, promptSearch, setPrompt],
  )

  return (
    <>
      {!isIOS && (
        <>
          <Text h3 className="glarity--mt-5 glarity--mb-0">
            Customize Prompt for Summary
          </Text>
          <Collapse.Group>
            {/* YouTube */}
            <Collapse
              title={
                <Text h4 className="glarity--mt-5 glarity--mb-0">
                  YouTube / Bilibili{' '}
                  <sup>
                    <Tooltip title="This is because Glarity relies on transcribed subtitles, but Bilibili videos have less support for transcribed subtitles, so the results are less than ideal.">
                      <Tag scale={1 / 3} type="success">
                        Beta
                      </Tag>
                    </Tooltip>
                  </sup>
                </Text>
              }
            >
              <Card className="glarity--card">
                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePrompt}
                  </Code>
                </Text>

                <Textarea
                  placeholder="Please enter a Prompt."
                  value={prompt}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e)
                  }}
                />

                <Card.Footer>
                  <Space>
                    <Button type="secondary" auto scale={1 / 3} onClick={onSavePrompt}>
                      Save
                    </Button>{' '}
                    <Button type="secondary" ghost auto scale={1 / 3} onClick={onSetPrompt}>
                      Use default
                    </Button>
                  </Space>
                </Card.Footer>
              </Card>
              <Text className="glarity--my-1">Example Prompts: </Text>
              <ul className="glarity--prompt__list">
                <li>
                  <Snippet symbol="" type="secondary">
                    Summarize the above content highlights.{' '}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    Summarize the above in 3 bullet points.{' '}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    What's key takeaways from the above?{' '}
                  </Snippet>
                </li>
                <li>
                  <Snippet type="secondary">Extract the gist of the above.</Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    {customizePrompt1}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="success">
                    {customizePromptClickbait}
                  </Snippet>
                </li>
              </ul>
            </Collapse>

            {/* Google */}
            <Collapse
              title={
                <Text h4 className="glarity--mt-5 glarity--mb-0">
                  Google / Bing
                </Text>
              }
            >
              <Card className="glarity--card">
                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePromptSearch}
                  </Code>
                </Text>

                <Textarea
                  placeholder="Please enter a Prompt."
                  value={promptSearch}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e, 'search')
                  }}
                />

                <Card.Footer>
                  <Space>
                    <Button
                      type="secondary"
                      auto
                      scale={1 / 3}
                      onClick={() => {
                        onSavePrompt('search')
                      }}
                    >
                      Save
                    </Button>{' '}
                    <Button
                      type="secondary"
                      ghost
                      auto
                      scale={1 / 3}
                      onClick={() => {
                        onSetPrompt('search')
                      }}
                    >
                      Use default
                    </Button>
                  </Space>
                </Card.Footer>
              </Card>
              <Text className="glarity--my-1">Example Prompts: </Text>
              <ul className="glarity--prompt__list">
                <li>
                  <Snippet symbol="" type="secondary">
                    Summarize the above content highlights.{' '}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    Summarize the above in 3 bullet points.{' '}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    What's key takeaways from the above?{' '}
                  </Snippet>
                </li>
                <li>
                  <Snippet type="secondary">Extract the gist of the above.</Snippet>
                </li>
              </ul>
            </Collapse>
          </Collapse.Group>
        </>
      )}
    </>
  )
}

export default CustomizePrompt
