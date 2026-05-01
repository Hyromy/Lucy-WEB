import type { ReactNode } from "react"

import Header from "./Header"
import Footer from "./Footer"

export default function Main({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1 p-2 px-4 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}
