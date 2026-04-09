import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongoose'
import Habit from '../../../lib/models/Habit'
import Completion from '../../../lib/models/Completion'
import { calculateStreak } from '../../../lib/utils'
import { validateHabitComplete } from '../../../lib/validation'

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

    // Check if habit belongs to user
    const habit = await Habit.findOne({ _id: id, userId })
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' })
    }

    if (req.method === 'POST') {
      // Zod validation (no body)
      const validation = validateHabitComplete(req.body)
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message })
      }

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // Atomic upsert for idempotency
      const completion = await Completion.findOneAndUpdate(
        { habitId: id, date: today },
        { habitId: id, date: today },
        { upsert: true, new: true }
      )

      // Get updated stats
      const oneYearAgoStr = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const recentCompletions = await Completion.find({ 
        habitId: id, 
        date: { $gte: oneYearAgoStr } 
      }).sort({ date: -1 }).limit(366)
      const streak = calculateStreak(recentCompletions)
      const daysSinceCreated = Math.floor((new Date() - habit.createdAt) / (1000 * 60 * 60 * 24)) + 1
      const consistency = daysSinceCreated > 0 ? Math.round((recentCompletions.length / daysSinceCreated) * 100) : 0

      res.status(201).json({
        message: 'Completed successfully',
        completion,
        streak,
        consistency,
        totalCompletions: recentCompletions.length
      })
    } else if (req.method === 'GET') {
      const completions = await Completion.find({ habitId: id }).sort({ date: -1 }).limit(100)
      res.status(200).json(completions)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Complete error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
