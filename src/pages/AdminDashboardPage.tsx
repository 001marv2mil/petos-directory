import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { PageMeta } from '@/components/common/PageMeta'
import { LayoutDashboard, Users, Mail, DollarSign, Eye, FileCheck, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react'

const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'malak@petosdirectory.com']

interface Stats {
  generatedAt: string
  catalog: { totalProviders: number; featuredActive: number; featuredTotal: number }
  claims: { total: number; pending: number; approved: number; rejected: number }
  outreach: {
    total: number; last24h: number; last7d: number; last30d: number
    byEmailNum: Record<string, number>
    dollarPitchTotal: number
  }
  traffic: { total: number; last24h: number; last7d: number; last30d: number }
  revenue: { activeSubs: number; lifetimeSubs: number; mrr: number }
  newsletter: { signups: number }
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setError(`Error ${res.status}`)
        return
      }
      setStats(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    load()
    const id = setInterval(load, 60_000) // refresh every 60s
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  if (authLoading) return null
  if (!user) return <Navigate to="/" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageMeta title="Admin — Dashboard" description="PetOS Directory admin dashboard" path="/admin/dashboard" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              {stats ? `Last updated ${new Date(stats.generatedAt).toLocaleTimeString()}` : 'Loading…'}
              {' · refreshes every 60s'}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 rounded-lg text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Revenue row — top priority */}
          <Section icon={<DollarSign className="w-4 h-4" />} title="Revenue" accent="emerald">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="MRR" value={`$${stats.revenue.mrr.toLocaleString()}`} big accent={stats.revenue.mrr > 0 ? 'emerald' : 'neutral'} />
              <Stat label="Active subs" value={stats.revenue.activeSubs.toString()} />
              <Stat label="Lifetime subs" value={stats.revenue.lifetimeSubs.toString()} />
              <Stat label="$99/mo emails sent" value={stats.outreach.dollarPitchTotal.toLocaleString()} />
            </div>
          </Section>

          {/* Claims row */}
          <Section icon={<FileCheck className="w-4 h-4" />} title="Claims" accent="amber" action={
            stats.claims.pending > 0 ? (
              <Link to="/admin/claims" className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                Review {stats.claims.pending} pending <ExternalLink className="w-3 h-3" />
              </Link>
            ) : null
          }>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Pending" value={stats.claims.pending.toString()} accent={stats.claims.pending > 0 ? 'amber' : 'neutral'} />
              <Stat label="Approved" value={stats.claims.approved.toString()} />
              <Stat label="Rejected" value={stats.claims.rejected.toString()} />
              <Stat label="Total" value={stats.claims.total.toString()} />
            </div>
          </Section>

          {/* Outreach */}
          <Section icon={<Mail className="w-4 h-4" />} title="Email outreach">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Stat label="Last 24h" value={stats.outreach.last24h.toLocaleString()} />
              <Stat label="Last 7 days" value={stats.outreach.last7d.toLocaleString()} />
              <Stat label="Last 30 days" value={stats.outreach.last30d.toLocaleString()} />
              <Stat label="All time" value={stats.outreach.total.toLocaleString()} />
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">Email</th>
                    <th className="text-left px-4 py-2 font-semibold">Purpose</th>
                    <th className="text-right px-4 py-2 font-semibold">Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {EMAIL_META.map(e => (
                    <tr key={e.num}>
                      <td className="px-4 py-2 font-medium text-gray-900">#{e.num}</td>
                      <td className="px-4 py-2 text-gray-600">{e.purpose}</td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">{(stats.outreach.byEmailNum[e.num] ?? 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Catalog + traffic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section icon={<Users className="w-4 h-4" />} title="Catalog">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Total listings" value={stats.catalog.totalProviders.toLocaleString()} />
                <Stat label="Featured active" value={stats.catalog.featuredActive.toString()} />
              </div>
            </Section>

            <Section icon={<Eye className="w-4 h-4" />} title="Provider page traffic">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="24h" value={stats.traffic.last24h.toLocaleString()} />
                <Stat label="7d" value={stats.traffic.last7d.toLocaleString()} />
                <Stat label="30d" value={stats.traffic.last30d.toLocaleString()} />
                <Stat label="All time" value={stats.traffic.total.toLocaleString()} />
              </div>
            </Section>
          </div>

          <Section icon={<TrendingUp className="w-4 h-4" />} title="Newsletter">
            <Stat label="Signups" value={stats.newsletter.signups.toString()} />
          </Section>
        </>
      )}
    </div>
  )
}

const EMAIL_META = [
  { num: 1, purpose: 'Claim invitation (unclaimed)' },
  { num: 2, purpose: 'Claim reminder' },
  { num: 3, purpose: 'Claim last call + $99 upsell' },
  { num: 4, purpose: '$99/mo pitch (day of approval)' },
  { num: 5, purpose: 'Day-30 post-approval nudge' },
  { num: 6, purpose: 'Day-60 last $99 reminder' },
]

function Section({
  icon, title, accent, action, children,
}: {
  icon: React.ReactNode
  title: string
  accent?: 'amber' | 'emerald' | 'neutral'
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const accentClass =
    accent === 'amber' ? 'bg-amber-100 text-amber-700'
    : accent === 'emerald' ? 'bg-emerald-100 text-emerald-700'
    : 'bg-gray-100 text-gray-600'
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${accentClass}`}>{icon}</div>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Stat({ label, value, big, accent = 'neutral' }: { label: string; value: string; big?: boolean; accent?: 'amber' | 'emerald' | 'neutral' }) {
  const valueColor =
    accent === 'emerald' ? 'text-emerald-700'
    : accent === 'amber' ? 'text-amber-700'
    : 'text-gray-900'
  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-white">
      <div className={`font-bold ${big ? 'text-3xl' : 'text-2xl'} ${valueColor}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
