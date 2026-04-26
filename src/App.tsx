import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "./contexts/Theme/ThemeProvider"
import { LanguageProvider } from "./contexts/Language/LanguageProvider"
import { AuthProvider } from "./contexts/Auth/AuthProvider"
import { routes } from "./routes/routes"
import type { AppRoute } from "./types/appRoute"
import { SidebarProvider } from "./contexts/Sidebar/SidebarProvider"

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
        <SidebarProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>{renderRoutes(routes)}</Routes>
            </AuthProvider>
          </BrowserRouter>
        </SidebarProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
