'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

// Define the admin credentials
const ADMIN_USERNAME = 'magnum'
const ADMIN_PASSWORD = 'firstyearsmbc'

interface AuthContextType {
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const authStatus = localStorage.getItem('magnumNewsAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async ({ username, password }: { username: string; password: string }) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      if (isClient) {
        localStorage.setItem('magnumNewsAuth', 'true')
      }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    if (isClient) {
      localStorage.removeItem('magnumNewsAuth')
    }
    router.push('/admin/login')
  }

  const value = { isAuthenticated, login, logout }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth guard for client components
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [isClient, setIsClient] = useState(false)
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const authContext = useAuth() // Always call useAuth

    useEffect(() => {
      setIsClient(true)
    }, [])

    useEffect(() => {
      if (isClient) {
        setIsAuthenticated(authContext.isAuthenticated)
      }
    }, [isClient, authContext.isAuthenticated])

    useEffect(() => {
      if (isClient && !isAuthenticated) {
        router.push('/admin/login')
      }
    }, [isClient, isAuthenticated, router])

    if (!isClient) {
      return null
    }

    if (!isAuthenticated) {
      return null
    }

    return React.createElement(Component, { ...props })
  }
} 