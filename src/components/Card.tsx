import { type ReactNode } from "react"
import type { GuildResponse } from "../types/api"
import useLanguage from "../hooks/useLanguage"

type CardProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}
export function Card({
  children,
  className = "",
  onClick,
  hoverable = true
}: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all 
        ${hoverable ? 'hover:border-primary hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

type GuildCardProps = {
  guild: GuildResponse
  onClick?: () => void
}
export function GuildCard({ guild, onClick }: GuildCardProps) {
  const { t } = useLanguage()

  const iconUrl = guild.icon 
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : `https://cdn.discordapp.com/embed/avatars/0.png`

  return (
    <Card onClick={onClick} className="group h-full w-full">
      {/* Banner / Header Background */}
      <div className="h-20 bg-primary opacity-10 group-hover:opacity-20 transition-opacity" />

      <div className="relative p-4 pt-0">
        {/* Icon offset */}
        <div className="-mt-10 mb-3 inline-block rounded-full border-4 border-card shadow-sm overflow-hidden h-20 w-20">
          <img 
            src={iconUrl} 
            alt={guild.name} 
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-lg font-bold line-clamp-1">
          {guild.name}
        </h3>
        
        <p className="text-sm text-muted mb-4">
          {t(`dashboard.guild.${guild.owner ? "owner" : "admin"}`)}
        </p>
      </div>
    </Card>
  )
}
