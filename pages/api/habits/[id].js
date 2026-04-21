import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongoose'
import Habit from '../../../lib/models/Habit'
import Completion from '../../../lib/models/Completion'

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

    if (req.method === 'PUT') {
      const { name, frequency } = req.body
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Valid name required' })
      }
      const habit = await Habit.findOneAndUpdate(
        { _id: id, userId },
        { name, frequency, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      res.status(200).json(habit)
    } else if (req.method === 'DELETE') {
      const habit = await Habit.findOneAndDelete({ _id: id, userId })
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      await Completion.deleteMany({ habitId: id })
      res.status(200).json({ message: 'Habit deleted' })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
