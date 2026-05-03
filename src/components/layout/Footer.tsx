import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white tracking-tight">PetOS</span>
              <span className="text-xs font-medium text-gray-500">Directory</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/search" className="text-sm text-gray-400 hover:text-white transition-colors">Find Care</Link>
            <Link to="/search?category=emergency_vets" className="text-sm text-gray-400 hover:text-white transition-colors">Emergency Vets</Link>
            <Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
          </nav>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PetOS Directory. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
