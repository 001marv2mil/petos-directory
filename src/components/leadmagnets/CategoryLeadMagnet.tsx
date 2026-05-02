import { useState } from 'react'
import { Check, Mail, Sparkles, FileText } from 'lucide-react'
import { getMagnetForCategory } from '@/data/lead-magnets'

interface Props {
  /** Provider category slug (e.g. 'veterinarians', 'emergency_vets') */
  category: string
  /** Slug of the provider page this magnet appeared on, for attribution */
  providerSlug: string
  providerName: string
  city: string
  state: string
}

/**
 * Category-aware lead magnet card shown near the top of every
 * provider page. Picks the right magnet (prep sheet, emergency
 * card, grooming calendar, etc.) based on the provider's category.
 *
 * Captures email → POST /api/lead-magnet → sends the matched
 * content email and saves to newsletter_signups.
 */
export function CategoryLeadMagnet({ category, providerSlug, providerName, city, state }: Props) {
  const magnet = getMagnetForCategory(category)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          category,
          providerSlug,
          providerName,
          city,
          state,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Error ${res.status}`)
        return
      }
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Sent! Check your inbox.</h3>
            <p className="text-sm text-gray-600">
              Your <strong>{magnet.title.replace('Free ', '')}</strong> is on the way to <strong>{email}</strong>. Should arrive in under a minute.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Free for pet owners</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{magnet.title}</h3>
          <p className="text-sm text-gray-600 mt-1 leading-snug">{magnet.subtitle}</p>
        </div>
      </div>

      <ul className="space-y-1.5 mb-4 ml-1">
        {magnet.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={submitting}
          className="flex-1 px-4 py-2.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !email}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          {submitting ? 'Sending…' : <><Mail className="w-4 h-4" /> {magnet.ctaCopy}</>}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-700">⚠️ {error}</p>}
      <p className="mt-2 text-[11px] text-gray-500">No spam. Unsubscribe anytime.</p>
    </div>
  )
}
