import Main from "../layouts/Main"
import NotFound from "./NotFound"
import { GuildCard } from "../components/Card"

import useAuth from "../hooks/useAuth"
import useLanguage from "../hooks/useLanguage"
import useApi from "../hooks/useApi"

import type { GuildResponse, LucyGuildResponse } from "../types/api"
import { discordService, guildService } from "../services/lucy"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../routes/paths"

import {
  DISCORD_BOT_CLIENT_ID,
  DISCORD_BOT_PERMISSIONS,
  DISCORD_BOT_SCOPES
} from "../constants/config"
import { Divider } from "../components/Divider"

const urlInviteGuild = (guildID: string) => (
  "https://discord.com/oauth2/authorize?" +
  `client_id=${DISCORD_BOT_CLIENT_ID}` +
  `&permissions=${DISCORD_BOT_PERMISSIONS}` +
  `&scope=${DISCORD_BOT_SCOPES}` +
  `&guild_id=${guildID}`
)

type apiResponse = [
  LucyGuildResponse[],
  GuildResponse[],
]

export default function Dashboard() {
  const { authenticated, loading: loadingAuth } = useAuth()
  const { data, error, loading: loadingApi, request } = useApi<apiResponse>()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const sortGuilds = (guilds: GuildResponse[], installedIDS: Set<string>, isToManage: boolean) => (
    guilds
      .filter(g => isToManage ? installedIDS.has(g.id) : !installedIDS.has(g.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  )

  useEffect(() => {
    request(
      guildService.get(),
      discordService.guilds(),
    )
  }, [request])

  useEffect(() => {
    if (error) {
      console.error("Error fetching guilds:", error)
    }
  }, [error])

  const { manageGuilds, installGuilds } = useMemo(() => {
    if (!data) return {
      manageGuilds: [],
      installGuilds: [],
    }

    const [lucyGuilds, discordGuilds] = data
    const installedIDS = new Set(lucyGuilds.map(g => g.id))
    const manage = sortGuilds(discordGuilds, installedIDS, true)
    const install = sortGuilds(discordGuilds, installedIDS, false)

    return {
      manageGuilds: manage,
      installGuilds: install,
    }
  }, [data])

  const renderGuildList = (guilds: GuildResponse[], title: string, addInvite: boolean) => {
    if (guilds.length == 0) return null

    const onClick = (guild: GuildResponse) => {
      if (addInvite) {
        window.open(urlInviteGuild(guild.id), "_blank")
      } else {
        navigate(ROUTES.GUILD.ROOT.replace(":id", guild.id))
      }
    }

    return (
      <div>
        <Divider text={<h3 className="text-2xl">{title}</h3>} />
        <div className="flex flex-wrap justify-center items-stretch gap-3 p-3">
          {guilds.map((guild) => (
            <div key={guild.id} className="w-80 max-w-full">
              <GuildCard 
                guild={guild} 
                onClick={() => onClick(guild)}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const content = loadingApi
    ? <p className="text-muted">Loading...</p>
    : data && (
      <section className="flex flex-col gap-8">
        {renderGuildList(manageGuilds, t("dashboard.installed.title"), false)}
        {renderGuildList(installGuilds, t("dashboard.available.title"), true)}
      </section>
    )

  return (!authenticated && !loadingAuth) ? <NotFound /> : (
    <Main>
      <section className="text-center my-4">
        <h2 className="text-3xl font-bold text-foreground">
          {t("dashboard.title")}
        </h2>
        <p className="text-muted mt-2">
          {t("dashboard.description")}
        </p>
      </section>
      {content}
    </Main>
  )
}
