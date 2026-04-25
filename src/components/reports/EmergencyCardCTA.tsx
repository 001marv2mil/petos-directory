import { useState } from 'react'
import { AlertCircle, Check, Mail } from 'lucide-react'

const STATES: Array<[string, string]> = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
  ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
  ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
  ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
  ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

export function EmergencyCardCTA() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !state) {
      setError('Email and state are required.')
      return
    }
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/emergency-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, state, city: city || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Error ${res.status}`)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch (err: any) {
      setError(err.message || 'Network error')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="my-14 p-6 sm:p-8 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Card sent! Check your inbox.</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your free pet emergency card is on its way to <strong>{email}</strong>. Print it, fold it, keep it in your wallet or on the fridge.
        </p>
      </section>
    )
  }

  return (
    <section id="emergency-card" className="my-14 p-6 sm:p-8 bg-red-50 border-2 border-red-200 rounded-2xl scroll-mt-24">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            🚨 Get a free pet emergency card for your area
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            We'll email you a printable card with the <strong>top emergency vets in your state</strong>, the ASPCA Poison Control number, and a what-to-do checklist. Save it. Print it. Put it on your fridge. Hope you never need it.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="sm:col-span-1 px-4 py-3 border border-red-200 rounded-lg bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm"
        />
        <select
          required
          value={state}
          onChange={e => setState(e.target.value)}
          className="sm:col-span-1 px-4 py-3 border border-red-200 rounded-lg bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm"
        >
          <option value="">Select your state</option>
          {STATES.map(([abbr, name]) => (
            <option key={abbr} value={abbr}>{name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="City (optional)"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="sm:col-span-1 px-4 py-3 border border-red-200 rounded-lg bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="sm:col-span-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          <Mail className="w-4 h-4" />
          {status === 'sending' ? 'Sending…' : 'Email me the card'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-700">⚠️ {error}</p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Free. One email. Unsubscribe anytime. We never share your email.
      </p>
    </section>
  )
}
