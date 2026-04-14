import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import useAuth from "../contexts/Auth"

import Main from "../layouts/Main"

import { ROUTES } from "../routes"

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
