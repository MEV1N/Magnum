import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

// Home page doesn't depend on Firebase, so it will always work
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Background - Black and white checkered pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        {/* Logo */}
        <div className="mb-12 w-64 h-64">
          <Image src="/images/magnum-logo.png" alt="Magnum Media Club" width={256} height={256} priority />
        </div>

        <h1 className="text-6xl font-bold text-amber-400 mb-8">Magnum News</h1>

        <p className="text-2xl text-white mb-12">
          Your source for the latest happenings inside and outside the college. Stay informed, stay connected.
        </p>
        
        <Link href="/news" className="golden-news-button"> {/* Add your custom class */}
  <span className="text-content">Discover Latest News</span> {/* Optional: class for easier targeting */}
  <ChevronDown className="icon" /> {/* Optional: class for easier targeting */}
</Link>
      </div>
    </div>
  )
}

