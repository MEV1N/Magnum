"use client"

import { getFirestore, collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { getFirebaseServices } from "@/lib/firebase"

// Define the news article type
export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  imageUrl: string
  slug: string
}

// Hook to get all news articles
export function useNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const services = await getFirebaseServices()
        if (!services) {
          throw new Error("Firebase services not available")
        }
        const newsCollection = collection(services.db, 'news')
        const snapshot = await getDocs(newsCollection)
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsArticle[]
        setNews(newsData)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  return { news, isLoading, error }
}

// Generate a slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Function to get a news article by ID
export async function getNewsById(id: string): Promise<NewsArticle | null> {
  if (typeof window === "undefined") {
    console.log("Cannot access Firebase on server side")
    return null
  }

  try {
    const services = await getFirebaseServices()
    if (!services || !services.db) {
      throw new Error("Firestore is not available")
    }

    const db = services.db
    const docRef = db.collection("news").doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data(),
      } as NewsArticle
    } else {
      return null
    }
  } catch (err) {
    console.error("Error fetching article by ID:", err)
    return null
  }
}

// Function to update an existing article
export async function updateNewsArticle(article: NewsArticle): Promise<NewsArticle> {
  if (typeof window === "undefined") {
    throw new Error("Cannot access Firebase on server side")
  }

  try {
    const services = await getFirebaseServices()
    if (!services || !services.db) {
      throw new Error("Firestore is not available")
    }

    const db = services.db
    const docRef = db.collection("news").doc(article.id)
    await docRef.update(article)
    return article
  } catch (error) {
    console.error("Error updating news:", error)
    throw error
  }
}

// Function to delete an article
export async function deleteNewsArticle(id: string): Promise<boolean> {
  if (typeof window === "undefined") {
    throw new Error("Cannot access Firebase on server side")
  }

  try {
    const services = await getFirebaseServices()
    if (!services || !services.db) {
      throw new Error("Firestore is not available")
    }

    const db = services.db
    const docRef = db.collection("news").doc(id)
    await docRef.delete()
    return true
  } catch (error) {
    console.error("Error deleting news:", error)
    throw error
  }
}

