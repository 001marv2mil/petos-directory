import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { PageMeta } from '@/components/common/PageMeta'
import { Briefcase, ExternalLink, Image as ImageIcon, Upload, Save, Check, Sparkles } from 'lucide-react'

interface Provider {
  id: string
  slug: string
  business_name: string
  city: string
  state: string
  category: string
  description: string | null
  phone: string | null
  website: string | null
  hero_image: string | null
  gallery_images: string[] | null
  special_offer: string | null
  hours: any
  rating: number | null
  review_count: number | null
  verified: boolean
}

export default function BusinessDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [specialOffer, setSpecialOffer] = useState('')
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    if (!user) return
    loadMyBusinesses()
  }, [user])

  async function loadMyBusinesses() {
    setLoading(true)
    const { data } = await supabase
      .from('providers')
      .select('*')
      .ilike('claimed_by_email', user!.email ?? '')
      .order('business_name')

    const list = (data || []) as Provider[]
    setProviders(list)
    if (list.length > 0 && !selectedId) {
      selectProvider(list[0])
    }
    setLoading(false)
  }

  function selectProvider(p: Provider) {
    setSelectedId(p.id)
    setDescription(p.description || '')
    setPhone(p.phone || '')
    setWebsite(p.website || '')
    setSpecialOffer(p.special_offer || '')
    setHeroImage(p.hero_image || '')
  }

  const selected = providers.find(p => p.id === selectedId)

  async function handleSave() {
    if (!selected || saving) return
    setSaving(true)
    setSaved(false)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/business/update-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          provider_id: selected.id,
          description,
          phone,
          website,
          special_offer: specialOffer,
          hero_image: heroImage,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        await loadMyBusinesses()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selected || !user) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${selected.id}/hero-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('provider-photos').upload(path, file, { upsert: true })
      if (error) {
        alert('Upload failed: ' + error.message)
        return
      }
      const { data } = supabase.storage.from('provider-photos').getPublicUrl(path)
      setHeroImage(data.publicUrl)
    } finally {
      setUploading(false)
    }
  }

  if (authLoading) return null
  if (!user) return <Navigate to="/" replace />

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-gray-400">Loading your businesses...</div>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <PageMeta title="Business Dashboard" description="Manage your business listings" path="/dashboard" />
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-7 h-7 text-blue-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No businesses linked to this account</h1>
        <p className="text-gray-600 mb-6">
          If you've claimed a business, we'll link it here once it's approved. If you haven't claimed yet,
          find your business and click "Claim Your Listing" on its page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold"
        >
          Browse Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageMeta title="Business Dashboard" description="Manage your business listings" path="/dashboard" />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Business Dashboard</h1>
        <p className="text-sm text-gray-500">Update your listing details, photos, and promotions.</p>
      </div>

      {/* Provider selector (if owner has multiple) */}
      {providers.length > 1 && (
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => selectProvider(p)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                selectedId === p.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.business_name}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          {/* Header info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{selected.business_name}</h2>
                <p className="text-sm text-gray-500">
                  {selected.city}, {selected.state}
                </p>
              </div>
              <Link
                to={`/provider/${selected.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                View public listing <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            {selected.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                Verified Owner
              </span>
            )}
          </div>

          {/* Hero image */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              Main Photo
            </label>
            {heroImage && (
              <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                <img src={heroImage} alt="Business" className="w-full h-48 object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">Or paste a URL below</p>
            <input
              type="url"
              value={heroImage}
              onChange={e => setHeroImage(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">About Your Business</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell pet owners what makes your business special..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Contact */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Contact Info</h3>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Website</label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Special offer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Special Offer (optional)
            </label>
            <p className="text-xs text-amber-800 mb-2">
              Attract new clients with a short promotion. Example: "20% off your first grooming"
            </p>
            <input
              type="text"
              value={specialOffer}
              onChange={e => setSpecialOffer(e.target.value)}
              maxLength={120}
              placeholder="e.g. First-time clients get $20 off"
              className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            />
            <p className="text-xs text-amber-700 mt-1">{specialOffer.length}/120</p>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-sm text-green-700 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Saved!
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
