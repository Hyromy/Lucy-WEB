import useApi from "../../hooks/useApi"
import Main from "../../layouts/Main"
import {
  Outlet,
  useParams,
  NavLink,
} from "react-router-dom"
import type { GuildResponse } from "../../types/api"
import { useEffect } from "react"
import { discordService } from "../../services/lucy"
import { GUILD_MODULES } from "../../routes"
import useLanguage from "../../contexts/Language"

export default function ManageGuild() {
  const { data, error, request } = useApi<GuildResponse>()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (!id) {
      return
    }

    request(discordService.guilds(id))
  }, [id, request])

  useEffect(() => {
    if (error) {
      console.error("Error fetching guild data:", error)
    }
  }, [data, error])

  return (
    <Main>
      <div className="flex items-start">
        <Aside />
        <section className="flex-1">
          <Outlet context={{ data, error, loading: !data && !error }} />
        </section>
      </div>
    </Main>
  )
}

function Aside() {
  const { t } = useLanguage()

  return (
    <aside 
      className="
        w-56 pe-2 me-2 border-r border-[rgb(var(--border))] sticky top-[calc(var(--nav-h)+0.5rem)]
        display-grid gap-4 self-start
      "
    >
      {GUILD_MODULES.map((module) => (
        <NavLink
          key={module.path}
          to={module.path!}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.625rem",
            borderRadius: "6px",
            textDecoration: "none",
            color: isActive ? "#111827" : "#374151",
            backgroundColor: isActive ? "#f3f4f6" : "transparent",
          })}
        >
          {module.icon}
          <span>{t(`manageGuild.${module.label}.label` as any)}</span>
        </NavLink>
      ))}
    </aside>
  )
}
