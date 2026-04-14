import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "./contexts/Theme"
import { LanguageProvider } from "./contexts/Language"
import { AuthProvider } from "./contexts/Auth"
import { routes } from "./routes"
import type { AppRoute } from "./types/appRoute"

function renderRoutes(routeList: AppRoute[]) {
  return routeList.map((route, index) => {
    const key = `${route.path ?? "index"}-${index}`

    if (route.index) {
      return <Route key={key} index element={route.element} />
    }

    return (
      <Route key={key} path={route.path} element={route.element}>
        {route.children ? renderRoutes(route.children) : null}
      </Route>
    )
  })
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>{renderRoutes(routes)}</Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}
