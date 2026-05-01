import { createContext } from "react"

export type SidebarType = "navigation" | "settings" | null

export type SidebarContextType = {
  activeSidebar: SidebarType
  setOpen: (type: SidebarType) => void
  hasSidebar: boolean
  setHasSidebar: (hasSidebar: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType | null>(null)
