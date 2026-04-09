import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongoose'
import Habit from '../../../lib/models/Habit'

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

    if (req.method === 'DELETE') {
      const habit = await Habit.findOneAndDelete({ _id: id, userId })
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      res.status(200).json({ message: 'Habit deleted' })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}