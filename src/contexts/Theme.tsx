import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

type ResolvedTheme = "light" | "dark"
export type Theme = ResolvedTheme | "system"

const themeKey = "theme"
const setThemeInLS = (theme: Theme) => {
  localStorage.setItem(themeKey, theme)
}
const getThemeFromLS = (): Theme => {
  const savedTheme = localStorage.getItem(themeKey) as Theme | null
  return savedTheme || "system"
}

const getSystemTheme = (): ResolvedTheme => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme == "system"
    ? getSystemTheme()
    : theme
}

const applyThemeToDocument = (theme: Theme) => {
  const root = window.document.documentElement
  const resolvedTheme = resolveTheme(theme)

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return getThemeFromLS()
  })

  useEffect(() => {
    applyThemeToDocument(theme)
    setThemeInLS(theme)

    if (theme != "system") {
      return
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onSystemThemeChange = () => {
      applyThemeToDocument("system")
    }

    media.addEventListener("change", onSystemThemeChange)

    return () => {
      media.removeEventListener("change", onSystemThemeChange)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
