'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
// REMOVE: import { revalidateNewsPaths } from "@/app/actions" // No longer needed here

type EditNewsFormProps = {
  id: string
  initialData?: {
    title: string;
    content: string;
  };
}

export default function EditNewsForm({ id, initialData }: EditNewsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      setError('Title and content are required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/news/${id}`, { // Ensure this API route exists and handles PUT
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          // Consider if updatedAt should be set on the server instead
          // updatedAt: new Date().toISOString()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update news')
      }

      console.log('Update successful:', data)
      // REMOVE: await revalidateNewsPaths() // Move this logic to the API route

      // Navigate and refresh client-side data
      router.push('/admin') // Or maybe back to the news list if that's different
      router.refresh() // Hard refresh data for the current route from server

    } catch (err) {
      console.error('Update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update news')
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of your component JSX remains the same ...
  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="flex items-center text-gold-500 hover:text-gold-300 transition-colors mb-6"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Admin
      </Link>

      {error && (
        <div className="bg-red-900/50 text-red-300 p-4 rounded-md mb-6 border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-white"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter news title"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-white"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Write the news content here..."
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.title || !formData.content}
            className="bg-gold-600 hover:bg-gold-500 text-black font-medium py-2 px-6 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Updating...
              </>
            ) : (
              'Update News'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}