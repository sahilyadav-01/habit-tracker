import { useState } from 'react'

export default function HabitCard({ habit, onComplete, onDelete, onEdit }) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [localStreak, setLocalStreak] = useState(habit.streak)

  const handleComplete = () => {
    setLocalStreak(localStreak + 1)
    if (localStreak >= 7) {
      if (localStreak === 7) alert('⚡ First Week Streak! Amazing!')
      else if (localStreak === 30) alert('🔥 30 Day Legend! Keep going!')
      else if (localStreak % 7 === 0) alert(`🎉 ${localStreak} Day Streak!`)
    }
    onComplete(habit._id)
  }

  const handleEdit = () => {
    setEditName(habit.name)
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editName.trim() || editName === habit.name) {
      setIsEditing(false)
      return
    }
    if (!onEdit) return
    setIsSaving(true)
    try {
      await onEdit(habit._id, { name: editName.trim() })
    } catch (err) {
      alert('Update failed')
    }
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditName('')
  }

  const handleDelete = () => {
    if (confirm('Delete this habit?')) {
      onDelete(habit._id)
    }
  }

  const consistencyPercent = Math.min(habit.consistency, 100)
  const getStreakEmoji = (streak) => streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : streak >= 3 ? '👍' : '📈'

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit()
              if (e.key === 'Escape') handleCancelEdit()
            }}
            className="flex-1 p-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none text-xl font-bold bg-blue-50 min-w-0"
            autoFocus
          />
        ) : (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{habit.name}</h2>
        )}
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
          <span>Total</span>
          <span>{habit.completions}</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={handleComplete}
          disabled={isCompleting || isDeleting || isEditing || isSaving}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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
        {isEditing ? (
          <>
            <button 
              onClick={handleSaveEdit}
              disabled={isSaving || !editName.trim()}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm flex items-center gap-1"
            >
              {isSaving ? 'Saving...' : 'Save 💾'}
            </button>
            <button 
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleEdit}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-1"
            >
              Edit ✏️
            </button>
            <button 
              onClick={handleDelete}
              disabled={isCompleting || isEditing || isSaving}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
            >
              Delete 🗑️
            </button>
          </>
        )}
      </div>
    </div>
  )
}

