import { useState } from 'preact/hooks'
import type { PropsWithChildren } from 'react'
import { AppContext } from './Context'
import { BOX_HEIGHT } from '@/config'

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [boxHeight, setBoxHeight] = useState<number>(BOX_HEIGHT)

  return (
    <AppContext.Provider
      value={{
        boxHeight,
        setBoxHeight,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
