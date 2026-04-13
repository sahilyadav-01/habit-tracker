import { useState, useEffect } from 'react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [useOtp, setUseOtp] = useState(false)
  const [otpStep, setOtpStep] = useState('email') 
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      localStorage.setItem('token', isLogin ? 'email-login-token' : 'email-register-token')
      localStorage.setItem('name', name)
      localStorage.setItem('provider', 'email')
      localStorage.setItem('userType', 'personal')
      window.location.href = '/dashboard'
      return
    }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-4xl font-bold text-white">HT</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Habit Tracker Pro
          </h1>
          <p className="text-lg text-gray-600 mt-2">Sign in to your premium account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {isLogin ? 'Welcome back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Enter your details to continue' : 'Join thousands tracking habits daily'}
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-8 py-4 text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 Ascent"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or use email</span>
            </div>
          </div>

          {otpStep === 'email' && (
            <form onSubmit={useOtp ? handleSendOtp : handlePasswordSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-sm"
                    placeholder="John Doe"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-sm"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
              
              {!useOtp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg shadow-sm"
                    placeholder="••••••••"
                    required={!useOtp}
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-medium">
                  {message}
                </div>
              )}

              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-gray-700 font-medium">Demo mode</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-indigo-200 transition-all duration-300 text-lg disabled:opacity-50"
              >
                {loading ? 'Loading...' : useOtp ? 'Send OTP' : isLogin ? 'Sign in' : 'Create account'}
              </button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={toggleOtpMode}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {useOtp ? 'Use password instead' : 'Use OTP instead'}
                </button>
              </div>
            </form>
          )}

          {otpStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  OTP code sent to {email}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-2xl font-mono tracking-widest text-center font-bold"
                  placeholder="123456"
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Request new code'}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading || otpTimer === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-indigo-200 transition-all duration-300 text-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {otpTimer === 0 && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={requestNewOtp}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="text-center pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
            >
              {isLogin ? 'Create new account' : 'Already have account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

