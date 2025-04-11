"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { initializeFirebaseAndFirestore } from "@/lib/firebase-config"
import { doc, deleteDoc, Firestore } from "firebase/firestore"

interface FirebaseInitResult {
  app: any | null;
  db: Firestore | null;
  error: unknown;
}

export default function DeleteNewsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  async function handleDelete() {
    if (!params?.id) {
      setMessage({ type: "error", text: "Missing article ID" })
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      const initResult = await initializeFirebaseAndFirestore() as FirebaseInitResult
      if (initResult.error || !initResult.db) {
        throw new Error(`Failed to initialize Firebase: ${initResult.error instanceof Error ? initResult.error.message : 'Unknown error'}`)
      }

      await deleteDoc(doc(initResult.db, "news", params.id))
      setMessage({ type: "success", text: "Article deleted successfully" })
      
      setTimeout(() => router.push("/admin"), 1500)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ 
        type: "error", 
        text: `Failed to delete article: ${errorMessage}`
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    )
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
            <h1 className="text-3xl font-bold text-amber-400 mb-6">Delete Article</h1>

            {message && (
              <div className={`p-4 mb-6 rounded-md ${
                message.type === "success" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                <div className="flex items-start">
                  <Trash2 className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-red-400">Warning: This action cannot be undone</h3>
                    <p className="text-sm text-red-300 mt-1">
                      You are about to permanently delete this news article.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-400 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Article"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
