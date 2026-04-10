import { useEffect, useState, useCallback, useMemo } from 'react'
import HabitCard from '../components/HabitCard'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [habitsLoading, setHabitsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('streak')
  const [error, setError] = useState('')
  const [addLoading, setAddLoading] = useState(false)


  useEffect(() => {
    fetchHabits()
  }, [])

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case 'streak': return b.streak - a.streak
        case 'consistency': return b.consistency - a.consistency
        case 'name': return a.name.localeCompare(b.name)
        case 'recent': return new Date(b.updatedAt) - new Date(a.updatedAt)
        default: return 0
      }
    })
  }, [habits, sortBy])

  const fetchHabits = useCallback(async () => {
    setHabitsLoading(true)
    // Bypass login for demo - comment out token check
    // const token = localStorage.getItem('token')
    // if (!token) {
    //   window.location.href = '/'
    //   return
    // }
    try {
    const demoToken = 'demo-token'
    const res = await fetch('/api/habits', {
        headers: { Authorization: `Bearer ${demoToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        setHabits(data)
        setError('')
      } else {
        // Load demo data
        const { demoHabits } = await import('../components/DemoData')
        setHabits(demoHabits)
        setError('Demo mode - using sample data (no Mongo needed)')
      }
    } catch (err) {
      setError('Failed to load habits')
    } finally {
      setHabitsLoading(false)
    }
  }, [])

  const addHabit = async () => {
    if (!newHabit.trim()) return
    setAddLoading(true)
    setError('')
    const demoToken = 'demo-token'
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${demoToken}`
        },
        body: JSON.stringify({ name: newHabit.trim() })
      })
      if (res.ok) {
        setNewHabit('')
        // Optimistic add not implemented yet
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add habit')
    } finally {
      setAddLoading(false)
    }
  }

  const deleteHabit = async (id) => {
    const demoToken = 'demo-token'
    const res = await fetch(`/api/habits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      // Parent will handle optimistic via HabitCard
      fetchHabits()
    }
  }

  const completeHabit = async (id) => {
    const demoToken = 'demo-token'
    const res = await fetch(`/api/habits/${id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message)
    }
    return res.json()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Habit Tracker</h1>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }} className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200">
          Logout
        </button>
      </div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md">
          <input
            type="text"
            placeholder="e.g., Drink water, Exercise..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            disabled={addLoading}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <button 
            onClick={addHabit} 
            disabled={!newHabit.trim() || addLoading}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              'Add Habit +'
            )}
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 font-medium flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['streak', 'consistency', 'name', 'recent'].map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              sortBy === option
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {habitsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : sortedHabits.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">No habits yet</h3>
            <p>Add your first habit above to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onComplete={completeHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}