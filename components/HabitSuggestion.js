import { useState, useEffect } from 'react'

const commonHabits = [
  'Morning meditation',
  'Drink 8 glasses of water',
  '30 min walk',
  'Read 10 pages',
  'Journal 3 gratitudes',
  'Family dinner together',
  'Bedtime by 10pm',
  'No phone after 9pm',
  'Family game night',
  'Homework time',
  'Daily vitamins',
  'Stretch 5 min',
  'Floss teeth',
  'Plan tomorrow'
]

export default function HabitSuggestion({ onSelect, value = '', onChange = () => {} }) {
  const [query, setQuery] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setQuery(value)
  }, [value])

  const filteredHabits = commonHabits
    .filter(habit => habit.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)

  const handleInputChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    if (onChange) onChange(newQuery)
    setShowSuggestions(true)
  }

  const handleSelect = (habit) => {
    onSelect(habit)
    setQuery('')
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <input
        onFocus={() => setShowSuggestions(true)}
        placeholder="Type new habit or select suggestion..."
        value={query}
        onChange={handleInputChange}
        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium text-lg shadow-inner"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onSelect) {
            onSelect(query.trim())
          }
        }}
      />
      {showSuggestions && query && filteredHabits.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 z-10 max-h-60 overflow-auto">
          {filteredHabits.map((habit, index) => (
            <button
              key={index}
              onClick={() => handleSelect(habit)}
              className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl hover:scale-[1.02] transition-all duration-200 text-lg font-medium border-b border-gray-100 last:border-b-0"
            >
              {habit}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
