import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)