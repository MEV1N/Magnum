"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { initializeFirebaseAndFirestore } from "@/lib/firebase-config"

export default function AddNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Initialize Firebase and Firestore
      const { app, db, error: initError } = await initializeFirebaseAndFirestore()

      if (initError || !app || !db) {
        throw new Error(`Failed to initialize Firebase and Firestore: ${initError || "Unknown error"}`)
      }

      // Import Firestore methods
      const { collection, addDoc } = await import("firebase/firestore")

      const title = formData.get("title") as string
      const excerpt = formData.get("excerpt") as string
      const content = formData.get("content") as string
      const category = formData.get("category") as string
      const imageUrl = (formData.get("imageUrl") as string) || "/placeholder.svg?height=300&width=400"
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      if (!title || !excerpt || !content || !category) {
        setMessage({ type: "error", text: "All fields are required" })
        setIsSubmitting(false)
        return
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      const article = {
        title,
        excerpt,
        content,
        category,
        imageUrl,
        date,
        slug,
      }

      // Add to Firestore
      await addDoc(collection(db, "news"), article)

      // Revalidate paths
      await fetch("/api/revalidate?path=/news")
      await fetch("/api/revalidate?path=/")

      setMessage({ type: "success", text: "Article added successfully" })

      // Redirect to news page after successful submission
      setTimeout(() => {
        router.push("/news")
      }, 1500)
    } catch (error) {
      console.error("Error adding article:", error)
      setMessage({ type: "error", text: "Failed to add article. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>

      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center text-amber-400 hover:text-amber-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </div>

          <div className="bg-black/30 rounded-lg border border-gray-800 p-6">
            <h1 className="text-3xl font-bold text-amber-400 mb-6">Add New Article</h1>

            {message && (
              <div
                className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
              >
                {message.text}
              </div>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content (HTML)
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;)
                </p>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="/placeholder.svg?height=300&width=400"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty to use a placeholder image</p>
              </div>

              <div className="flex justify-end gap-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 text-black rounded-md font-medium hover:bg-amber-400 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Article"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

