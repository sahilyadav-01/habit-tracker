import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(true) // Premium status

  useEffect(() => {
    const name = localStorage.getItem('name') || 'User'
    const profileImage = localStorage.getItem('profileImage')
    const phone = localStorage.getItem('phone') || ''
    
    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      profileImage,
      phone
    })
  }, [])

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  const getPageTitle = () => {
    if (router.pathname === '/dashboard') return 'Personal'
    if (router.pathname === '/family') return 'Family'
    return 'Dashboard'
  }

  return (
    <nav className="glass-premium backdrop-blur-3xl shadow-premium border-premium sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Premium Profile Avatar */}
            <div 
              onClick={handleProfileClick}
              className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl cursor-pointer shadow-premium-glow hover:shadow-premium-glow hover:scale-105 transition-all duration-300 flex items-center justify-center p-1 relative group border-premium"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl ring-2 ring-white/50 shadow-md premium-shimmer" 
                />
              ) : (
                <span className="text-2xl font-black text-gray-900 drop-shadow-lg group-hover:scale-110 transition-transform tracking-tight">
                  {user?.name.charAt(0) || 'U'}
                </span>
              )}
              {/* Premium Status Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center premium-glow">
                <span className="text-xs font-bold text-white tracking-wider">PRO</span>
              </div>
            </div>

            {/* Premium Title Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-100 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                  {user?.name || 'Pro User'}'s Habits
                </h1>
                <span className="premium-badge text-xs px-3 py-1 shadow-md">PRO</span>
              </div>
              <p className="text-sm text-gray-400 font-mono tracking-wider">{getPageTitle()} Dashboard</p>
              {user?.phone && <p className="text-xs text-gray-500 bg-gray-900/50 px-3 py-1 rounded-full inline-flex items-center gap-1 backdrop-blur-sm">
                📱 {user.phone}
              </p>}
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex items-center gap-3">
            {router.pathname !== '/dashboard' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 text-sm flex items-center gap-2 premium-ripple premium-shimmer"
              >
                📱 Personal
              </button>
            )}
            {router.pathname !== '/family' && (
              <button
                onClick={() => router.push('/family')}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 text-sm flex items-center gap-2 premium-ripple premium-shimmer"
              >
                👨‍👩‍👧 Family
              </button>
            )}
            <button
              onClick={handleProfileClick}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 text-sm premium-ripple"
            >
              👤 Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-2xl shadow-premium hover:shadow-premium-glow transition-all duration-300 text-sm flex items-center gap-1 premium-ripple"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
