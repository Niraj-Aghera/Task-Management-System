"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] HomePage mounted, checking auth token")
    const token = localStorage.getItem("token")
    console.log("[v0] Token exists:", !!token)

    if (token) {
      console.log("[v0] Redirecting to /tasks")
      router.push("/tasks")
    } else {
      console.log("[v0] Redirecting to /login")
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )
}
