import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { ROUTES } from "../routes/paths"

export default function Index() {
  const { t } = useLanguage()
  const { authenticated, loading } = useAuth()

  const accessToDashboard = loading
    ? null
    : authenticated
      ? (
        <Link to={ROUTES.DASHBOARD} className="text-primary hover:underline">
          {t("index.dashboardLink")}
        </Link>
      )
      : (
        <p className="text-center text-muted">
          {t("index.pleaseLogin")}
        </p>
      )

  return (
    <Main>
      <section className="flex flex-1 flex-col gap-2 items-center justify-center">
        <h2 className="text-3xl font-bold text-center">
          {t("index.title")}
        </h2>
        {accessToDashboard}
      </section>
    </Main>
  )
}
