import { useState } from 'preact/hooks'
import type { PropsWithChildren } from 'react'
import { AppContext } from './Context'
import { BOX_HEIGHT } from '@/config'

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [boxHeight, setBoxHeight] = useState<number>(BOX_HEIGHT)
  const [showCard, setShowCard] = useState(false)
  const [isScroll, setIsScroll] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [triggered, setTriggered] = useState(false)

  return (
    <AppContext.Provider
      value={{
        boxHeight,
        setBoxHeight,
        showCard,
        setShowCard,
        isScroll,
        setIsScroll,
        conversationId,
        setConversationId,
        triggered,
        setTriggered,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
