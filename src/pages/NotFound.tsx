import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <Main>
      <section className="flex flex-1 flex-col gap-2 items-center justify-center">
        <p>404</p>
        <h1 className="text-4xl text-center">{t("notFound.title")}</h1>
        <p className="text-muted text-center">{t("notFound.message")}</p>
      </section>
    </Main>
  )
}
