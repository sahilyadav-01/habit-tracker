import mongoose from 'mongoose'

const CompletionSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timestamps: true
})

CompletionSchema.index({ habitId: 1, date: 1 }, { unique: true })

export default mongoose.models.Completion || mongoose.model('Completion', CompletionSchema)