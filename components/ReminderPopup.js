import { useState, useEffect } from 'react'

export default function ReminderPopup({ habits, onDismiss }) {
  const [show, setShow] = useState(false)
  const [currentReminder, setCurrentReminder] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const overdue = habits.filter(h => h.streak === 0 && Math.random() > 0.7) // Simulate daily check
      if (overdue.length > 0) {
        const randomHabit = overdue[Math.floor(Math.random() * overdue.length)]
        setCurrentReminder(randomHabit)
        setShow(true)
      }
    }, 10000) // Check every 10s for demo

    return () => clearInterval(interval)
  }, [habits])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-white max-w-sm z-50 animate-bounce">
      <div className="flex items-start gap-3">
        <div className="text-4xl">🔔</div>
        <div>
          <h3 className="font-bold text-lg mb-1">Daily Reminder!</h3>
          <p className="text-sm opacity-90 mb-3">Time to do your habit:</p>
          <h4 className="font-bold text-xl">{currentReminder?.name || 'habit'}</h4>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => onDismiss(currentReminder?._id)}
              className="bg-white text-orange-600 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition-all"
            >
              Mark Done
            </button>
            <button 
              onClick={() => setShow(false)}
              className="text-white underline hover:opacity-75"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
