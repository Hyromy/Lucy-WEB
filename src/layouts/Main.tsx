import type { ReactNode } from "react"

import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Main({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto max-w-7xl w-full p-2">
        {children}
      </main>
      <Footer />
    </div>
  )
}
