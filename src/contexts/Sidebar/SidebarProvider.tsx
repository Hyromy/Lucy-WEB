import { useState, type ReactNode } from "react"
import { SidebarContext, type SidebarType } from "./SidebarContext"

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const [hasSidebar, setHasSidebar] = useState(false)

  const setOpen = (type: SidebarType) => {
    setActiveSidebar(type)
  }

  return (
    <SidebarContext.Provider 
      value={{ 
        activeSidebar,
        setOpen, 
        hasSidebar, 
        setHasSidebar 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
