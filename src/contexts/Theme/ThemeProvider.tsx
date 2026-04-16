import {
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { ThemeContext, type ResolvedTheme, type Theme } from "./ThemeContext"

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
