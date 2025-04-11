"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PlusCircle, FileText, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { initializeFirebaseAndFirestore } from "@/lib/firebase-config"
import LoadingScreen from "@/components/loading-screen"

export default function AdminPage() {
  const [newsCount, setNewsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchNewsCount() {
      try {
        // Initialize Firebase and Firestore
        const { app, db, error: initError } = await initializeFirebaseAndFirestore()

        if (initError || !app || !db) {
          throw new Error(`Failed to initialize Firebase and Firestore: ${initError instanceof Error ? initError.message : "Unknown error"}`)
        }

        // Import Firestore methods
        const { collection, getDocs } = await import("firebase/firestore")

        // Get news collection
        const newsCollection = collection(db, "news")
        const querySnapshot = await getDocs(newsCollection)

        setNewsCount(querySnapshot.docs.length)
      } catch (error) {
        console.error("Error fetching news count:", error)
        setError("Failed to load news data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsCount()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-grid-pattern"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-black/30 rounded-lg border border-gray-800 p-8 text-center max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>

      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>

          <div className="bg-black/30 rounded-lg border border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <h3 className="text-lg font-medium mb-2">News Articles</h3>
                <p className="text-gray-400 mb-4">Manage news articles and content</p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/admin/add-news"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-black rounded-md font-medium hover:bg-amber-400 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Article
                  </Link>
                  <Link
                    href="/news"
                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View All Articles
                  </Link>
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Site Settings</h3>
                <p className="text-gray-400 mb-4">Configure website settings</p>
                <Link
                  href="#"
                  className="inline-flex items-center px-4 py-2 bg-amber-500 text-black rounded-md font-medium hover:bg-amber-400 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <div className="p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Site Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold">{newsCount}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Last Updated</p>
                  <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-2xl font-bold text-green-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

