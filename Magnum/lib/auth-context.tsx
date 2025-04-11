"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define admin credentials
const ADMIN_USERNAME = "magnum"
const ADMIN_PASSWORD = "firstyearsmbc"

// Define the auth context type
type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("magnumNewsAuthToken")
      if (authToken) {
        // In a real app, you would validate the token here
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple token (in a real app, use JWT or similar)
      const token = btoa(`${username}:${Date.now()}`)
      localStorage.setItem("magnumNewsAuthToken", token)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("magnumNewsAuthToken")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

