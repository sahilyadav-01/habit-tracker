import React, { useState, useEffect, useMemo } from 'react'
import HabitCard from '../components/HabitCard'
import ReminderPopup from '../components/ReminderPopup'
import HabitSuggestion from '../components/HabitSuggestion'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import { getHabits, createHabit, completeHabit, deleteHabit } from '../lib/api'
import { familyHabits } from '../components/DemoData'

export default function FamilyDashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [sortBy, setSortBy] = useState('streak')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadHabits = async () => {
      try {
        setLoading(true)
        const habits = await getHabits(true)
        setHabits(habits)
      } catch (err) {
        setError(err.message)
        setHabits([])
      } finally {
        setLoading(false)
      }
    }
    loadHabits()
  }, [])

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case 'streak': return b.streak - a.streak
        case 'consistency': return b.consistency - a.consistency
        case 'members': return b.members - a.members
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })
  }, [habits, sortBy])

  const addHabit = async (habitName) => {
    const name = habitName || newHabit.trim()
    if (!name) return
    try {
      const newHabitObj = await createHabit({ name, family: true })
      setHabits(prev => [newHabitObj, ...prev])
      setNewHabit('')
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteHabit = async (id) => {
    if (confirm('Remove family habit?')) {
      try {
        await deleteHabit(id)
        setHabits(prev => prev.filter(habit => habit._id !== id))
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const completeHabit = async (id) => {
    try {
      await completeHabit(id)
      // Refresh habits
      const habits = await getHabits(true)
      setHabits(habits)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Navbar />
      <ReminderPopup habits={habits} onDismiss={completeHabit} theme="family" />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8"> 
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Family Habits
                </h1>
                <p className="text-lg text-gray-700 font-semibold">Family progress together</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/profile')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                Profile
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                Personal
              </button>
              <button 
                onClick={() => { localStorage.clear(); router.push('/') }}
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
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-12 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center gap-3 min-w-[200px]"
            >
              👨‍👩‍👧‍👦 Add Family Habit
            </button>
          </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {['streak', 'consistency', 'members', 'name'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-8 py-4 rounded-3xl font-bold shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 backdrop-blur-md ${
                  sortBy === option
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/50 ring-4 ring-rose-200/50'
                    : 'bg-white/80 border-4 border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-gray-800'
                }`}
              >
                {option === 'streak' ? '🔥 Longest Streak' : 
                 option === 'consistency' ? '📈 Best Consistency' :
                 option === 'members' ? '👥 Most Family Members' :
                 'Name A-Z'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onComplete={completeHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
