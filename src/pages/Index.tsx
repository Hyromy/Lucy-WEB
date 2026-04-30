import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"

export default function Index() {
  const { t } = useLanguage()

  return (
    <Main>
      {/* <section className="flex flex-1 flex-col gap-2 items-center justify-center">

      </section> */}
      <h1 className="flex justify-center items-center w-full text-3xl font-bold text-center">
        {t("index.title")}
      </h1>
    </Main>
  )
}
