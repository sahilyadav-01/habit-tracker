import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

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
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              onClick={handleProfileClick}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all flex items-center justify-center p-1 relative group"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl ring-2 ring-white shadow-md" 
                />
              ) : (
                <span className="text-2xl font-black text-white drop-shadow-lg group-hover:scale-110 transition-transform">
                  {user?.name.charAt(0) || 'U'}
                </span>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
            </div>
            <div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {user?.name || 'User'}'s Habits
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{getPageTitle()} Dashboard</p>
              </div>
              <p className="text-sm text-gray-600">{user?.phone || 'Loading...'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {router.pathname !== '/dashboard' && (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center gap-2"
              >
                Personal
              </button>
            )}
            {router.pathname !== '/family' && (
              <button
                onClick={() => router.push('/family')}
                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center gap-2"
              >
                Family
              </button>
            )}
            <button
              onClick={handleProfileClick}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center gap-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
