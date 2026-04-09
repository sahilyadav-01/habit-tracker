import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongoose'
import Habit from '../../../lib/models/Habit'
import Completion from '../../../lib/models/Completion'
import { calculateStreak } from '../../../lib/utils'

export default async function handler(req, res) {
  await dbConnect()

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    if (req.method === 'GET') {
      const habits = await Habit.find({ userId })

      const habitsWithStats = await Promise.all(habits.map(async (habit) => {
        // Optimize: only recent year needed for streak/consistency
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0]
        
        const completions = await Completion.find({ 
          habitId: habit._id, 
          date: { $gte: oneYearAgoStr }
        }).sort({ date: -1 }).limit(366)
        
        const streak = calculateStreak(completions)
        const daysSinceCreated = Math.floor((new Date() - habit.createdAt) / (1000 * 60 * 60 * 24)) + 1
        const consistency = daysSinceCreated > 0 ? (completions.length / daysSinceCreated) * 100 : 0

        return {
          ...habit.toObject(),
          streak,
          consistency: Math.round(consistency),
          completions: completions.length
        }
      }))

      res.status(200).json(habitsWithStats)
    } else if (req.method === 'POST') {
      const { name } = req.body
      if (!name) {
        return res.status(400).json({ message: 'Name is required' })
      }
      const habit = new Habit({ userId, name })
      await habit.save()
      res.status(201).json(habit)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}