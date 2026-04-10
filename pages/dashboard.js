
import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
      <ReminderPopup habits={habits} onDismiss={completeHabit} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">👤</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Personal Habits
                </h1>
                <p className="text-lg text-gray-700 font-semibold">Your private journey</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/profile'}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                Profile
              </button>
              <button 
                onClick={() => window.location.href = '/family'}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                👨‍👩‍👧‍👦 Family
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/' }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
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
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-12 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center gap-3 min-w-[200px]"
            >
              🙌 Add Personal Habit
            </button>
          </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {['streak', 'consistency', 'name', 'recent'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-8 py-4 rounded-3xl font-bold shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 backdrop-blur-md ${
                  sortBy === option
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50 ring-4 ring-emerald-200/50'
                    : 'bg-white/80 border-4 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800'
                }`}
              >
                {option === 'streak' ? '🔥 Longest Streak' : 
                 option === 'consistency' ? '📈 Best Consistency' :
                 option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          {habitsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl animate-pulse border border-gray-200">
                  <div className="h-10 bg-gray-200 rounded-2xl w-4/5 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-8xl mb-8">🙌</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">No Personal Habits Yet</h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">Add your first personal habit to start your journey!</p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">
                <span>✨</span>
                Your transformation starts now
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </>
  )
}
