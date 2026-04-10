import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      dob: '',
      age: '',
      height: '',
      weight: '',
      profileImage: ''
    })
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('token')
      const provider = localStorage.getItem('provider')
      const name = localStorage.getItem('name') || 'John Doe'
      const dob = localStorage.getItem('dob') || '1990-01-01'
      const age = localStorage.getItem('age') || '34'
      const height = localStorage.getItem('height') || '175cm'
      const weight = localStorage.getItem('weight') || '70kg'
      
      if (!token) {
        router.push('/')
        return
      }

      const calculatedAge = new Date().getFullYear() - new Date(dob).getFullYear()

      setUser({
        name,
        dob,
        age: calculatedAge,
        height,
        weight,
        provider: provider === 'google' ? 'Google' : 'Email',
        joined: new Date().toLocaleDateString(),
        totalHabits: 12,
        longestStreak: 47,
        avgConsistency: 82
      })

      setFormData({
        name,
        dob,
        age: calculatedAge.toString(),
        height,
        weight,
        profileImage: localStorage.getItem('profileImage') || ''
      })

      setLoading(false)
    }, [router])

    const handleLogout = () => {
      localStorage.clear()
      router.push('/')
    }

    const handleSave = () => {
      const calculatedAge = new Date().getFullYear() - new Date(formData.dob).getFullYear()
      
      localStorage.setItem('name', formData.name)
      localStorage.setItem('dob', formData.dob)
      localStorage.setItem('age', calculatedAge.toString())
      localStorage.setItem('height', formData.height)
      localStorage.setItem('weight', formData.weight)
      localStorage.setItem('profileImage', formData.profileImage)

      setUser({
        name: formData.name,
        dob: formData.dob,
        age: calculatedAge,
        height: formData.height,
        weight: formData.weight,
        provider: user.provider,
        joined: user.joined,
        totalHabits: user.totalHabits,
        longestStreak: user.longestStreak,
        avgConsistency: user.avgConsistency
      })

      setEditMode(false)
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl animate-pulse">
          <div className="h-24 bg-gray-200 rounded-2xl w-64 mb-8"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-6 bg-gray-200 rounded-xl w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12">
            <div className="text-center mb-12">
              <label className="cursor-pointer">
                <div className={`w-32 h-32 mx-auto mb-6 shadow-2xl border-8 border-white rounded-full flex items-center justify-center relative overflow-hidden group ${editMode ? 'ring-4 ring-blue-200' : ''}`}>
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {editMode && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </div>
                  )}
                </div>
                {editMode && (
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => setFormData(prev => ({ ...prev, profileImage: e.target.result }))
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                )}
              </label>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent drop-shadow-lg mb-2">
                {editMode ? (
                  <input 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent text-4xl md:text-5xl font-black text-center border-b border-gray-300 pb-2 w-full outline-none"
                    placeholder="Your name"
                  />
                ) : user.name}
              </h1>
              <p className={`text-xl text-gray-600 font-semibold ${editMode ? 'mb-4' : ''}`}>
                {user.provider} Account • Joined {user.joined}
              </p>
              {editMode && (
                <div className="mt-4 flex gap-2 justify-center">
                  <button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
                  >
                    💾 Save
                  </button>
                  <button 
                    onClick={() => setEditMode(false)}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 rounded-2xl border-4 border-emerald-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-3xl font-black text-emerald-800 mb-2">{user.totalHabits}</h3>
                <p className="text-emerald-700 font-bold text-lg">Total Habits</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-2xl border-4 border-orange-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
                <h3 className="text-3xl font-black text-orange-800 mb-2">{user.longestStreak}</h3>
                <p className="text-orange-700 font-bold text-lg">Longest Streak</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-2xl border-4 border-blue-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📈</div>
                <h3 className="text-3xl font-black text-blue-800 mb-2">{user.avgConsistency}%</h3>
                <p className="text-blue-700 font-bold text-lg">Avg Consistency</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="p-6 rounded-2xl border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>
              <div className="p-6 rounded-2xl border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                <input 
                  type="text" 
                  value={formData.height} 
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="175cm"
                />
              </div>
              <div className="p-6 rounded-2xl border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight</label>
                <input 
                  type="text" 
                  value={formData.weight} 
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="70kg"
                />
              </div>
            </div>
          )}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setEditMode(!editMode)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-4 rounded-3xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-xl flex items-center gap-3"
            >
              {editMode ? '✏️ Edit Mode' : '✏️ Edit Profile'}
            </button>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-xl"
            >
              📊 Go to Personal Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/family'}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-xl"
            >
              👨‍👩‍👧‍👦 Family Dashboard
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-8 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}
