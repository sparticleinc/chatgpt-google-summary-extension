import React from 'react'
import { useCallback } from 'preact/hooks'
import { Text, Code, Textarea, Card, Button, Snippet, Collapse, useToasts } from '@geist-ui/core'
import { Space } from 'antd'
import { updateUserConfig } from '@/config'
import { isIOS, changeToast, isTokenExceedsLimit, tokenExceedsLimitToast } from '@/utils/utils'
import {
  videoSummaryPromptHightligt,
  searchPromptHighlight,
  pageSummaryPromptHighlight,
  commentSummaryPromptHightligt,
  customizePrompt,
  customizePromptSearch,
  customizePrompt1,
  customizePromptClickbait,
  customizePromptPage,
  customizePromptComment,
  customizePromptCommentAmazon,
  customizePromptCommentYoutube,
  customizePromptQA,
  customizePromptBulletPoints,
  customizePromptSummarizeHighlights,
  customizePromptKeyTakeaways,
  customizePromptExtractGist,
} from '@/utils/prompt'

interface Props {
  prompt: string
  setPrompt: (prompt: string) => void
  promptSearch: string
  setPromptSearch: (promptSearch: string) => void
  promptPage: string
  setPromptPage: (promptPage: string) => void
  promptComment: string
  setPromptComment: (promptComment: string) => void
}

function CustomizePrompt(props: Props) {
  const {
    prompt,
    setPrompt,
    promptSearch,
    setPromptSearch,
    promptPage,
    setPromptPage,
    promptComment,
    setPromptComment,
  } = props
  const { setToast } = useToasts()

  const onPromptChange = useCallback(
    (e: React.ChangeEvent, type?: string | undefined) => {
      const prompt = e.target.value || ''

      switch (type) {
        case 'search': {
          setPromptSearch(prompt)
          break
        }

        case 'page': {
          setPromptPage(prompt)
          break
        }

        case 'comment': {
          setPromptComment(prompt)
          break
        }

        default: {
          setPrompt(prompt)
          break
        }
      }
    },
    [setPromptSearch, setPromptPage, setPromptComment, setPrompt],
  )

  const onSetPrompt = useCallback(
    (type?: string) => {
      switch (type) {
        case 'search': {
          setPromptSearch(searchPromptHighlight)
          updateUserConfig({ promptSearch: searchPromptHighlight })
          break
        }

        case 'page': {
          setPromptPage(pageSummaryPromptHighlight)
          updateUserConfig({ promptPage: pageSummaryPromptHighlight })
          break
        }

        case 'comment': {
          setPromptComment(commentSummaryPromptHightligt)
          updateUserConfig({ promptComment: commentSummaryPromptHightligt })
          break
        }

        default: {
          setPrompt(videoSummaryPromptHightligt)
          updateUserConfig({ prompt: videoSummaryPromptHightligt })
          break
        }
      }

      setToast(changeToast)
    },
    [setPrompt, setPromptComment, setPromptPage, setPromptSearch, setToast],
  )

  const onSavePrompt = useCallback(
    (type?: string) => {
      switch (type) {
        case 'search': {
          if (isTokenExceedsLimit(promptSearch, 400)) {
            setToast(tokenExceedsLimitToast)
            return
          }

          setPromptSearch(promptSearch)
          updateUserConfig({ promptSearch: promptSearch })
          break
        }

        case 'page': {
          if (isTokenExceedsLimit(promptPage, 400)) {
            setToast(tokenExceedsLimitToast)
            return
          }

          setPromptPage(promptPage)
          updateUserConfig({ promptPage: promptPage })
          break
        }

        case 'comment': {
          if (isTokenExceedsLimit(promptComment, 400)) {
            setToast(tokenExceedsLimitToast)
            return
          }

          setPromptPage(promptComment)
          updateUserConfig({ promptComment: promptComment })
          break
        }

        default: {
          if (isTokenExceedsLimit(prompt, 400)) {
            setToast(tokenExceedsLimitToast)
            return
          }

          setPrompt(prompt)
          updateUserConfig({ prompt })
          break
        }
      }

      if (isTokenExceedsLimit(prompt, 400)) {
        setToast(tokenExceedsLimitToast)
        return
      }

      updateUserConfig({ prompt })
      setToast(changeToast)
    },
    [
      prompt,
      setToast,
      setPromptSearch,
      promptSearch,
      setPromptPage,
      promptPage,
      promptComment,
      setPrompt,
    ],
  )

  return (
    <>
      {!isIOS && (
        <>
          <Text h3 className="glarity--mt-5 glarity--mb-0">
            Customize Prompt for Summary
          </Text>
          <Collapse.Group className="glarity--custom__prompt">
            {/* YouTube */}
            <Collapse
              title={
                <Text h4 className="glarity--mt-5 glarity--mb-0">
                  YouTube / Bilibili{' '}
                </Text>
              }
            >
              <Card className="glarity--card">
                <Textarea
                  placeholder="Please enter a Prompt."
                  value={prompt}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e)
                  }}
                />

                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePrompt}
                  </Code>
                </Text>

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
                    {customizePromptSummarizeHighlights}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptBulletPoints}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptKeyTakeaways}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    {customizePromptExtractGist}
                  </Snippet>
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
                <Textarea
                  placeholder="Please enter a Prompt."
                  value={promptSearch}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e, 'search')
                  }}
                />

                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePromptSearch}
                  </Code>
                </Text>

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
                    {customizePromptSummarizeHighlights}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptBulletPoints}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptKeyTakeaways}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    {customizePromptExtractGist}
                  </Snippet>
                </li>
              </ul>
            </Collapse>

            {/* Page Summary */}
            <Collapse
              title={
                <Text h4 className="glarity--mt-5 glarity--mb-0">
                  Page Summary{' '}
                </Text>
              }
            >
              <Card className="glarity--card">
                <Textarea
                  placeholder="Please enter a Prompt."
                  value={promptPage}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e, 'page')
                  }}
                />

                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePromptPage}
                  </Code>
                </Text>

                <Card.Footer>
                  <Space>
                    <Button
                      type="secondary"
                      auto
                      scale={1 / 3}
                      onClick={() => {
                        onSavePrompt('page')
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
                        onSetPrompt('page')
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
                    {customizePromptQA}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    {customizePromptSummarizeHighlights}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptBulletPoints}
                  </Snippet>
                </li>
                <li>
                  {' '}
                  <Snippet symbol="" type="secondary">
                    {customizePromptKeyTakeaways}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    Extract the gist of the above.
                  </Snippet>
                </li>
              </ul>
            </Collapse>

            {/* Comment Summary */}
            <Collapse
              title={
                <Text h4 className="glarity--mt-5 glarity--mb-0">
                  Comment Summary{' '}
                  <Text span font="12px" className="glarity--subtitle">
                    Summary of support for Amazon products and YouTube video comments.
                  </Text>
                </Text>
              }
            >
              <Card className="glarity--card">
                <Textarea
                  placeholder="Please enter a Prompt."
                  value={promptComment}
                  resize={'vertical'}
                  onChange={(e: React.ChangeEvent) => {
                    onPromptChange(e, 'comment')
                  }}
                />

                <Text className="glarity--my-1">
                  <Code block my={0}>
                    {customizePromptComment}
                  </Code>
                </Text>

                <Card.Footer>
                  <Space>
                    <Button
                      type="secondary"
                      auto
                      scale={1 / 3}
                      onClick={() => {
                        onSavePrompt('comment')
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
                        onSetPrompt('comment')
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
                    {customizePromptCommentAmazon}
                  </Snippet>
                </li>
                <li>
                  <Snippet symbol="" type="secondary">
                    {customizePromptCommentYoutube}
                  </Snippet>
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
