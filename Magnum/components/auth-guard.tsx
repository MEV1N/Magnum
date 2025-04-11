"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import LoadingScreen from "@/components/loading-screen"

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <LoadingScreen message="Checking authentication..." />
  }

  return <>{children}</>
}

