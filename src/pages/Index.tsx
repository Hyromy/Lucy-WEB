import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"

export default function Index() {
  const { t } = useLanguage()

  return (
    <Main>
      <h1 className="text-3xl font-bold">{t("index.title")}</h1>
    </Main>
  )
}
