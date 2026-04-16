import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"

import { authService, discordService } from "../../services/lucy"
import type { MeResponse } from "../../types/api"

import { AuthContext } from "./AuthContext"
import { ROUTES } from "../../routes/paths"

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [user, setUser] = useState<MeResponse | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshMe = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const me = await discordService.me()
      const isAuthenticated =
        typeof me?.authenticated == "boolean"
          ? me.authenticated
          : true

      setUser(me)
      setAuthenticated(isAuthenticated)
    
    } catch (err) {
      setUser(null)
      setAuthenticated(false)
      const mappedError = err instanceof Error
        ? err
        : new Error("Failed to fetch user info")
        
      setError(mappedError)
      throw mappedError
    
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setAuthenticated(false)
      setUser(null)

      navigate(ROUTES.WELCOME, { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    void refreshMe().catch(() => undefined)
  }, [refreshMe])

  const value = useMemo(
    () => ({ user, authenticated, loading, error, refreshMe, logout }),
    [user, authenticated, loading, error, refreshMe, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
