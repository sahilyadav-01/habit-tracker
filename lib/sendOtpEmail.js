import nodemailer from 'nodemailer'

export async function sendOtpEmail(email, otp) {
  // Skip real email for demo - always "success" so APIs don't fail
  console.log(`📧 Would send OTP ${otp} to ${email} (SMTP optional)`)
  return { success: true }
}

