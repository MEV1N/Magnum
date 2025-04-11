"use client"

import { NewsCard } from "@/components/news-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { initializeFirebaseAndFirestore } from "@/lib/firebase-config"
import { useAuth } from "@/lib/auth"
import { PlusCircle } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"

// Define the news article type
interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  imageUrl: string
  slug: string
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchNews() {
      try {
        // Initialize Firebase and Firestore
        const { app, db, error: initError } = await initializeFirebaseAndFirestore()

        if (initError || !app || !db) {
          throw new Error(`Failed to initialize Firebase and Firestore: ${initError instanceof Error ? initError.message : "Unknown error"}`)
        }

        // Import Firestore methods
        const { collection, getDocs, query, orderBy } = await import("firebase/firestore")

        // Get news collection
        const newsCollection = collection(db, "news")
        const q = query(newsCollection, orderBy("date", "desc"))
        const querySnapshot = await getDocs(q)

        // Convert to array of news articles
        const news = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NewsArticle[]

        setNewsItems(news)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load news articles. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Loading news articles..." />
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
      {/* Background - Black and white checkered pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>

      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-amber-400">Latest News</h1>

            {isAuthenticated && (
              <Link
                href="/admin/add-news"
                className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add News
              </Link>
            )}
          </div>

          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="bg-black/30 rounded-lg border border-gray-800 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No News Articles Yet</h2>
              <p className="text-gray-400 mb-6">There are no news articles to display.</p>
              {isAuthenticated && (
                <Link
                  href="/admin/add-news"
                  className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Your First Article
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

