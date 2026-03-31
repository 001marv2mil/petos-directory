import { Link } from 'react-router-dom'

export function EmergencyCTA() {
  return (
    <section className="bg-blue-900 text-white py-14 mx-4 sm:mx-8 lg:mx-16 mb-12 rounded-2xl">
      <div className="max-w-4xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Pet Emergency?</h2>
          <p className="text-blue-200 text-sm">
            Find open 24/7 emergency vets in your area right now.
          </p>
        </div>
        <Link
          to="/search?category=emergency_vets"
          className="shrink-0 inline-flex items-center px-7 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
        >
          Get Emergency Help
        </Link>
      </div>
    </section>
  )
}
