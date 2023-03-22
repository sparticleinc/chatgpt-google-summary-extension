import React from 'react'
import { useCallback } from 'preact/hooks'
import { Text, Textarea, Card, Button, Tag, useToasts, Radio } from '@geist-ui/core'
import { updateUserConfig, PageSummary } from '../../config'
import { changeToast } from '../../utils'

interface Props {
  pageSummaryState: string
  setPageSummaryState: (state: string) => void
  pageSummarySites: string
  setPageSummarySites: (sites: string) => void
}

function PageSummaryComponent(props: Props) {
  const { pageSummaryState, setPageSummaryState, pageSummarySites, setPageSummarySites } = props
  const { setToast } = useToasts()

  const onPageSummaryChange = useCallback(
    (pageSummary) => {
      setPageSummaryState(pageSummary)
    },
    [setPageSummaryState],
  )

  const onPageSummarySitesChange = useCallback(
    (e) => {
      const value = e.target.value || ''
      setPageSummarySites(value)
    },
    [setPageSummarySites],
  )

  const onPageSummarySave = useCallback(() => {
    updateUserConfig({ pageSummary: pageSummaryState, pageSummarySites: pageSummarySites })
    onPageSummaryChange(pageSummaryState)
    setToast(changeToast)
  }, [pageSummaryState, pageSummarySites, onPageSummaryChange, setToast])

  return (
    <>
      <Text h3 className="glarity--mt-5">
        Page Summary{' '}
        <sup>
          {' '}
          <Tag scale={1 / 3} type="success">
            Beta
          </Tag>
        </sup>
      </Text>

      <Card>
        <Card.Content>
          <Radio.Group
            value={pageSummaryState}
            onChange={(val: string) => onPageSummaryChange(val)}
          >
            {Object.values(PageSummary).map((v) => {
              return (
                <Radio key={v.name} value={v.value}>
                  {v.name}
                  {v.value === 'custom' && (
                    <Radio.Desc>
                      <div className="glarity--mt-2">
                        <Textarea
                          placeholder="https://glarity.app
https://reddit.com"
                          resize={'vertical'}
                          value={pageSummarySites}
                          style={{ width: '400px', height: '100px' }}
                          onChange={onPageSummarySitesChange}
                        />
                      </div>
                    </Radio.Desc>
                  )}
                </Radio>
              )
            })}
          </Radio.Group>
        </Card.Content>
        <Card.Footer>
          <Button scale={2 / 3} style={{ width: 20 }} type="success" onClick={onPageSummarySave}>
            Save
          </Button>
        </Card.Footer>
      </Card>
    </>
  )
}

export default PageSummaryComponent
