import { useState } from 'react'

export default function HabitCard({ habit, onComplete, onDelete }) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localStreak, setLocalStreak] = useState(habit.streak)
  const [showProgress, setShowProgress] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    setLocalStreak(localStreak + 1) // Optimistic
    try {
      await onComplete(habit._id)
    } catch (error) {
      setLocalStreak(habit.streak) // Rollback
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this habit?')) return
    setIsDeleting(true)
    try {
      await onDelete(habit._id)
    } catch (error) {
      // Rollback not needed as parent removes
    } finally {
      setIsDeleting(false)
    }
  }

  const consistencyPercent = Math.min(habit.consistency, 100)

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '👍'
    return '📈'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
        <span className="text-2xl">{getStreakEmoji(localStreak)}</span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Streak</span>
          <span className="font-semibold text-blue-600">{localStreak} days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${consistencyPercent}%` }}
            title={`${habit.consistency}% consistency`}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Completions</span>
          <span>{habit.completions}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleComplete}
          disabled={isCompleting || isDeleting}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCompleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Marking...
            </>
          ) : (
            'Mark Done ✅'
          )}
        </button>
        <button 
          onClick={handleDelete}
          disabled={isCompleting || isDeleting}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete 🗑️'}
        </button>
      </div>
    </div>
  )
}
