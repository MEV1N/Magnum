import Image from "next/image"
import Link from "next/link"

interface NewsCardProps {
  title: string
  excerpt: string
  date: string
  category: string
  imageUrl: string
  slug: string
}

export function NewsCard({ title, excerpt, date, category, imageUrl, slug }: NewsCardProps) {
  return (
    <div className="bg-black/30 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 border border-gray-800">
      <div className="relative h-48">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-amber-400 font-semibold">{category}</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm mb-4">{excerpt}</p>
        <Link href={`/news/${slug}`} className="text-amber-400 hover:text-amber-300 text-sm font-medium">
          Read more →
        </Link>
      </div>
    </div>
  )
}

