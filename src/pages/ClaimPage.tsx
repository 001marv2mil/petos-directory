import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Shield, CheckCircle, Building2, Mail, Phone, User, ChevronDown } from 'lucide-react'

export default function ClaimPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const businessName = searchParams.get('name') ?? 'this business'

  const [form, setForm] = useState({
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    role: 'owner',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/claim-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone || null,
          role: form.role,
          message: form.message || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim submitted</h1>
        <p className="text-gray-500 mb-2">
          We'll review your request and reach out to <strong>{form.owner_email}</strong> within 1–2 business days.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Once approved, your listing will show a verified badge and you'll be able to update your hours, photos, and description.
        </p>
        <Link
          to={`/provider/${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Back to listing
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-3">
          <Shield className="w-4 h-4" />
          Free — no credit card required
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Claim your listing
        </h1>
        <p className="text-gray-500">
          You're claiming <span className="font-semibold text-gray-800">{businessName}</span>.
          Once verified, you can update your hours, add photos, and manage your profile.
        </p>
      </div>

      {/* What you get */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 space-y-2">
        {[
          'Verified badge on your listing',
          'Update hours, photos, and description',
          'See how many pet owners viewed your profile',
          'Appear higher in search results',
        ].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Your name
          </label>
          <input
            type="text"
            required
            value={form.owner_name}
            onChange={e => setForm(f => ({ ...f, owner_name: e.target.value }))}
            placeholder="Jane Smith"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Business email
          </label>
          <input
            type="email"
            required
            value={form.owner_email}
            onChange={e => setForm(f => ({ ...f, owner_email: e.target.value }))}
            placeholder="jane@yourvet.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.owner_phone}
            onChange={e => setForm(f => ({ ...f, owner_phone: e.target.value }))}
            placeholder="(555) 000-0000"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Your role
          </label>
          <div className="relative">
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee / Staff</option>
              <option value="agency">Marketing Agency</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Anything to add? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={3}
            placeholder="e.g. We moved locations, our hours changed, or we'd like to add photos."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit claim request'}
        </button>

        <p className="text-center text-xs text-gray-400">
          We'll verify ownership and respond within 1–2 business days.{' '}
          <Link to={`/provider/${slug}`} className="underline hover:text-gray-600">Cancel</Link>
        </p>
      </form>
    </div>
  )
}
