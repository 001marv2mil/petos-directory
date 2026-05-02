import { ShieldCheck, MapPin, Clock } from 'lucide-react'

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: 'Verified listings only',
    description: 'Every provider has a real address, phone number, and hours. No ghost listings.',
  },
  {
    icon: MapPin,
    title: 'Truly local results',
    description: 'Search by city and get results within driving distance. No national chains ranked over local favorites.',
  },
  {
    icon: Clock,
    title: 'Up-to-date information',
    description: 'Hours, contact info, and availability are checked regularly. If something changes, we update it.',
  },
]

export function TrustSection() {
  return (
    <section className="py-20 sm:py-24 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Why pet owners trust this directory
          </h2>
          <p className="mt-3 text-gray-400 text-lg max-w-xl mx-auto">
            Built for the moment you need to find care fast and trust the result.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_POINTS.map(point => (
            <div key={point.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                <point.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-gray-400 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
