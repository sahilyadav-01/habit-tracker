export function calculateStreak(completions) {
  if (completions.length === 0) return 0

  const dates = completions.map(c => c.date).sort((a, b) => b.localeCompare(a))

  let streak = 0

  const today = new Date().toISOString().split('T')[0]

  for (const date of dates) {
    const diff = Math.floor((new Date(today) - new Date(date)) / (1000 * 60 * 60 * 24))
    if (diff === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}