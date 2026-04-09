export function calculateStreak(completions) {
  if (completions.length === 0) return 0

  // Sort ascending (oldest first)
  const dates = [...new Set(completions.map(c => c.date))].sort((a, b) => a.localeCompare(b))
  
  let streak = 0
  let expectedDate = new Date()
  expectedDate.setHours(0,0,0,0)
  
  while (true) {
    const expectedDateStr = expectedDate.toISOString().split('T')[0]
    
    // Check if expected date exists in completions
    if (!dates.some(date => date === expectedDateStr)) {
      break
    }
    
    streak++
    expectedDate.setDate(expectedDate.getDate() - 1)
  }

  return streak
}

