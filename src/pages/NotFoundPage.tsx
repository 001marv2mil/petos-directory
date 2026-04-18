import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <PawPrint className="w-10 h-10 text-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        We couldn't find the page you're looking for. It may have moved or the URL might be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/search"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Search Providers
        </Link>
      </div>
    </div>
  )
}
