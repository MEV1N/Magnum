import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 bg-grid-pattern"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400 mb-4" />
        <p className="text-xl">{message}</p>
      </div>
    </div>
  )
}

