import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "Task Manager",
  description: "Simple task management application",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
