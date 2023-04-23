import React from 'react'
import { useCallback } from 'preact/hooks'
import { Card, Text, Toggle, useToasts } from '@geist-ui/core'
import { changeToast } from '@/utils/utils'
import { updateUserConfig } from '@/config'

export interface PageSelectionProps {
  pageSelectionEnable: boolean
  setPageSelectionEnable: (state: boolean) => void
}

function PageSelectionComponent(props: PageSelectionProps) {
  const { pageSelectionEnable, setPageSelectionEnable } = props
  const { setToast } = useToasts()

  const onPageSelectionChange = useCallback(
    (e: React.ChangeEvent) => {
      const value = e.target.checked
      setPageSelectionEnable(value)
      updateUserConfig({ pageSelectionEnable: value })
      setToast(changeToast)
    },
    [setPageSelectionEnable, setToast],
  )

  return (
    <>
      <Text h3 className="glarity--mt-5">
        Page Selection{' '}
      </Text>

      <Card>
        <Card.Content>
          <Text
            h5
            className="glarity--mb-0 glarity--flex glarity--flex-row glarity--items-center glarity--gap-1"
          >
            <Toggle initialChecked checked={pageSelectionEnable} onChange={onPageSelectionChange} />
            Enable
          </Text>
          <Text className="glarity--mt-0" font="12px">
            Enable/disable page selection feature.
          </Text>
        </Card.Content>
      </Card>
    </>
  )
}

export default PageSelectionComponent
