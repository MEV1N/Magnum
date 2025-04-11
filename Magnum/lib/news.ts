import fs from "fs"
import path from "path"

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

// Path to our JSON data file
const dataFilePath = path.join(process.cwd(), "data", "news.json")

// Ensure the data directory exists
export const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2))
  }
}

// Get all news articles
export const getAllNews = (): NewsArticle[] => {
  ensureDataDir()
  try {
    const data = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading news data:", error)
    return []
  }
}

// Get a single news article by slug
export const getNewsBySlug = (slug: string): NewsArticle | null => {
  const news = getAllNews()
  return news.find((article) => article.slug === slug) || null
}

// Save a new article
export const saveNewsArticle = (article: Omit<NewsArticle, "id">): NewsArticle => {
  const news = getAllNews()
  const id = Date.now().toString()
  const newArticle = { ...article, id }

  news.push(newArticle)
  fs.writeFileSync(dataFilePath, JSON.stringify(news, null, 2))

  return newArticle
}

// Update an existing article
export const updateNewsArticle = (article: NewsArticle): NewsArticle => {
  const news = getAllNews()
  const index = news.findIndex((item) => item.id === article.id)

  if (index !== -1) {
    news[index] = article
    fs.writeFileSync(dataFilePath, JSON.stringify(news, null, 2))
    return article
  }

  throw new Error("Article not found")
}

// Delete an article
export const deleteNewsArticle = (id: string): boolean => {
  const news = getAllNews()
  const filteredNews = news.filter((article) => article.id !== id)

  if (filteredNews.length < news.length) {
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredNews, null, 2))
    return true
  }

  return false
}

// Generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

