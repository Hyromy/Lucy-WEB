import { createContext } from "react"

import type { MeResponse } from "../../types/api"

export type AuthContextType = {
  user: MeResponse | null
  authenticated: boolean
  loading: boolean
  error: Error | null
  refreshMe: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
