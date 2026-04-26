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
import useLanguage from "../../hooks/useLanguage"
import { GUILD_MODULES } from "../../routes/modules"
import type { GUILD_MODULE_KEY } from "../../routes/paths"
import useSidebar from "../../hooks/useSidebar"
import { OffCanvas } from "../../components/OffCanvas"

export default function ManageGuild() {
  const { data, error, request } = useApi<GuildResponse>()
  const { id } = useParams<{ id: string }>()
  const { setHasSidebar, activeSidebar, setOpen } = useSidebar()

  const openNull = () => setOpen(null)

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

  useEffect(() => {
    setHasSidebar(true)
    return () => setHasSidebar(false)
  }, [setHasSidebar])

  return (
    <Main>
      <div className="flex items-start">
        <div className="hidden lg:block">
          <Aside />
        </div>
        <div className="lg:hidden">
          <OffCanvas
            isOpen={activeSidebar == "navigation"}
            onClose={openNull}
            title="Manage super guild"
          >
            <Aside closeCanvas={openNull} />
          </OffCanvas>
        </div>
        <section className="flex-1">
          <Outlet context={{ data, error, loading: !data && !error }} />
        </section>
      </div>
    </Main>
  )
}

function Aside({ closeCanvas }: { closeCanvas?: () => void }) {
  const { t } = useLanguage()

  const activeModuleClasses = (isActive: boolean): string => {
    let classes = "flex items-center gap-2 px-3 py-2 rounded-md decoration-none "
    if (isActive) {
      classes += "text[#111827] bg-[#f3f4f6]"
    } else {
      classes += "text[#374151] bg-transparent"
    }
    return classes
  }

  return (
    <aside 
      className="
        w-72 lg:pe-2 lg:me-2 lg:border-r border-[rgb(var(--border))] lg:sticky lg:top-[calc(var(--nav-h)+0.5rem)]
        flex flex-col gap-1
      "
    >
      {GUILD_MODULES.map((module) => (
        <NavLink
          className={({ isActive }) => activeModuleClasses(isActive)}
          key={module.path}
          to={module.path!}
          onClick={() => closeCanvas?.()}
        >
          {module.icon}
          <span>{t(`manageGuild.${module.label as GUILD_MODULE_KEY}.label`)}</span>
        </NavLink>
      ))}
    </aside>
  )
}
