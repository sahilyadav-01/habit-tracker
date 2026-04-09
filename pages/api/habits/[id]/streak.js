import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/mongoose'
import Habit from '../../../../lib/models/Habit'
import Completion from '../../../../lib/models/Completion'
import { calculateStreak } from '../../../../lib/utils'

export default async function handler(req, res) {
  await dbConnect()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    const { id } = req.query

    // Check ownership
    const habit = await Habit.findOne({ _id: id, userId })
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' })
    }

    // Optimized recent completions
    const oneYearAgoStr = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const recentCompletions = await Completion.find({ 
      habitId: id, 
      date: { $gte: oneYearAgoStr } 
    }).sort({ date: -1 }).limit(366)

    const streak = calculateStreak(recentCompletions)

    res.status(200).json({ streak })
  } catch (error) {
    console.error('Streak error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
