"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { initializeFirebaseAndFirestore } from "@/lib/firebase-config"
import { useAuth } from "@/lib/auth"
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

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const slug = params?.slug as string

  useEffect(() => {
    async function fetchArticle() {
      try {
        if (!slug) {
          throw new Error("Article slug is missing")
        }

        // Initialize Firebase and Firestore
        const { app, db, error: initError } = await initializeFirebaseAndFirestore()

        if (initError || !app || !db) {
          throw new Error(`Failed to initialize Firebase and Firestore: ${initError instanceof Error ? initError.message : "Unknown error"}`)
        }

        // Import Firestore methods
        const { collection, query, where, getDocs } = await import("firebase/firestore")

        // Query for article with matching slug
        const newsCollection = collection(db, "news")
        const q = query(newsCollection, where("slug", "==", slug))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          throw new Error("Article not found")
        }

        const doc = querySnapshot.docs[0]
        setArticle({
          id: doc.id,
          ...doc.data(),
        } as NewsArticle)
      } catch (err) {
        console.error("Error fetching article:", err)
        setError("Failed to load article. It may have been removed or doesn't exist.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (isLoading) {
    return <LoadingScreen message="Loading article..." />
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-grid-pattern"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-black/30 rounded-lg border border-gray-800 p-8 text-center max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <Link
              href="/news"
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 bg-grid-pattern"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-black/30 rounded-lg border border-gray-800 p-8 text-center max-w-md">
            <p className="text-red-400 mb-4">Article not found</p>
            <Link
              href="/news"
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Back to News
            </Link>
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
            <Link href="/news" className="inline-flex items-center text-amber-400 hover:text-amber-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>

            {isAuthenticated && (
              <div className="flex gap-2">
                <Link
                  href={`/admin/edit-news/${article.id}`}
                  className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <Link
                  href={`/admin/delete-news/${article.id}`}
                  className="inline-flex items-center bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Link>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>

          <div className="flex items-center mb-8">
            <span className="text-amber-400 mr-4">{article.category}</span>
            <span className="text-gray-400">{article.date}</span>
          </div>

          <div className="relative h-[400px] mb-8">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div
            className="prose prose-invert prose-amber max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </main>
    </div>
  )
}

