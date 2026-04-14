import Main from "../layouts/Main"
import NotFound from "./NotFound"
import { GuildCard } from "../components/Card"

import useAuth from "../contexts/Auth"

import useApi from "../hooks/useApi"

import type { GuildResponse } from "../types/api"
import { discordService } from "../services/lucy"
import { useEffect } from "react"
import useLanguage from "../contexts/Language"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../routes"

export default function Dashboard() {
  const { authenticated, loading: loadingAuth } = useAuth()
  const { data, error, loading: loadingApi, request } = useApi<GuildResponse[]>()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    request(
      discordService.guilds()
    )
  }, [])

  useEffect(() => {
    if (error) {
      console.error("Error fetching guilds:", error)
    }
  }, [error])

  const content = loadingApi
    ? <p className="text-[rgb(var(--muted))]">Loading...</p>
    : data && (
      <div className="flex flex-wrap justify-center items-stretch gap-6 p-6">
        {data.map((guild: GuildResponse) => (
          <div key={guild.id} className="w-[320px] max-w-full">
            <GuildCard 
              guild={guild} 
              onClick={() => navigate(ROUTES.GUILD.ROOT.replace(":id", guild.id))} 
            />
          </div>
        ))}
      </div>
    )

  return (!authenticated && !loadingAuth) ? <NotFound /> : (
    <Main>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 px-6">
          <h1 className="text-3xl font-bold text-[rgb(var(--fg))]">
            {t("dashboard.title")}
          </h1>
          <p className="text-[rgb(var(--muted))] mt-2">
            {t("dashboard.description")}
          </p>
        </header>
        {content}
      </div>
    </Main>
  )
}
