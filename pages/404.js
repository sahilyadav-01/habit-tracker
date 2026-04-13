import Link from 'next/link'
import { useEffect } from 'react'

export default function Custom404() {
  useEffect(() => {
    document.title = 'Page Not Found - Habit Tracker Pro'
  }, [])

  return (
    <div className="min-h-screen glass-premium flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-purple-900/50">
      <div className="text-center max-w-md mx-auto glass-premium p-12 rounded-3xl shadow-premium border-premium">
        <div className="text-8xl mb-8 premium-glow">🔍</div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-300 mb-8 font-medium">
          This premium page doesn't exist. 
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-bold ml-1 premium-shimmer">
            Go to Pro Dashboard
          </Link>
        </p>
        <Link href="/">
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-black rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 premium-ripple text-lg">
            ⭐ Return to Premium Home
          </button>
        </Link>
      </div>
    </div>
  )
}
