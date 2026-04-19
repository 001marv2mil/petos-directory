import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { PageMeta } from '@/components/common/PageMeta'
import { Check, X, Shield, Mail, Phone, Calendar, ChevronDown } from 'lucide-react'

// Admin emails — only these can access this page
const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'malak@petosdirectory.com']

interface ClaimWithProvider {
  id: string
  provider_id: string
  business_name: string
  owner_name: string
  owner_email: string
  owner_phone: string | null
  role: string
  message: string | null
  status: string
  created_at: string
  approved_at: string | null
  provider_slug: string | null
  provider_city: string | null
  provider_state: string | null
  provider_category: string | null
  provider_address: string | null
  provider_phone: string | null
  provider_website: string | null
  provider_description: string | null
}

const CATEGORY_OPTIONS = [
  { value: 'veterinarians', label: 'Veterinarians' },
  { value: 'emergency_vets', label: 'Emergency Vets' },
  { value: 'groomers', label: 'Groomers' },
  { value: 'boarding', label: 'Boarding' },
  { value: 'daycare', label: 'Daycare' },
  { value: 'trainers', label: 'Trainers' },
  { value: 'pet_pharmacies', label: 'Pet Pharmacies' },
]

interface ProviderEdits {
  description: string
  address: string
  category: string
  phone: string
  website: string
}

export default function AdminClaimsPage() {
  const { user, loading: authLoading } = useAuth()
  const [claims, setClaims] = useState<ClaimWithProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, ProviderEdits>>({})

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')

  useEffect(() => {
    if (!isAdmin) return
    loadClaims()
  }, [isAdmin, filter])

  async function loadClaims() {
    setLoading(true)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`/api/admin/list-claims?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        setClaims([])
        return
      }
      const json = await res.json()
      const mapped: ClaimWithProvider[] = (json.claims || []).map((c: any) => ({
        ...c,
        provider_slug: c.providers?.slug ?? null,
        provider_city: c.providers?.city ?? null,
        provider_state: c.providers?.state ?? null,
        provider_category: c.providers?.category ?? null,
        provider_address: c.providers?.address ?? null,
        provider_phone: c.providers?.phone ?? null,
        provider_website: c.providers?.website ?? null,
        provider_description: c.providers?.description ?? null,
      }))
      setClaims(mapped)
      // Seed edit state with current values so admin can see + change
      const seed: Record<string, ProviderEdits> = {}
      for (const c of mapped) {
        seed[c.id] = {
          description: c.provider_description ?? '',
          address: c.provider_address ?? '',
          category: c.provider_category ?? '',
          phone: c.provider_phone ?? '',
          website: c.provider_website ?? '',
        }
      }
      setEdits(seed)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(claim: ClaimWithProvider) {
    if (!user || processing) return
    setProcessing(claim.id)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      // Only send fields that changed from the current DB values — avoids
      // unnecessary writes and makes the payload explicit
      const current = {
        description: claim.provider_description ?? '',
        address: claim.provider_address ?? '',
        category: claim.provider_category ?? '',
        phone: claim.provider_phone ?? '',
        website: claim.provider_website ?? '',
      }
      const edited = edits[claim.id] ?? current
      const provider_updates: Partial<ProviderEdits> = {}
      for (const k of Object.keys(current) as (keyof ProviderEdits)[]) {
        if (edited[k] !== current[k]) provider_updates[k] = edited[k]
      }
      const res = await fetch('/api/admin/approve-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          claim_id: claim.id,
          ...(Object.keys(provider_updates).length > 0 ? { provider_updates } : {}),
        }),
      })
      if (res.ok) await loadClaims()
    } finally {
      setProcessing(null)
    }
  }

  function updateEdit(claimId: string, field: keyof ProviderEdits, value: string) {
    setEdits(prev => ({
      ...prev,
      [claimId]: { ...(prev[claimId] ?? { description: '', address: '', category: '', phone: '', website: '' }), [field]: value },
    }))
  }

  async function handleReject(claim: ClaimWithProvider) {
    if (!user || processing) return
    if (!confirm(`Reject claim for "${claim.business_name}"?`)) return
    setProcessing(claim.id)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/admin/reject-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ claim_id: claim.id }),
      })
      if (res.ok) await loadClaims()
    } finally {
      setProcessing(null)
    }
  }

  if (authLoading) return null
  if (!user) return <Navigate to="/" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageMeta title="Admin — Claims" description="Review pending business claims" path="/admin/claims" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Business Claims</h1>
            <p className="text-sm text-gray-500">Review and approve business ownership requests</p>
          </div>
        </div>
        <Link to="/admin/dashboard" className="text-sm text-blue-700 hover:text-blue-900 font-medium">
          ← Dashboard
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === f
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : claims.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No {filter === 'all' ? '' : filter} claims.</div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{claim.business_name}</h3>
                  <p className="text-sm text-gray-500">
                    {claim.provider_city}, {claim.provider_state} · {claim.provider_category}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${
                    claim.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : claim.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${claim.owner_email}`} className="hover:text-blue-600">
                    {claim.owner_email}
                  </a>
                </div>
                {claim.owner_phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {claim.owner_phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(claim.created_at).toLocaleString()}
                </div>
                <div className="text-gray-600">
                  <strong>{claim.owner_name}</strong> <span className="text-gray-400">({claim.role})</span>
                </div>
              </div>

              {claim.message && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic">
                  "{claim.message}"
                </div>
              )}

              {claim.provider_slug && (
                <a
                  href={`/provider/${claim.provider_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
                >
                  View public listing →
                </a>
              )}

              {claim.status === 'pending' && (
                <>
                  {/* Expandable edit-before-approve panel */}
                  <button
                    type="button"
                    onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}
                    className="w-full flex items-center justify-between gap-2 py-2 px-3 mb-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium text-blue-900 transition-colors"
                  >
                    <span>Edit listing fields before approving</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedClaim === claim.id ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedClaim === claim.id && (
                    <div className="mb-4 p-4 bg-blue-50/40 border border-blue-100 rounded-lg space-y-3">
                      <p className="text-xs text-blue-900 mb-2">
                        Edit the fields below, then click Approve. Only changed fields will be saved.
                      </p>

                      <EditField
                        label="Description"
                        type="textarea"
                        value={edits[claim.id]?.description ?? ''}
                        onChange={v => updateEdit(claim.id, 'description', v)}
                      />
                      <EditField
                        label="Address"
                        type="text"
                        value={edits[claim.id]?.address ?? ''}
                        onChange={v => updateEdit(claim.id, 'address', v)}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <EditField
                          label="Category"
                          type="select"
                          options={CATEGORY_OPTIONS}
                          value={edits[claim.id]?.category ?? ''}
                          onChange={v => updateEdit(claim.id, 'category', v)}
                        />
                        <EditField
                          label="Phone"
                          type="text"
                          value={edits[claim.id]?.phone ?? ''}
                          onChange={v => updateEdit(claim.id, 'phone', v)}
                        />
                      </div>
                      <EditField
                        label="Website"
                        type="text"
                        value={edits[claim.id]?.website ?? ''}
                        onChange={v => updateEdit(claim.id, 'website', v)}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(claim)}
                      disabled={processing === claim.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      {processing === claim.id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(claim)}
                      disabled={processing === claim.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface EditFieldProps {
  label: string
  type: 'text' | 'textarea' | 'select'
  value: string
  onChange: (v: string) => void
  options?: { value: string; label: string }[]
}

function EditField({ label, type, value, onChange, options }: EditFieldProps) {
  const common = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-700 mb-1 block">{label}</span>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className={common}
        />
      ) : type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={common}>
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={common}
        />
      )}
    </label>
  )
}

