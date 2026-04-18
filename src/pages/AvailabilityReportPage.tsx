import { TrendingUp, TrendingDown, MapPin, BarChart3, Share2 } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { availabilityReport as R } from '@/data/pet-service-availability'

export default function AvailabilityReportPage() {
  const t = R.totals

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: 'Pet Service Availability Index: 2026 State-by-State Report',
    description: `Analysis of ${t.totalProviders.toLocaleString()} pet service providers across ${t.statesAnalyzed} US states reveals wide disparity in access to veterinary and pet care — from 20+ providers per 100k residents in some states to under 1.5 in others.`,
    datePublished: R.generatedAt,
    author: { '@type': 'Organization', name: 'PetOS Directory' },
    publisher: { '@type': 'Organization', name: 'PetOS Directory', url: 'https://petosdirectory.com' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageMeta
        title="Pet Service Availability Index — State-by-State Report 2026"
        description={`Which US states have the most — and fewest — pet services per capita? Analysis of ${t.totalProviders.toLocaleString()} providers across ${t.statesAnalyzed} states. National average: ${t.nationalAvgPer100k} per 100k residents.`}
        path="/reports/pet-service-availability-2026"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">PetOS Research Report · {R.generatedAt}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Where America's pet owners have the <span className="text-blue-700">most</span> — and <span className="text-red-600">fewest</span> — services
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A PetOS Directory analysis of {t.totalProviders.toLocaleString()} pet service
          providers across {t.statesAnalyzed} US states reveals wide disparity in access
          to veterinary and pet care. Nationally, there are about <strong>{t.nationalAvgPer100k} pet
          service providers per 100,000 residents</strong> — but the gap between best- and
          worst-covered states is more than 14×.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
        <Stat label="Providers analyzed" value={t.totalProviders.toLocaleString()} />
        <Stat label="States analyzed" value={String(t.statesAnalyzed)} />
        <Stat label="National avg / 100k" value={t.nationalAvgPer100k.toFixed(2)} />
      </div>

      {/* Most saturated */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Best Covered</h2>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Top 10 states by pet service access</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Pet owners in these states have the most options per resident. Urban density and high pet-ownership rates drive the top of this list.
        </p>
        <RankingTable rows={R.mostSaturated} accent="emerald" />
      </section>

      {/* Least covered */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <h2 className="text-xs font-semibold text-red-600 uppercase tracking-widest">Least Covered</h2>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Bottom 10 states by pet service access</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Pet owners in these states have the fewest local options per resident — meaning longer drives, fewer specialty clinics, and limited competition on price.
        </p>
        <RankingTable rows={R.leastCovered} accent="red" />
      </section>

      {/* Full table */}
      <section className="mb-14">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Full state rankings</h3>
        <p className="text-gray-500 text-sm mb-6">All {t.statesAnalyzed} states ranked by pet services per 100,000 residents.</p>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Rank</th>
                <th className="text-left px-4 py-3 font-semibold">State</th>
                <th className="text-right px-4 py-3 font-semibold">Providers</th>
                <th className="text-right px-4 py-3 font-semibold">Pop.</th>
                <th className="text-right px-4 py-3 font-semibold">Per 100k</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {R.allStates.map((s, i) => (
                <tr key={s.state} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.stateName}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{s.totalProviders.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{(s.population / 1_000_000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{s.per100k.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-14 p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Methodology</h3>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            Pet service providers per 100,000 residents = total PetOS Directory
            provider count for a state ÷ state population × 100,000. Provider counts
            are from the PetOS Directory dataset ({t.totalProviders.toLocaleString()} total records) and include
            veterinarians, emergency vets, pet groomers, boarders, daycares, trainers,
            and pet pharmacies.
          </p>
          <p>
            State populations are 2024 US Census Bureau estimates. Five US states plus territories
            without population-matched PetOS data were excluded from the comparison.
          </p>
          <p>
            This ratio measures <em>directory availability</em>, not market health —
            it does not account for business hours, specialty access, or price
            comparison. Higher numbers indicate more listed options per resident;
            lower numbers flag areas where pet owners may have fewer choices.
          </p>
        </div>
      </section>

      {/* Share */}
      <section className="p-6 sm:p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
        <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Citing this report</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          Journalists and researchers: free to cite with attribution to PetOS Directory.
          Contact <a href="mailto:petosdirectory@gmail.com" className="text-blue-700 underline">petosdirectory@gmail.com</a> for raw data, state-specific breakdowns, or interview requests.
        </p>
        <p className="text-xs text-gray-500">
          Suggested citation: PetOS Directory (2026). <em>Pet Service Availability Index: 2026 State-by-State Report.</em> https://petosdirectory.com/reports/pet-service-availability-2026
        </p>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

function RankingTable({ rows, accent }: { rows: ReadonlyArray<{ state: string; stateName: string; totalProviders: number; per100k: number }>; accent: 'emerald' | 'red' }) {
  const accentClass = accent === 'emerald' ? 'text-emerald-600' : 'text-red-600'
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
      {rows.map((s, i) => (
        <div key={s.state} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-sm text-gray-400 w-6 text-right">{i + 1}.</div>
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{s.stateName}</div>
              <div className="text-sm text-gray-500">{s.totalProviders.toLocaleString()} providers</div>
            </div>
          </div>
          <div className={`text-sm font-semibold shrink-0 ${accentClass}`}>{s.per100k.toFixed(2)} / 100k</div>
        </div>
      ))}
    </div>
  )
}
