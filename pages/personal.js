import { useState, useMemo } from 'react'
import HabitCard from '../components/HabitCard'
import { demoHabits } from '../components/DemoData'

export default function PersonalDashboard() {
  const [habits, setHabits] = useState(demoHabits)
  const [newHabit, setNewHabit] = useState('')
  const [sortBy, setSortBy] = useState('streak')

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case 'streak': return b.streak - a.streak
        case 'consistency': return b.consistency - a.consistency
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })
  }, [habits, sortBy])

  const addHabit = () => {
    if (!newHabit.trim()) return
    const newHabitObj = {
      _id: 'personal-' + Date.now(),
      name: newHabit.trim(),
      streak: 0,
      consistency: 0,
      completions: 0
    }
    setHabits(prev => [newHabitObj, ...prev])
    setNewHabit('')
  }

  const deleteHabit = (id) => {
    if (confirm('Delete personal habit?')) {
      setHabits(prev => prev.filter(habit => habit._id !== id))
    }
  }

  const completeHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit._id === id 
        ? { ...habit, streak: habit.streak + 1 }
        : habit
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            🙌 Personal Habits
          </h1>
          <p className="text-2xl text-gray-700 font-semibold">Your private habit journey</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-200 mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="My personal habit (e.g., Meditate, Journal...)"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="flex-1 p-4 border-2 border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all font-medium text-lg"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <button 
              onClick={addHabit}
              disabled={!newHabit.trim()}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
            >
              + Personal
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-12 justify-center flex-wrap">
          {['streak', 'consistency', 'name'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                sortBy === option
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/50'
                  : 'bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 shadow-md'
              }`}
            >
              {option === 'streak' ? '🏆 Streak' :
               option === 'consistency' ? '📊 Consistency' :
               'Name'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  )
}
