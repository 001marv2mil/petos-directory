import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'

export function EmergencyCTA() {
  return (
    <section className="pb-16 pt-4 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="flex-1 text-sm font-medium text-gray-800">
            <span className="font-bold">Pet emergency?</span> Find 24/7 emergency vets open right now near you.
          </p>
          <Link
            to="/search?category=emergency_vets"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Find Emergency Vet
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
