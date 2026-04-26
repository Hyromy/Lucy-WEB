import type { ReactNode } from "react"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Main({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 p-2 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}
