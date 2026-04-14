import React, { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import HabitCard from '../components/HabitCard'
import ReminderPopup from '../components/ReminderPopup'
import HabitSuggestion from '../components/HabitSuggestion'
import { demoHabits } from '../components/DemoData'
import { motion, AnimatePresence } from 'framer-motion' // Assume installed or remove if not

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
    avgStreak: habits.reduce((sum, h) => sum + h.streak, 0) / habits.length || 0,
    avgConsistency: habits.reduce((sum, h) => sum + h.consistency, 0) / habits.length || 0
  }), [habits])

  const addHabit = (habitName) => {
    const name = habitName || newHabit.trim()
    if (!name) return
    const newHabitObj = {
      _id: 'personal-' + Date.now(),
      name,
      streak: 0,
      consistency: 0,
      completions: 0,
      updatedAt: new Date().toISOString(),
      emoji: '💪'
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {Object.entries(stats).map(([key, value], i) => (
              <motion.div 
                key={key}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-200/50 hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="text-emerald-500 text-3xl mb-2">
                  {key === 'total' ? '📊' : key === 'avgStreak' ? '🔥' : '📈'}
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{Math.round(value)}</div>
                <div className="text-sm font-semibold text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Add Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-200/50 mb-12 hover:shadow-emerald-400/30 transition-all duration-500"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-end">
              <div className="flex-1">
                <HabitSuggestion 
                  value={newHabit} 
                  onChange={setNewHabit}
                  onSelect={addHabit} 
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addHabit()} 
                disabled={!newHabit.trim()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-12 rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center gap-3 min-w-[200px]"
              >
                🙌 Add Habit
              </motion.button>
            </div>
          </motion.div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {['streak', 'consistency', 'name', 'recent'].map((option, i) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
                onClick={() => setSortBy(option)}
                className={`px-8 py-4 rounded-3xl font-bold shadow-xl backdrop-blur-md border-4 transition-all duration-300 ${sortBy === option
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50 ring-4 ring-emerald-200/50'
                  : 'bg-white/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 hover:shadow-emerald-300/50'
                }`}
              >
                {option === 'streak' ? '🔥 Longest Streak' : 
                 option === 'consistency' ? '📈 Best Consistency' :
                 option.charAt(0).toUpperCase() + option.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          {habitsLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array(8).fill(0).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-white/60 to-emerald-50/60 backdrop-blur-md p-8 rounded-3xl shadow-xl animate-pulse border border-emerald-200/50"
                >
                  <div className="h-12 bg-emerald-200/50 rounded-2xl w-4/5 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-emerald-200/50 rounded-lg w-1/2"></div>
                    <div className="h-5 bg-emerald-200/50 rounded-full w-full"></div>
                    <div className="h-4 bg-emerald-200/50 rounded-lg w-1/3"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : habits.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-8"
              >
                🙌
              </motion.div>
              <motion.h2 
                initial={{ y: 20 }}
                animate={{ y: [20, 0, 20] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6"
              >
                Start Your Journey!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="text-2xl text-gray-600 max-w-lg mx-auto mb-12"
              >
                Add your first habit and watch your streak grow ✨
              </motion.p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedHabits.map((habit, i) => (
                  <motion.div
                    key={habit._id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <HabitCard
                      habit={habit}
                      onComplete={completeHabit}
                      onDelete={deleteHabit}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  )
}
