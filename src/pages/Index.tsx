import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"

export default function Index() {
  const { t } = useLanguage()

  return (
    <Main>
      <h1 className="flex justify-center items-center w-full text-3xl font-bold text-center">
        {t("index.title")}
      </h1>
    </Main>
  )
}
