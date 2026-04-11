import { useState, useEffect } from 'react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [useOtp, setUseOtp] = useState(false)
  const [otpStep, setOtpStep] = useState('email') // 'email', 'otp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(true)
  const [otpTimer, setOtpTimer] = useState(300)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (otpStep === 'otp' && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (otpTimer === 0) {
      setMessage('OTP expired. Request new one.')
    }
  }, [otpStep, otpTimer])

  const handleGoogleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    localStorage.setItem('token', 'google-demo-token')
    localStorage.setItem('provider', 'google')
    localStorage.setItem('userType', 'personal')
    
    window.location.href = '/dashboard'
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
      } else {
        setMessage(data.message)
        setOtpStep('otp')
        setOtpTimer(300)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
      } else {
        localStorage.setItem('token', data.token)
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (demoMode) {
      // Demo mode
      await new Promise(resolve => setTimeout(resolve, 1500))
      localStorage.setItem('token', isLogin ? 'email-login-token' : 'email-register-token')
      localStorage.setItem('name', name)
      localStorage.setItem('provider', 'email')
      localStorage.setItem('userType', 'personal')
      window.location.href = '/dashboard'
      return
    }

    // Real API calls (implement register/login APIs properly later)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin ? { email, password } : { email, password, name }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
      } else {
        localStorage.setItem('token', data.token)
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const toggleOtpMode = () => {
    setUseOtp(!useOtp)
    setOtpStep('email')
    setOtp('')
    setError('')
  }

  const requestNewOtp = () => {
    setOtpStep('email')
    setOtp('')
    setOtpTimer(300)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent drop-shadow-lg mb-2">
            Habit Tracker Pro
          </h1>
          <p className="text-lg text-gray-600 font-medium">Welcome {isLogin ? 'back' : 'aboard'}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue' : 'Join and start tracking habits today'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={handleGoogleLogin}
              type="button"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {otpStep === 'email' && (
            <form onSubmit={useOtp ? handleSendOtp : handlePasswordSubmit} className="space-y-6 mt-8">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-inner"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-inner"
                  required
                  disabled={loading}
                />
              </div>
              
              {!useOtp && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-inner"
                    required={!useOtp}
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 font-semibold flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  {error}
                </div>
              )}

              {message && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-800 font-semibold flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-gray-700">Demo Mode</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {useOtp ? 'Sending OTP...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </>
                ) : (
                  <>
                    <span>{useOtp ? '📱' : '🚀'}</span>
                    {useOtp ? 'Send OTP' : (isLogin ? 'Sign In' : 'Create Account')}
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={toggleOtpMode}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  disabled={loading}
                >
                  {useOtp ? 'Use Password Instead' : 'Use OTP Login 📱'}
                </button>
              </div>
            </form>
          )}

          {otpStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 mt-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP (sent to {email})
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all text-2xl font-mono tracking-widest text-center shadow-inner bg-gradient-to-r from-emerald-50 to-teal-50"
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Request new OTP'}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 font-semibold flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || otpTimer === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    Verify OTP
                  </>
                )}
              </button>

              {otpTimer === 0 && (
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={requestNewOtp}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
              disabled={loading}
            >
              {isLogin ? 'Create new account →' : '← Already have account? Sign in'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-2 border-emerald-200 text-emerald-800 font-semibold text-sm text-center">
            ✨ Demo Mode ON - Works instantly! Toggle for real APIs
          </div>
        </div>
      </div>
    </div>
  )
}

