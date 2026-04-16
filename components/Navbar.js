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
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Premium Profile Avatar */}
            <div 
              onClick={handleProfileClick}
              className="w-14 h-14 bg-gradient-to-br from-slate-200 to-gray-100 hover:from-slate-100 hover:to-white rounded-2xl cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center p-1 relative group border border-gray-200/50 hover:border-gray-300"
            >
{user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl ring-2 ring-white/30 shadow-sm" 
                />
              ) : (
                <span className="text-2xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-200">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>

            {/* Premium Title Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name || 'User'}'s Habits
                </h1>
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
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2 active:scale-95"
              >
                📱 Personal
              </button>
            )}
            {router.pathname !== '/family' && (
              <button
                onClick={() => router.push('/family')}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-2 active:scale-95"
              >
                👨‍👩‍👧 Family
              </button>
            )}
            <button
              onClick={handleProfileClick}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm active:scale-95"
            >
              👤 Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm flex items-center gap-1 active:scale-95"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
