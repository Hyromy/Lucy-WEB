import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Language = "en" | "es"

const languageKey = "lang"

const translations = {
  en: {
    "save": "Save",

    "nav.login": "Login",
    "nav.theme.light": "Light",
    "nav.theme.dark": "Dark",
    "nav.theme.system": "System",

    "footer.madeWith": "Made with",
    "footer.author": "by Hyromy",
    
    "index.title": "Preparing something awesome...",

    "notFound.title": "Page Not Found",
    "notFound.message": "The page you are looking for does not exist.",
    
    "dashboard.title": "Your Servers",
    "dashboard.description": "Select a guild to manage its configuration.",
    "dashboard.guild.owner": "Owner",
    "dashboard.guild.admin": "Admin",
    "dashboard.installed.title": "Installed",
    "dashboard.available.title": "Ready to install",
    
    "manageGuild.info.label": "Information",
    
    "manageGuild.config.label": "Configuration",
  },
  es: {
    "save": "Guardar",

    "nav.login": "Iniciar sesión",
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
  },
} as const

export type TranslationKey = keyof (typeof translations)["en"]

const isLanguage = (value: string): value is Language => {
  return value == "en" || value == "es"
}
const getLanguageFromLS = (): Language => {
  const savedLanguage = localStorage.getItem(languageKey)
  
  return savedLanguage && isLanguage(savedLanguage)
    ? savedLanguage
    : "es"
}

const setLanguageInLS = (language: Language) => {
  localStorage.setItem(languageKey, language)
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return getLanguageFromLS()
  })
  
  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    setLanguageInLS(nextLanguage)
  }
  
  const contextValue = useMemo<LanguageContextType>(() => {
    const t = (key: TranslationKey) => {
      return translations[language][key] || translations.en[key] || key
    }
    
    return {
      language,
      setLanguage,
      t,
    }
  }, [language])
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export default function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  
  return context
}
