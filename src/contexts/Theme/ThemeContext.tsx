import { createContext } from "react"

export type ResolvedTheme = "light" | "dark"
export type Theme = ResolvedTheme | "system"

export type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)
