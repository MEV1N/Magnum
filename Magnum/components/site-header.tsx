"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image src="/images/magnum-logo.png" alt="Magnum Media Club" fill className="object-cover" />
            </div>
            <span className="font-bold text-xl">Magnum News</span>
          </Link>
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-sm">LIVE</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

