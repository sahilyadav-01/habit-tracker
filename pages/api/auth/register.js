import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import dbConnect from '../../../lib/mongoose'
import User from '../../../lib/models/User'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

let mockUsers = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const validation = registerSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid email or password (min 8 chars)' })
    }

    const { email, password } = req.body

    // Mock first
    if (mockUsers.has(email)) {
      return res.status(400).json({ message: 'User already exists (demo)' })
    }

    // Mock register
    const hashedPassword = await bcrypt.hash(password, 10)
    mockUsers.set(email, { password: hashedPassword })
    console.log(`👤 Demo user registered: ${email}`)

    const token = jwt.sign({ userId: `demo_${Date.now()}`, email }, 'demo-secret', { expiresIn: '7d' })

    res.status(201).json({ token })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error (demo mode works instantly)' })
  }
}

