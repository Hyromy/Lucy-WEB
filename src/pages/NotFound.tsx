import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <Main>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.message")}</p>
    </Main>
  )
}
