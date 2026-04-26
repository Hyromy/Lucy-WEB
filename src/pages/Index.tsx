import Main from "../layouts/Main"

import useLanguage from "../hooks/useLanguage"
import { Button } from "../components/Button"
import { OffCanvas } from "../components/OffCanvas"
import { useState } from "react"

export default function Index() {
  const { t } = useLanguage()

  const [showMenu, setShowMenu] = useState(false)

  return (
    <Main>
      <h1 className="flex justify-center items-center w-full text-3xl font-bold text-center">
        {t("index.title")}
      </h1>
      <Button onClick={() => setShowMenu(true)}>
        click me
      </Button>
      <OffCanvas
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        title="holaaa"
        position="r"
      >
        cosas para mostrar
      </OffCanvas>
    </Main>
  )
}
