import { Link } from "react-router-dom"
import { Moon, Sun, Contrast } from "lucide-react"
import { SiDiscord } from "@icons-pack/react-simple-icons"
import Flag from "react-flagkit"

import useTheme, { type Theme } from "../contexts/Theme"
import useLanguage, { type Language } from "../contexts/Language"
import useAuth from "../contexts/Auth"

import { Dropdown, type DropdownOption } from "../components/Dropdown"
import { Button } from "../components/Button"

import { discordOAuthService } from "../services/lucy"

import { ROUTES } from "../routes"

const size = 20
const flagSize = size * 1.4

export default function Navbar() {
  return (
    <nav 
      className="
        sticky top-0 z-100 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/80 backdrop-blur
        h-[var(--nav-h)] flex items-center
      "
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-2">
        <Link to={ROUTES.WELCOME} className="text-sm font-semibold tracking-wide">
          Lucy
        </Link>
        <div className="flex items-center gap-3">
          <DiscordButton />
          <LangSelector />
          <ThemeSelector />
        </div>
      </div>
    </nav>
  )
}

function DiscordButton() {
  const { t } = useLanguage()
  const { user, authenticated, loading, logout } = useAuth()
  const userDisplayName = user?.global_name || user?.username || "User"
  const userInitial = userDisplayName.charAt(0).toUpperCase()
  const avatarExt = user?.avatar?.startsWith("a_") ? "gif" : "png"
  const avatarUrl = user?.id && user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarExt}?size=64`
    : undefined

  const onClickHandler = () => {
    discordOAuthService.redirectToLogin()
  }

  const loginButton = (
    <Button variant="outline" onClick={onClickHandler} size="md">
      <SiDiscord size={18} color="#5865F2" />
      {t("nav.login")}
    </Button>
  )

  const userButton = (
    <Button
      variant="outline"
      onClick={logout}
      size="md"
      isLoading={loading}
      className="max-w-[220px] px-2 py-1.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-xs font-semibold text-[rgb(var(--fg))]">
        {avatarUrl ? (
          <img src={avatarUrl} alt={userDisplayName} className="h-full w-full object-cover" />
        ) : (
          userInitial
        )}
      </span>
      <span className="max-w-[150px] truncate text-left font-semibold">
        {userDisplayName}
      </span>
    </Button>
  )

  return !loading && (authenticated ? userButton : loginButton)
}

function LangSelector() {
  const { language, setLanguage } = useLanguage()

  const langOptions: DropdownOption<Language>[] = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Flag country="US" size={flagSize} /> (EN) English
        </span>
      ),
      triggerLabel: <Flag country="US" size={flagSize} />,
      value: "en",
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Flag country="MX" size={flagSize} /> (ES) Español
        </span>
      ),
      triggerLabel: <Flag country="MX" size={flagSize} />,
      value: "es",
    },
  ]

  return (
    <Dropdown
      value={language}
      options={langOptions}
      onChange={setLanguage}
    />
  )
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const themeOptions: DropdownOption<Theme>[] = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Sun size={size} /> {t("nav.theme.light")}
        </span>
      ),
      triggerLabel: <Sun size={size} />,
      value: "light" as const,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Moon size={size} /> {t("nav.theme.dark")}
        </span>
      ),
      triggerLabel: <Moon size={size} />,
      value: "dark" as const,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Contrast size={size} /> {t("nav.theme.system")}
        </span>
      ),
      triggerLabel: <Contrast size={size} />,
      value: "system" as const,
    },
  ]

  return (
    <Dropdown
      value={theme}
      options={themeOptions}
      onChange={setTheme}
    />
  )
}
