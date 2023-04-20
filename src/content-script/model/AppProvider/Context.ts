import { BOX_HEIGHT } from '@/config'
import { createContext } from 'react'

interface AppContextInterface {
  boxHeight: number
  setBoxHeight: (height: number) => void
  showCard: boolean
  setShowCard: (show: boolean) => void
}

export const AppContext = createContext<AppContextInterface>({
  boxHeight: BOX_HEIGHT,
  setBoxHeight: () => {},
  showCard: false,
  setShowCard: () => {},
})
