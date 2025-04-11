"use server"

import { revalidatePath } from "next/cache"

// Define the news article type for server actions
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

// Generate a slug from a title
export async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Add a new news article
export async function addNewsArticle(formData: FormData) {
  try {
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
    const slug = await generateSlug(title)

    if (!title || !excerpt || !content || !category) {
      return { success: false, message: "All fields are required" }
    }

    // We'll handle the actual saving on the client side
    return {
      success: true,
      message: "Article data validated successfully",
      article: {
        title,
        excerpt,
        content,
        category,
        imageUrl,
        date,
        slug,
      },
    }
  } catch (error) {
    console.error("Error validating article:", error)
    return { success: false, message: "Failed to validate article" }
  }
}

// Update an existing news article
export async function updateArticle(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const imageUrl = formData.get("imageUrl") as string
    const date = formData.get("date") as string
    const slug = formData.get("slug") as string

    if (!id || !title || !excerpt || !content || !category) {
      return { success: false, message: "All fields are required" }
    }

    // We'll handle the actual updating on the client side
    return {
      success: true,
      message: "Article data validated successfully",
      article: {
        id,
        title,
        excerpt,
        content,
        category,
        imageUrl,
        date,
        slug,
      },
    }
  } catch (error) {
    console.error("Error validating article update:", error)
    return { success: false, message: "Failed to validate article update" }
  }
}

// Delete a news article
export async function deleteArticle(formData: FormData) {
  try {
    const id = formData.get("id") as string

    if (!id) {
      return { success: false, message: "Article ID is required" }
    }

    // We'll handle the actual deletion on the client side
    return {
      success: true,
      message: "Article ID validated successfully",
      id,
    }
  } catch (error) {
    console.error("Error validating article deletion:", error)
    return { success: false, message: "Failed to validate article deletion" }
  }
}

// Revalidate paths
export async function revalidateNewsPaths(slug?: string) {
  revalidatePath("/news")
  revalidatePath("/admin")
  if (slug) {
    revalidatePath(`/news/${slug}`)
  }
  revalidatePath("/")
  return { success: true }
}

