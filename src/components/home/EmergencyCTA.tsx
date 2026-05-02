import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'

export function EmergencyCTA() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Pet emergency?</h2>
            <p className="mt-1 text-gray-600">
              Find 24/7 emergency vets open right now in your area.
            </p>
          </div>
          <Link
            to="/search?category=emergency_vets"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Find Emergency Vet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
