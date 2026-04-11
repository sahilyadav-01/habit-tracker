import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const validation = verifyOtpSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid email or OTP format' })
    }

    const { email, otp } = req.body

    // Mock user check
    if (!mockUsers.has(email)) {
      return res.status(400).json({ message: 'No OTP found. Send OTP first.' })
    }

    const userData = mockUsers.get(email)
    if (!userData.otpExpiresAt || userData.otpExpiresAt < new Date()) {
      mockUsers.delete(email)
      return res.status(400).json({ message: 'OTP expired. Request new one.' })
    }

    const isValidOtp = await bcrypt.compare(otp, userData.otp)
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // Issue JWT
    const token = jwt.sign({ userId: `demo_${Date.now()}`, email }, 'demo-secret', { expiresIn: '7d' })

    // Clear OTP
    mockUsers.delete(email)

    console.log(`✅ OTP verified for ${email}! Token issued.`)

    res.status(200).json({ token })

  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

