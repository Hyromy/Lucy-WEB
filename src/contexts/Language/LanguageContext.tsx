import { createContext } from "react"

export type Language = "en" | "es"

export type TranslationKey = keyof (typeof translations)["en"]

export type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export const translations = {
  en: {
    "save": "Save",

    "nav.login": "Login",
    "nav.theme.light": "Light",
    "nav.theme.dark": "Dark",
    "nav.theme.system": "System",

    "footer.madeWith": "Made with",
    "footer.author": "by Hyromy",
    
    "index.title": "Preparing something awesome...",

    "notFound.title": "Page not found",
    "notFound.message": "The page you are looking for does not exist.",
    
    "dashboard.title": "Your Servers",
    "dashboard.description": "Select a guild to manage its configuration.",
    "dashboard.guild.owner": "Owner",
    "dashboard.guild.admin": "Admin",
    "dashboard.installed.title": "Installed",
    "dashboard.available.title": "Ready to install",
    
    "manageGuild.info.label": "Information",
    
    "manageGuild.config.label": "Configuration",
    "manageGuild.config.form.lang": "Bot Language",
  },
  es: {
    "save": "Guardar",

    "nav.login": "Iniciar",
    "nav.theme.light": "Claro",
    "nav.theme.dark": "Oscuro",
    "nav.theme.system": "Sistema",
    
    "footer.madeWith": "Hecho con",
    "footer.author": "por Hyromy",
    
    "index.title": "Preparando algo increíble...",
    
    "notFound.title": "Página no encontrada",
    "notFound.message": "La página que buscas no existe.",
    
    "dashboard.title": "Tus servidores",
    "dashboard.description": "Selecciona un servidor para gestionar su configuración.",
    "dashboard.guild.owner": "Propietario",
    "dashboard.guild.admin": "Administrador",
    "dashboard.installed.title": "Instalados",
    "dashboard.available.title": "Listos para instalar",

    "manageGuild.info.label": "Información",
    
    "manageGuild.config.label": "Configuración",
    "manageGuild.config.form.lang": "Idioma del bot",
  },
} as const
