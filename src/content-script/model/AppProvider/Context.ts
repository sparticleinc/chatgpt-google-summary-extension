import { BOX_HEIGHT } from '@/config'
import { createContext } from 'react'

interface AppContextInterface {
  boxHeight: number
  setBoxHeight: (height: number) => void
  showCard: boolean
  setShowCard: (show: boolean) => void
  isScroll: boolean,
  setIsScroll: (isScroll: boolean) => void
  conversationId: string
  setConversationId: (conversationId: string) => void
  triggered: boolean
  setTriggered: (triggered: boolean) => void
}

export const AppContext = createContext<AppContextInterface>({
  boxHeight: BOX_HEIGHT,
  setBoxHeight: () => { },
  showCard: false,
  setShowCard: () => { },

  isScroll: false,
  setIsScroll: () => { },
  conversationId: '',
  setConversationId: () => { },
  triggered: false,
  setTriggered: () => { },
})
