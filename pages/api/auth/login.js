import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

let mockUsers = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid email/password' })
    }

    const { email, password } = req.body

    // Mock login
    const userData = mockUsers.get(email)
    if (!userData) {
      return res.status(400).json({ message: 'User not found. Register first.' })
    }

    const isValid = await bcrypt.compare(password, userData.password)
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: `demo_${Date.now()}`, email }, 'demo-secret', { expiresIn: '7d' })

    console.log(`✅ Password login for ${email}`)

    res.status(200).json({ token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

