"use client"

import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDYyw1IyRDUIG1amrBKF7_p1Ihg_-bb47c",
  authDomain: "magnum-media.firebaseapp.com",
  databaseURL: "https://magnum-media-default-rtdb.firebaseio.com",
  projectId: "magnum-media",
  storageBucket: "magnum-media.firebasestorage.app",
  messagingSenderId: "816334043499",
  appId: "1:816334043499:web:70868992e2ad60feea742e"
}

// Initialize Firebase services
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)

// Simple update function with fallback
export async function updateNews(id: string, data: Record<string, any>) {
  try {
    const docRef = doc(db, 'news', id)
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
    return { success: true }
  } catch (error: any) {
    console.error('Update error:', error)
    throw new Error(`Failed to update news: ${error.message}`)
  }
}

export async function getNewsById(id: string) {
  try {
    const docRef = doc(db, 'news', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error: any) {
    console.error('Fetch error:', error)
    throw new Error(`Failed to fetch news: ${error.message}`)
  }
}

export interface FirebaseInstance {
  app: any | null
  db: any | null
  storage: any | null
  isLoading: boolean
  error: Error | null
}

// Initialize Firebase hook
export function useFirebase(): FirebaseInstance {
  const [firebase, setFirebase] = useState<FirebaseInstance>({
    app: null,
    db: null,
    storage: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      setFirebase((prev: FirebaseInstance) => ({
        ...prev,
        isLoading: false,
        error: new Error("Firebase cannot be initialized on the server"),
      }))
      return
    }

    let isMounted = true
    let retryCount = 0
    const maxRetries = 5

    const initializeFirebase = () => {
      try {
        // Check if Firebase is available in the global scope
        if (!window.firebase) {
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`Firebase SDK not found, retrying (${retryCount}/${maxRetries})...`)
            setTimeout(initializeFirebase, 1000)
            return
          } else {
            throw new Error("Firebase SDK not loaded after multiple attempts. Please reload the page.")
          }
        }

        // Try to initialize Firebase using the global function
        if (window.initFirebase && !window.firebaseInitialized) {
          const success = window.initFirebase()
          if (!success) {
            throw new Error("Failed to initialize Firebase")
          }
        }

        // Get Firebase app instance
        const app = window.firebase.app()

        // Initialize Firestore and Storage
        const db = window.firebase.firestore()
        const storage = window.firebase.storage()

        if (isMounted) {
          setFirebase({
            app,
            db,
            storage,
            isLoading: false,
            error: null,
          })
          console.log("Firebase services initialized successfully")
        }
      } catch (error) {
        console.error("Error initializing Firebase:", error)
        if (isMounted) {
          setFirebase((prev: FirebaseInstance) => ({
            ...prev,
            isLoading: false,
            error: error as Error,
          }))
        }
      }
    }

    // Start initialization with a small delay
    setTimeout(initializeFirebase, 1000)

    return () => {
      isMounted = false
    }
  }, [])

  return firebase
}

// Make Firebase available globally for direct access
declare global {
  interface Window {
    firebase: any
    initFirebase: () => boolean
    firebaseInitialized: boolean
  }
}

// Helper function to safely get Firebase services
export function getFirebaseServices(): Promise<{ db: any; storage: any } | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null)
      return
    }

    let attempts = 0
    const maxAttempts = 10

    const checkFirebase = () => {
      attempts++

      if (window.firebase && window.firebaseInitialized) {
        try {
          const app = window.firebase.app()
          const db = app.firestore()
          const storage = app.storage()
          resolve({ db, storage })
          return
        } catch (error) {
          console.error("Error getting Firebase services:", error)
        }
      }

      if (attempts < maxAttempts) {
        setTimeout(checkFirebase, 500)
      } else {
        console.error("Failed to get Firebase services after multiple attempts")
        resolve(null)
      }
    }

    checkFirebase()
  })
}

