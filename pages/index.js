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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-pink-900/30 relative overflow-hidden">
      {/* Premium Animated Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-float-med" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-float-fast" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="w-full max-w-md">
          
          {/* Premium Hero Section */}
          <div className="text-center mb-12 glass-premium rounded-3xl p-8 shadow-premium-glow">
            <div className="premium-badge mb-6 inline-flex items-center gap-2 shadow-lg mx-auto">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              PRO EDITION
            </div>
            <div className="text-6xl mb-6 premium-glow">🚀</div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl mb-4 tracking-tight">
              Habit Tracker Pro
            </h1>
            <p className="text-xl text-white/90 font-semibold bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg">
              Premium Experience Awaits
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-white/80 font-mono tracking-wider">
              <span>• Unlimited Habits</span>
              <span>• Family Sync</span>
              <span>• AI Insights</span>
            </div>
          </div>

          {/* Premium Glass Card */}
          <div className="glass-premium rounded-3xl shadow-premium p-10 relative border-premium">
            
            <div className="mb-10">
              <h2 className="text-3xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text mb-3 shadow-lg">
                {isLogin ? 'Welcome Back' : 'Join Pro'}
              </h2>
              <p className="text-gray-300 text-lg font-medium">
                {isLogin ? 'Access premium dashboard instantly' : 'Unlock unlimited premium features'}
              </p>
            </div>

            {/* Google Pro Button */}
            <div className="space-y-4 mb-10">
              <button 
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
                className="premium-ripple w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-black py-5 px-8 rounded-3xl shadow-premium text-xl flex items-center justify-center gap-3 premium-shimmer hover:shadow-premium-glow transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50"
              >
                <span className="w-8 h-8 bg-white rounded-2xl shadow-lg flex items-center justify-center font-bold text-2xl">
                  G
                </span>
                Continue with Google Pro
              </button>
            </div>

            {/* Premium Divider */}
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-6 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full border border-white/20 py-2 font-mono">
                  or Premium Email
                </span>
              </div>
            </div>

            {otpStep === 'email' && (
              <form onSubmit={useOtp ? handleSendOtp : handlePasswordSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder=" "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="premium-ripple w-full p-5 border-2 border-transparent rounded-3xl focus:border-yellow-400 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 text-lg font-semibold shadow-premium peer transition-all focus:ring-4 focus:ring-yellow-400/50"
                      required={!isLogin}
                      disabled={loading}
                    />
                    <label className="absolute left-5 top-5 text-gray-400 transition-all duration-300 -translate-y-2 scale-75 bg-gray-900 px-2 peer-focus:text-yellow-300 text-sm font-bold peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:scale-100">
                      Full Name
                    </label>
                  </div>
                )}
                
                <div className="relative group">
                  <input
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="premium-ripple w-full p-5 border-2 border-transparent rounded-3xl focus:border-yellow-400 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 text-lg font-semibold shadow-premium peer transition-all focus:ring-4 focus:ring-yellow-400/50"
                    required
                    disabled={loading}
                  />
                  <label className="absolute left-5 top-5 text-gray-400 transition-all duration-300 -translate-y-2 scale-75 bg-gray-900 px-2 peer-focus:text-yellow-300 text-sm font-bold peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:scale-100">
                    Email Address
                  </label>
                </div>
                
                {!useOtp && (
                  <div className="relative group">
                    <input
                      type="password"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="premium-ripple w-full p-5 border-2 border-transparent rounded-3xl focus:border-yellow-400 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 text-lg font-semibold shadow-premium peer transition-all focus:ring-4 focus:ring-yellow-400/50"
                      required={!useOtp}
                      disabled={loading}
                    />
                    <label className="absolute left-5 top-5 text-gray-400 transition-all duration-300 -translate-y-2 scale-75 bg-gray-900 px-2 peer-focus:text-yellow-300 text-sm font-bold peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:scale-100">
                      Password
                    </label>
                  </div>
                )}

                {error && (
                  <div className="p-5 bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-3xl text-red-100 font-semibold flex items-center gap-3 animate-pulse">
                    <span className="text-2xl shrink-0">⚠️</span>
                    {error}
                  </div>
                )}

                {message && (
                  <div className="p-5 bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-sm rounded-3xl text-emerald-100 font-semibold flex items-center gap-3 premium-shimmer">
                    <span className="text-2xl shrink-0">📧</span>
                    {message}
                  </div>
                )}

                <div className="flex items-center pt-2">
                  <label className="flex items-center gap-3 text-sm text-gray-300 bg-gray-900/80 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-600/50">
                    <input 
                      type="checkbox" 
                      checked={demoMode}
                      onChange={(e) => setDemoMode(e.target.checked)}
                      className="w-5 h-5 accent-yellow-400 rounded-lg shadow-md focus:ring-yellow-400 bg-gray-800 border-gray-600"
                      disabled={loading}
                    />
                    <span>Demo Mode (Instant Access)</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="premium-ripple w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-700 text-gray-900 font-black py-6 px-10 rounded-3xl shadow-premium-lg text-xl flex items-center justify-center gap-3 premium-shimmer hover:shadow-premium-glow transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-8 h-8 border-3 border-gray-900/50 border-t-yellow-400 rounded-full animate-spin shadow-xl" />
                      {useOtp ? 'Sending Pro OTP...' : (isLogin ? 'Sign In Premium' : 'Create Pro Account')}
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{useOtp ? '📱' : '⭐'}</span>
                      {useOtp ? 'Send Pro OTP' : (isLogin ? 'Pro Sign In' : 'Create Pro Account')}
                    </>
                  )}
                </button>

                <div className="text-center pt-6">
                  <button 
                    type="button"
                    onClick={toggleOtpMode}
                    className="text-yellow-400 hover:text-yellow-300 font-bold text-lg transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-yellow-400/30 hover:border-yellow-400 shadow-lg hover:shadow-premium-glow premium-shimmer"
                    disabled={loading}
                  >
                    {useOtp ? 'Use Password' : 'Pro OTP Login 📱'}
                  </button>
                </div>
              </form>
            )}

            {otpStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-xl font-black text-yellow-300 text-center tracking-widest mb-6">
                    Pro OTP Verification
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    className="premium-ripple w-full p-8 border-2 border-transparent rounded-3xl focus:border-yellow-400 bg-gradient-to-r from-yellow-500/5 to-purple-500/5 backdrop-blur-xl text-3xl font-mono tracking-[1em] text-center font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 shadow-premium hover:shadow-premium-glow transition-all focus:ring-4 focus:ring-yellow-400/40"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="text-center text-sm text-gray-400 font-mono tracking-wider bg-gray-900/50 px-8 py-3 rounded-2xl backdrop-blur-sm border border-gray-600/30">
                  Expires in <span className="text-yellow-400 font-mono font-bold text-xl ml-1">
                    {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {error && (
                  <div className="p-5 bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-3xl text-red-100 font-semibold flex items-center gap-3 animate-pulse">
                    <span className="text-2xl shrink-0">⚠️</span>
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading || otpTimer === 0}
                  className="premium-ripple w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-7 px-12 rounded-3xl shadow-premium-lg text-xl flex items-center justify-center gap-3 premium-shimmer hover:shadow-premium-glow transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-8 h-8 border-3 border-white/70 border-t-yellow-400 rounded-full animate-spin shadow-xl" />
                      Verifying Pro Access...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🔑</span>
                      Unlock Premium Dashboard
                    </>
                  )}
                </button>

                {otpTimer === 0 && (
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={requestNewOtp}
                      className="text-yellow-400 hover:text-yellow-300 font-bold text-lg transition-all duration-300 hover:scale-105 bg-gray-900/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-yellow-400/30 hover:border-yellow-400 shadow-lg hover:shadow-premium-glow premium-shimmer"
                    >
                      🔄 Resend Pro OTP
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Toggle Auth Mode */}
            <div className="mt-12 pt-10 border-t border-white/20 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-yellow-300 hover:text-yellow-200 font-black text-xl px-8 py-4 rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-premium-glow premium-shimmer w-full"
                disabled={loading}
              >
                {isLogin ? '➕ Create New Pro Account' : '← Already Pro? Sign In'}
              </button>
            </div>

            {/* Pro Status Bar */}
            <div className="mt-8 p-5 glass-premium rounded-2xl border-premium text-center shadow-premium">
              <div className="flex items-center justify-center gap-2">
                <span className="text-yellow-400 text-lg font-black tracking-wider">⭐ PRO</span>
                <span className="text-gray-400 text-sm font-mono">Demo Mode • Instant Access Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
