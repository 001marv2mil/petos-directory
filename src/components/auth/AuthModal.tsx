import { useState, useEffect, useRef } from 'react'
import { X, PawPrint, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const TRIGGER_COPY: Record<string, { headline: string; sub: string }> = {
  phone:     { headline: 'Unlock contact info', sub: 'Create a free account to view phone numbers, addresses, and call directly from any listing.' },
  favorite:  { headline: 'Save your favorite providers', sub: 'Sign up to heart providers and access your saved list anytime.' },
  alert:     { headline: 'Get alerts for new listings', sub: 'Sign up and we\'ll notify you when new providers are added in your city.' },
  browse:    { headline: "You've used your 3 free views", sub: "Sign up free to unlock unlimited provider profiles, contact info, phone numbers, and local alerts." },
  default:   { headline: 'Create your free account', sub: 'Access contact info, save favorites, and get updates on pet care in your area.' },
}

export function AuthModal() {
  const { modalOpen, closeModal, modalTrigger, signUp, signIn, signInWithGoogle, user } = useAuth()
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close when user signs in
  useEffect(() => { if (user && modalOpen) closeModal() }, [user, modalOpen, closeModal])

  // Reset state on open
  useEffect(() => {
    if (modalOpen) {
      setMode('signup')
      setEmail('')
      setPassword('')
      setError(null)
      setSuccess(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [modalOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeModal])

  if (!modalOpen) return null

  const copy = TRIGGER_COPY[modalTrigger] ?? TRIGGER_COPY.default

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fn = mode === 'signup' ? signUp : signIn
    const { error } = await fn(email, password)

    setLoading(false)
    if (error) {
      setError(error)
    } else if (mode === 'signup') {
      setSuccess(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) closeModal() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header bar */}
        <div className="bg-blue-700 px-6 pt-6 pb-8">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">PetOS Directory</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-snug">{copy.headline}</h2>
          <p className="text-blue-200 text-sm mt-1.5 leading-relaxed">{copy.sub}</p>
        </div>

        {/* Form */}
        <div className="px-6 pt-6 pb-6 -mt-4 bg-white rounded-t-2xl relative">
          {/* Google sign-in */}
          {!success && (
            <div className="mb-4 space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Check your email</h3>
              <p className="text-gray-500 text-sm">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
              <button onClick={closeModal} className="mt-5 w-full py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
                Got it
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email address</label>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'signup' ? 'Create free account' : 'Sign in'}
              </button>

              <p className="text-center text-xs text-gray-400">
                {mode === 'signup' ? (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('signin'); setError(null) }} className="text-blue-600 font-semibold hover:underline">Sign in</button>
                  </>
                ) : (
                  <>Don't have an account?{' '}
                    <button type="button" onClick={() => { setMode('signup'); setError(null) }} className="text-blue-600 font-semibold hover:underline">Sign up free</button>
                  </>
                )}
              </p>

              <p className="text-center text-[10px] text-gray-400 leading-relaxed">
                By signing up you agree to our{' '}
                <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>.
                We may send you updates about pet care and PetOS Health.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
