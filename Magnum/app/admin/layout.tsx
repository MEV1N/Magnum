'use client'

import type { ReactNode } from "react"
import AuthGuard from "@/components/auth-guard"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AuthGuard>{children}</AuthGuard>
    </div>
  )
}

