import mongoose from 'mongoose'

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  family: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  consistency: { type: Number, default: 0 },
  completions: { type: Number, default: 0 },
  members: { type: Number, default: 1 },
  timestamps: true
})

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema)