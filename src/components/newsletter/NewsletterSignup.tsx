import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

interface NewsletterSignupProps {
  city?: string
  state?: string
  category?: string
  referrerSlug?: string
  source?: string
}

export function NewsletterSignup({ city, state, category, referrerSlug, source = 'provider_page' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const locationLabel = city && state ? `${city}, ${state}` : city || 'your area'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'submitting') return
    setStatus('submitting')

    try {
      const res = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city, state, category, referrer_slug: referrerSlug, source }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border-t border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-50 border border-green-200">
          <Check className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-medium">You're in — we'll send you new listings and deals in {locationLabel}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-100 px-5 py-4">
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-2 mb-2">
          <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-900">
              Get new pet services in {locationLabel}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              New listings, deals, and pet care tips — free. No spam.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 min-w-0 text-xs px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="shrink-0 px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {status === 'submitting' ? '...' : 'Join'}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-red-600 mt-1.5">Something went wrong. Try again?</p>
        )}
      </div>
    </div>
  )
}
