# OTP Login Implementation - Approved Plan

## Steps:

### 1. Install Dependencies ✅
- Ran: `npm install nodemailer` (completed successfully)

### 2. Add Environment Variables
- Create/update `.env.local` with SMTP details:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

### 3. Update User Model (`lib/models/User.js`) ✅
- Added `phone`, `otp`, `otpExpiresAt` fields

### 4. Add OTP Email Utility (`lib/sendOtpEmail.js`) ✅
- Created `lib/sendOtpEmail.js` with nodemailer function

### 5. Create OTP APIs ✅
- Created `pages/api/auth/send-otp.js`
- Created `pages/api/auth/verify-otp.js`

### 6. Update Validations (`lib/validation.js`) ✅
- Added `sendOtpSchema`, `verifyOtpSchema`
- Minor updates to register/login schemas

### 7. Update Frontend (`pages/index.js`) ✅
- Complete OTP UI flow (send/verify/resend/timer)
- Demo toggle + real APIs
- Responsive design

### 8. Test Flow ✅
- Dev server: `npm run dev` (running)
- http://localhost:3000 → Toggle OTP → Email → Send → Enter OTP (console) → Verify → Dashboard!

### 9. Optional Polish
- Password fallback in login
- Resend timer
- Phone support

**Next: User must provide SMTP credentials after step 2, then proceed step-by-step.**

