import useLanguage from "../contexts/Language"
import Main from "../layouts/Main"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <Main>
      <div>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.message")}</p>
      </div>
    </Main>
  )
}
