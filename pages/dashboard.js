import React, { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import HabitCard from '../components/HabitCard'
import ReminderPopup from '../components/ReminderPopup'
import HabitSuggestion from '../components/HabitSuggestion'
import { demoHabits } from '../components/DemoData'

export default function PersonalDashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  const [habitsLoading, setHabitsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('streak')
  const [error, setError] = useState('')

  useEffect(() => {
    setHabitsLoading(false)
    setHabits(demoHabits)
  }, [])

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case 'streak': return b.streak - a.streak
        case 'consistency': return b.consistency - a.consistency
        case 'name': return a.name.localeCompare(b.name)
        case 'recent': return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        default: return 0
      }
    })
  }, [habits, sortBy])

  const stats = useMemo(() => ({
    total: habits.length,
    avgStreak: habits.length ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0,
    avgConsistency: habits.length ? Math.round(habits.reduce((sum, h) => sum + h.consistency, 0) / habits.length) : 0
  }), [habits])

  const addHabit = (habitName) => {
    const name = habitName || newHabit.trim()
    if (!name) return
    const newHabitObj = {
      _id: 'personal-' + Date.now(),
      name: name,
      streak: 0,
      consistency: 0,
      completions: 0,
      updatedAt: new Date().toISOString()
    }
    setHabits(prev => [newHabitObj, ...prev])
    setNewHabit('')
  }

  const deleteHabit = (id) => {
    if (confirm('Delete this habit?')) {
      setHabits(prev => prev.filter(habit => habit._id !== id))
    }
  }

  const completeHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit._id === id 
        ? { ...habit, streak: habit.streak + 1, updatedAt: new Date().toISOString() }
        : habit
    ))
  }

  return (
    <>
      <ReminderPopup habits={habits} onDismiss={completeHabit} theme="personal" />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl shadow-2xl flex items-center justify-center animate-spin-slow">
                <span className="text-3xl font-black text-white drop-shadow-lg">👤</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  Personal Habits
                </h1>
                <p className="text-xl text-gray-700 font-semibold mt-1">Your private streak journey</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/profile'}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Profile
              </button>
              <button 
                onClick={() => window.location.href = '/family'}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                👨‍👩‍👧‍👦 Family
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/' }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {Object.entries(stats).map(([key, value], i) => (
              <div 
                key={key}
                className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-200/50 hover:shadow-emerald-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                <div className="text-emerald-500 text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {key === 'total' ? '📊' : key === 'avgStreak' ? '🔥' : '📈'}
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">{value}</div>
                <div className="text-lg font-semibold text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>

          {/* Add Habit Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-12 hover:shadow-emerald-300/50 transition-all duration-500">
            <div className="flex flex-col lg:flex-row gap-6 items-end">
              <div className="flex-1">
                <HabitSuggestion 
                  value={newHabit} 
                  onChange={setNewHabit}
                  onSelect={addHabit} 
                />
              </div>
              <button 
                onClick={() => addHabit()} 
                disabled={!newHabit.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-12 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center gap-3 min-w-[200px]"
              >
                🙌 Add Personal Habit
              </button>
            </div>
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {['streak', 'consistency', 'name', 'recent'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-8 py-4 rounded-3xl font-bold shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 backdrop-blur-md border-4 group ${sortBy === option
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50 ring-4 ring-emerald-200/50'
                  : 'bg-white/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 hover:shadow-emerald-300/50'
                }`}
              >
                {option === 'streak' ? '🔥 Longest Streak' : 
                 option === 'consistency' ? '📈 Best Consistency' :
                 option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          {habitsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl animate-pulse border border-emerald-200/50">
                  <div className="h-12 bg-emerald-200/50 rounded-2xl w-4/5 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-emerald-200/50 rounded-xl w-3/5"></div>
                    <div className="h-6 bg-emerald-200/50 rounded-full w-full"></div>
                    <div className="h-5 bg-emerald-200/50 rounded-lg w-2/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-[120px] mb-12 animate-bounce">🙌</div>
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                No Habits Yet
              </h2>
              <p className="text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                Your transformation starts with the first step. Add a habit and build unstoppable momentum!
              </p>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-12 py-6 rounded-3xl font-bold shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all duration-300 text-xl">
                ✨ First Habit Awaits
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedHabits.map((habit, index) => (
                <div 
                  key={habit._id}
                  className="animate-in slide-in-from-bottom-4 duration-700 delay-[100ms]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <HabitCard
                    habit={habit}
                    onComplete={completeHabit}
                    onDelete={deleteHabit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation-fill-mode: both;
        }
      `}</style>
    </>
  )
}
