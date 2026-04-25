import { Link } from 'react-router-dom'
import { AlertTriangle, MapPin, Stethoscope, TrendingDown, Share2 } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { emergencyVetReport as R } from '@/data/emergency-vet-report'
import { EmergencyCardCTA } from '@/components/reports/EmergencyCardCTA'

const STATE_NAMES: Record<string, string> = {
  FL: 'Florida', GA: 'Georgia', OH: 'Ohio', MN: 'Minnesota', KS: 'Kansas',
  NY: 'New York', TX: 'Texas', AZ: 'Arizona', DC: 'District of Columbia',
  CA: 'California', IL: 'Illinois', MI: 'Michigan', NE: 'Nebraska', AK: 'Alaska',
  NC: 'North Carolina', OK: 'Oklahoma',
}

function stateSlug(state: string) {
  return state.toLowerCase()
}
function citySlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
}

export default function EmergencyVetReportPage() {
  const t = R.totals

  const reportJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: 'Emergency Vet Access in America: 2026 Report',
    description: `Analysis of ${t.totalEmergencyVets.toLocaleString()} emergency vet clinics across ${t.totalCitiesAnalyzed} major US cities, identifying ${t.citiesWithOnlyOne} cities where pet owners have only one emergency vet option.`,
    datePublished: R.generatedAt,
    author: { '@type': 'Organization', name: 'PetOS Directory' },
    publisher: { '@type': 'Organization', name: 'PetOS Directory', url: 'https://petosdirectory.com' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageMeta
        title="Emergency Vet Access in America — 2026 Report"
        description={`${t.citiesWithOnlyOne} major US cities have only ONE emergency vet. New analysis of ${t.totalEmergencyVets.toLocaleString()} clinics across ${t.totalCitiesAnalyzed} metros reveals America's emergency pet care gaps.`}
        path="/reports/emergency-vet-access-2026"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportJsonLd) }}
      />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-red-600 uppercase tracking-widest">PetOS Research Report · {R.generatedAt}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {t.citiesWithOnlyOne} major US cities have only <span className="text-red-600">one</span> emergency vet
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A PetOS Directory analysis of {t.totalEmergencyVets.toLocaleString()} emergency
          veterinary clinics across {t.totalCitiesAnalyzed} major US metros reveals
          significant gaps in after-hours pet care. In {t.citiesWithTwoOrFewer} cities
          ({t.pctCitiesUnderThree}% of those analyzed), pet owners have two or fewer
          emergency vet options if their pet has a medical crisis.
        </p>
      </div>

      {/* Lead magnet CTA — emergency card */}
      <EmergencyCardCTA />

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <Stat label="Cities analyzed" value={t.totalCitiesAnalyzed.toLocaleString()} />
        <Stat label="Emergency vets" value={t.totalEmergencyVets.toLocaleString()} />
        <Stat label="Cities w/ 1 option" value={String(t.citiesWithOnlyOne)} accent />
        <Stat label="Cities w/ ≤2 options" value={String(t.citiesWithTwoOrFewer)} accent />
      </div>

      {/* Desert cities */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <h2 className="text-xs font-semibold text-red-600 uppercase tracking-widest">Emergency Vet Deserts</h2>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Cities with only one emergency vet</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Pet owners in these cities have no backup option if their local emergency vet is closed,
          at capacity, or unequipped for a specific type of care. In a true crisis, they may face
          drives of 30–90 minutes to the next nearest option.
        </p>
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {R.deserts.map(c => (
            <Link
              key={`${c.city}-${c.state}`}
              to={`/${stateSlug(c.state)}/${citySlug(c.city)}/emergency_vets`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{c.city}, {c.state}</div>
                  <div className="text-sm text-gray-500 truncate">{STATE_NAMES[c.state] || c.state}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600 shrink-0">1 clinic</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Scarce */}
      <section className="mb-14">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Cities with only two emergency vets</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Slightly better coverage, but still limited — a single closure or capacity issue creates a crisis.
        </p>
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {R.scarce.map(c => (
            <Link
              key={`${c.city}-${c.state}`}
              to={`/${stateSlug(c.state)}/${citySlug(c.city)}/emergency_vets`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{c.city}, {c.state}</div>
                  <div className="text-sm text-gray-500 truncate">{STATE_NAMES[c.state] || c.state}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-orange-600 shrink-0">2 clinics</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best covered */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Best Coverage</h2>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Cities with the most emergency vet options</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          The other end of the spectrum — metros where pet owners have robust access to after-hours care.
        </p>
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {R.bestCovered.map(c => (
            <Link
              key={`${c.city}-${c.state}`}
              to={`/${stateSlug(c.state)}/${citySlug(c.city)}/emergency_vets`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{c.city}, {c.state}</div>
                  <div className="text-sm text-gray-500 truncate">{STATE_NAMES[c.state] || c.state}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-emerald-600 shrink-0">{c.emergencyVetCount} clinics</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-14 p-6 sm:p-8 bg-gray-50 border border-gray-200 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Methodology</h3>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            This analysis examined {t.totalEmergencyVets.toLocaleString()} emergency
            veterinary clinics across {t.totalCitiesAnalyzed} major US metropolitan
            areas, catalogued in the PetOS Directory as of {R.generatedAt}. Emergency
            vets were identified by category assignment from source listings (Google
            Places business data) and verified for "emergency" or "24-hour" classification.
          </p>
          <p>
            "Cities" refers to principal city jurisdictions within metros — for
            multi-jurisdictional metros (e.g. Minneapolis–St. Paul), each principal
            city is counted separately. This means some clinics physically accessible
            to residents of a "desert" city may be listed under a neighboring
            jurisdiction; the count reflects clinics inside the city limits only.
          </p>
          <p>
            Data sources: Google Places business listings, aggregated and verified by
            PetOS Directory. The full dataset is publicly viewable on individual
            city and provider pages at petosdirectory.com.
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
          Journalists and researchers: this report is free to cite with attribution to
          PetOS Directory. For data requests, contact <a href="mailto:petosdirectory@gmail.com" className="text-blue-700 underline">petosdirectory@gmail.com</a>.
        </p>
        <p className="text-xs text-gray-500">
          Suggested citation: PetOS Directory (2026). <em>Emergency Vet Access in America: 2026 Report.</em> https://petosdirectory.com/reports/emergency-vet-access-2026
        </p>
      </section>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${accent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className={`text-2xl font-bold ${accent ? 'text-red-700' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
