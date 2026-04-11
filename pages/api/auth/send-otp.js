


const sendOtpSchema = z.object({
  email: z.string().email(),
})



export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const validation = sendOtpSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const { email } = req.body

    // Mock user check
    if (!mockUsers.has(email)) {
      mockUsers.set(email, { createdAt: new Date() })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = await bcrypt.hash(otp, 10)

    // Set expiry 5 minutes
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Save mock
    mockUsers.set(email, { ...mockUsers.get(email), otp: hashedOtp, otpExpiresAt })

    console.log(`🔥 DEMO OTP for ${email}: ${otp}`) // Visible in terminal!

    // Try email (optional)
    try {
      const emailResult = await sendOtpEmail(email, otp)
      console.log('Email result:', emailResult)
    } catch (e) {
      console.log('Email failed (no SMTP ok for demo):', e.message)
    }

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent! Check terminal/console (demo mode) or email.' 
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

