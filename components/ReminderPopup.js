import { useState, useEffect } from 'react'

export default function ReminderPopup({ habits, onDismiss, theme = 'personal' }) {
  const [show, setShow] = useState(false)
  const [currentReminder, setCurrentReminder] = useState(null)

  // Theme colors
  const themes = {
    personal: {
      bg: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-300/50',
      shadow: 'shadow-emerald-500/25',
      button: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      buttonHover: 'from-emerald-600 to-teal-700',
      icon: '🌿'
    },
    family: {
      bg: 'bg-gradient-to-r from-rose-500/20 to-pink-500/20',
      border: 'border-rose-300/50',
      shadow: 'shadow-rose-500/25',
      button: 'bg-gradient-to-r from-rose-500 to-pink-600',
      buttonHover: 'from-rose-600 to-pink-700',
      icon: '💕'
    }
  }

  const currentTheme = themes[theme] || themes.personal

  useEffect(() => {
    const interval = setInterval(() => {
      // Better logic: low consistency or zero streak
      const overdue = habits.filter(h => (h.streak === 0 || h.consistency < 30) && Math.random() > 0.8)
      if (overdue.length > 0) {
        const randomHabit = overdue[Math.floor(Math.random() * overdue.length)]
        setCurrentReminder(randomHabit)
        setShow(true)
      }
    }, 8000) // 8s for smoother demo

    return () => clearInterval(interval)
  }, [habits])

  if (!show) return null

  return (
    <div className={`fixed top-6 right-6 backdrop-blur-xl ${currentTheme.bg} border-2 ${currentTheme.border} text-gray-900 p-6 md:p-8 rounded-3xl shadow-2xl ${currentTheme.shadow} max-w-sm w-80 z-50 animate-slideInRight [&.animate-slideInRight]:${`animate-pulse`} max-md:scale-95 transition-all duration-500`}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="text-4xl p-2 rounded-2xl bg-white/20 backdrop-blur-sm">🔔</div>
          <div>
            <h3 className="font-black text-xl md:text-2xl bg-gradient-to-r bg-clip-text text-transparent from-gray-900 to-gray-700 mb-1">
              Habit Time!
            </h3>
            <p className="text-sm opacity-80">Don't break your streak</p>
          </div>
        </div>

        {/* Habit Info */}
        <div className="p-4 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{currentReminder?.emoji || '💪'}</span>
            <h4 className="font-bold text-lg md:text-xl flex-1">{currentReminder?.name || 'Your habit'}</h4>
          </div>
          <div className="text-sm opacity-90">
            Current streak: <span className="font-bold text-lg">{currentReminder?.streak || 0} 🔥</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => {
              onDismiss(currentReminder?._id)
              setShow(false)
            }}
            className={`flex-1 ${currentTheme.button} hover:${currentTheme.buttonHover} text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base border border-white/30`}
          >
            ✅ Mark Done
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 text-gray-800 hover:text-gray-900 font-medium"
          >
            ⏭️ Later
          </button>
        </div>

        {/* Close X */}
        <button 
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl hover:scale-110 transition-all"
        >
          ×
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  )
}
