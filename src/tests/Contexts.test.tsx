import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AuthProvider } from "../contexts/Auth/AuthProvider"
import { LanguageProvider } from "../contexts/Language/LanguageProvider"
import { ThemeProvider } from "../contexts/Theme/ThemeProvider"
import useAuth from "../hooks/useAuth"
import useLanguage from "../hooks/useLanguage"
import useTheme from "../hooks/useTheme"
import { ROUTES } from "../routes/paths"

const { navigateMock, meMock, logoutMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  meMock: vi.fn(),
  logoutMock: vi.fn(),
}))

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}))

vi.mock("../services/lucy", () => ({
  discordService: {
    me: meMock,
  },
  authService: {
    logout: logoutMock,
  },
}))

function ThemeHarness() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={() => setTheme("light")}>set-light</button>
      <button onClick={() => setTheme("system")}>set-system</button>
    </div>
  )
}

function LanguageHarness() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div>
      <span data-testid="language-value">{language}</span>
      <span data-testid="translated-save">{t("save")}</span>
      <button onClick={() => setLanguage("en")}>set-en</button>
      <button onClick={() => setLanguage("es")}>set-es</button>
    </div>
  )
}

function AuthHarness() {
  const { authenticated, loading, user, error, logout } = useAuth()

  return (
    <div>
      <span data-testid="auth-value">{String(authenticated)}</span>
      <span data-testid="loading-value">{String(loading)}</span>
      <span data-testid="user-value">{user?.username ?? ""}</span>
      <span data-testid="error-value">{error?.message ?? ""}</span>
      <button onClick={() => { void logout().catch(() => undefined) }}>logout</button>
    </div>
  )
}

const mockMatchMedia = (matches: boolean) => {
  const addEventListener = vi.fn()
  const removeEventListener = vi.fn()

  const mediaQueryList = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue(mediaQueryList),
  })

  return { addEventListener, removeEventListener }
}

describe("Providers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    document.documentElement.classList.remove("light", "dark")
  })

  describe("ThemeProvider", () => {
    it("loads theme from localStorage and applies class", () => {
      localStorage.setItem("theme", "dark")
      mockMatchMedia(false)

      render(
        <ThemeProvider>
          <ThemeHarness />
        </ThemeProvider>
      )

      expect(screen.getByTestId("theme-value").textContent).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("updates class and localStorage when theme changes", () => {
      mockMatchMedia(false)

      render(
        <ThemeProvider>
          <ThemeHarness />
        </ThemeProvider>
      )

      fireEvent.click(screen.getByRole("button", { name: "set-dark" }))

      expect(screen.getByTestId("theme-value").textContent).toBe("dark")
      expect(localStorage.getItem("theme")).toBe("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })

    it("subscribes and unsubscribes system theme listener", () => {
      const { addEventListener, removeEventListener } = mockMatchMedia(true)

      const { unmount } = render(
        <ThemeProvider>
          <ThemeHarness />
        </ThemeProvider>
      )

      expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function))

      const listener = addEventListener.mock.calls[0][1]
      unmount()

      expect(removeEventListener).toHaveBeenCalledWith("change", listener)
    })
  })

  describe("LanguageProvider", () => {
    it("defaults to spanish and translates keys", () => {
      render(
        <LanguageProvider>
          <LanguageHarness />
        </LanguageProvider>
      )

      expect(screen.getByTestId("language-value").textContent).toBe("es")
      expect(screen.getByTestId("translated-save").textContent).toBe("Guardar")
    })

    it("loads language from localStorage and persists updates", () => {
      localStorage.setItem("lang", "en")

      render(
        <LanguageProvider>
          <LanguageHarness />
        </LanguageProvider>
      )

      expect(screen.getByTestId("language-value").textContent).toBe("en")
      expect(screen.getByTestId("translated-save").textContent).toBe("Save")

      fireEvent.click(screen.getByRole("button", { name: "set-es" }))

      expect(screen.getByTestId("language-value").textContent).toBe("es")
      expect(localStorage.getItem("lang")).toBe("es")
      expect(screen.getByTestId("translated-save").textContent).toBe("Guardar")
    })

    it("falls back to spanish for invalid localStorage language", () => {
      localStorage.setItem("lang", "fr")

      render(
        <LanguageProvider>
          <LanguageHarness />
        </LanguageProvider>
      )

      expect(screen.getByTestId("language-value").textContent).toBe("es")
      expect(screen.getByTestId("translated-save").textContent).toBe("Guardar")
    })
  })

  describe("AuthProvider", () => {
    it("loads user on mount and marks session as authenticated", async () => {
      meMock.mockResolvedValue({ authenticated: true, username: "lucy" })
      logoutMock.mockResolvedValue(undefined)

      render(
        <AuthProvider>
          <AuthHarness />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("loading-value").textContent).toBe("false")
      })

      expect(screen.getByTestId("auth-value").textContent).toBe("true")
      expect(screen.getByTestId("user-value").textContent).toBe("lucy")
      expect(screen.getByTestId("error-value").textContent).toBe("")
    })

    it("defaults authenticated to true when API omits the field", async () => {
      meMock.mockResolvedValue({ username: "no-flag" })

      render(
        <AuthProvider>
          <AuthHarness />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("loading-value").textContent).toBe("false")
      })

      expect(screen.getByTestId("auth-value").textContent).toBe("true")
    })

    it("stores error and unauthenticates when refresh fails", async () => {
      meMock.mockRejectedValue(new Error("failed me"))

      render(
        <AuthProvider>
          <AuthHarness />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("loading-value").textContent).toBe("false")
      })

      expect(screen.getByTestId("auth-value").textContent).toBe("false")
      expect(screen.getByTestId("user-value").textContent).toBe("")
      expect(screen.getByTestId("error-value").textContent).toBe("failed me")
    })

    it("always navigates to welcome on logout even if logout API fails", async () => {
      meMock.mockResolvedValue({ authenticated: true, username: "to-logout" })
      logoutMock.mockRejectedValue(new Error("logout failed"))

      render(
        <AuthProvider>
          <AuthHarness />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId("auth-value").textContent).toBe("true")
      })

      fireEvent.click(screen.getByRole("button", { name: "logout" }))

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith(ROUTES.WELCOME, { replace: true })
      })

      expect(screen.getByTestId("auth-value").textContent).toBe("false")
      expect(screen.getByTestId("user-value").textContent).toBe("")
    })
  })
})
