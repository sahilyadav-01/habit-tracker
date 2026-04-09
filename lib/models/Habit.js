import mongoose from 'mongoose'

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  timestamps: true
})

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema)