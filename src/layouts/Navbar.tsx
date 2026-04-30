import {
  Moon,
  Sun,
  Contrast,
  Menu,
} from "lucide-react"
import { SiDiscord } from "@icons-pack/react-simple-icons"
import Flag from "react-flagkit"

import { Dropdown, type DropdownOption } from "../components/Dropdown"
import { Button } from "../components/Button"

import { discordOAuthService } from "../services/lucy"
import { ROUTES } from "../routes/paths"
import useLanguage from "../hooks/useLanguage"
import useAuth from "../hooks/useAuth"
import type { Language } from "../contexts/Language/LanguageContext"
import useTheme from "../hooks/useTheme"
import type { Theme } from "../contexts/Theme/ThemeContext"
import useSidebar from "../hooks/useSidebar"
import { Breadcrumb, type BreadcrumbItem } from "../components/Breadcrum"
import { useLocation, useParams } from "react-router-dom"

const size = 20
const flagSize = size * 1.4

export default function Navbar() {
  const { hasSidebar, setOpen, activeSidebar } = useSidebar()

  return (
    <nav 
      className="
        sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur
        h-nav-h flex items-center
      "
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-2">
        <div className="flex items-center gap-2">
          {hasSidebar && (
            <button 
              onClick={() => setOpen(activeSidebar == "navigation" ? null : "navigation")} 
              className="lg:hidden p-1 -ml-1 rounded-md hover:bg-border/50"
            >
              <Menu size={size} />
            </button>
          )}
          <ThisBreadcrumb />
        </div>
        <div className="flex gap-2">
          <LangSelector />
          <ThemeSelector />
          <DiscordButton />
        </div>
      </div>
    </nav>
  )
}

function ThisBreadcrumb() {
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const items: BreadcrumbItem[] = [{ label: "Home", to: ROUTES.WELCOME }]
  
  const path = location.pathname
  const pathIsInGuild = path.startsWith(ROUTES.GUILD.ROOT.split(":")[0])

  if (path.startsWith(ROUTES.DASHBOARD) || pathIsInGuild) {
    items.push({ label: "Dashboard", to: ROUTES.DASHBOARD })
  }

  if (pathIsInGuild) {
    items.push({ label: "Guild", to: ROUTES.GUILD.ROOT.replace(":id", id || "") })
  }

  console.log("Breadcrumb items:", items)

  return (
    <Breadcrumb items={items} />
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
      className="px-2 py-1.5"
    >
      <span
        className="
          flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border
          bg-bg text-xs font-semibold text-foreground
        "
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={userDisplayName} className="h-full w-full object-cover" />
        ) : (
          userInitial
        )}
      </span>
      <span className="max-w-32 truncate font-semibold">
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
