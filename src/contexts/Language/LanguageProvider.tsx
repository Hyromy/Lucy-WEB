import {
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { LanguageContext, translations, type Language, type LanguageContextType, type TranslationKey } from "./LanguageContext"

const languageKey = "lang"

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
