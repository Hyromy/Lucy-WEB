import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Main from "../layouts/Main"

import useAuth from "../hooks/useAuth"

import { ROUTES } from "../routes/paths"

export default function AuthCallback() {
  const navigate = useNavigate()
  const { refreshMe } = useAuth()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        await refreshMe()
        if (!cancelled) {
          navigate(ROUTES.DASHBOARD, { replace: true })
        }
      } catch {
        if (!cancelled) {
          navigate(ROUTES.WELCOME, { replace: true })
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [navigate, refreshMe])

  return (
    <Main>
      <p className="text-[rgb(var(--muted))]">
        Authenticating...
      </p>
    </Main>
  )
}
