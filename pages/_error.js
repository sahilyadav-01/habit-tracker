import { useEffect } from 'react'

export default function Error({ statusCode }) {
  useEffect(() => {
    document.title = `Error ${statusCode || ''} - Habit Tracker Pro`
  }, [statusCode])

  return (
    <div className="min-h-screen glass-premium flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-purple-900/50">
      <div className="text-center max-w-md mx-auto glass-premium p-12 rounded-3xl shadow-premium border-premium">
        <div className="text-8xl mb-8 premium-glow">⚠️</div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          {statusCode ? `Error ${statusCode}` : 'Something went wrong'}
        </h1>
        <p className="text-xl text-gray-300 mb-8 font-medium">
          Sorry about that! Try refreshing or 
          <a href="/" className="text-yellow-400 hover:text-yellow-300 font-bold ml-1 premium-shimmer">
            go home
          </a>
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-black rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 premium-ripple text-lg"
        >
          🔄 Refresh Premium App
        </button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
