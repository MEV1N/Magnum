"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Create a context for Firebase status
const FirebaseContext = createContext({
  isReady: false,
  error: null as Error | null,
})

// Provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState({
    isReady: false,
    error: null as Error | null,
  })

  // We're not initializing Firebase here anymore
  // Each component will dynamically import Firebase when needed

  return <FirebaseContext.Provider value={status}>{children}</FirebaseContext.Provider>
}

// Hook to use the Firebase context
export function useFirebaseStatus() {
  return useContext(FirebaseContext)
}

export function useFirebaseContext() {
  return useContext(FirebaseContext)
}

