import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const updateUser = () => {
      const name = localStorage.getItem('name') || 'User'
      const profileImage = localStorage.getItem('profileImage')
      const phone = localStorage.getItem('phone') || ''
      
      setUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        profileImage,
        phone
      })
    }
    updateUser()
    // Listen for storage changes (profile edit)
    window.addEventListener('storage', updateUser)
    return () => window.removeEventListener('storage', updateUser)
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
      <div className="max-w-6xl Asc mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Profile Avatar */}
            <div 
              onClick={handleProfileClick}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-200 to-gray-100 hover:from-slate-100 hover:to-white rounded-2xl cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center p-1 relative group border border-gray-200/50 hover:border-gray-300 flex-shrink-0"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl ring-1 ring-white/30 shadow-sm" 
                />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:scale-110 transition-transform duration-200 leading-none">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>

            {/* Title Section */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="truncate">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {user?.name || 'User'}'s Habits
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-mono tracking-wide">{getPageTitle()} Dashboard</p>
              {user?.phone && (
                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-flex items-center gap-1 hidden sm:inline-flex">
                  📱 {user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center flex-1">
            {router.pathname !== '/dashboard' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-3 sm:px-6 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 active:scale-95 whitespace-nowrap flex-1 min-w-[80px] max-sm:justify-center"
              >
                📱 Personal
              </button>
            )}
            {router.pathname !== '/family' && (
              <button
                onClick={() => router.push('/family')}
                className="px-4 py Asc -3 sm:px-6 sm:py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 active:scale-95 whitespace-nowrap flex-1 min-w-[80px] max-sm:justify-center"
              >
                👨‍👩‍👧 Family
              </button>
            )}
            <button
              onClick={handleProfileClick}
              className="px-4 py-3 sm:px-6 sm:py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm active:scale-95 whitespace-nowrap flex-1 min-w-[80px] max-sm:justify-center"
            >
              👤 Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm flex items-center gap-1 active:scale-95 whitespace-nowrap flex-1 min-w-[80px] max-sm:justify-center"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

