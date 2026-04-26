import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, AlertCircle, Navigation } from 'lucide-react'
import { CITIES, CATEGORIES } from '@/lib/constants'
import { haversineDistance } from '@/lib/utils'
import { CITY_COORDS } from '@/lib/cityCoords'
import type { CategorySlug } from '@/types'

interface SearchBarProps {
  initialCity?: string
  initialCategory?: string
  initialQuery?: string
  variant?: 'hero' | 'inline'
}

function CityAutocomplete({
  displayValue,
  onSelect,
  placeholder,
  className,
}: {
  displayValue: string
  onSelect: (city: string, display: string) => void
  placeholder: string
  className?: string
}) {
  const [input, setInput] = useState(displayValue)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Sync when external displayValue changes (e.g. from Near Me)
  useEffect(() => { setInput(displayValue) }, [displayValue])

  const suggestions = input.trim().length >= 2
    ? CITIES.filter(c =>
        c.city.toLowerCase().startsWith(input.toLowerCase()) ||
        c.state.toLowerCase().startsWith(input.toLowerCase()) ||
        `${c.city}, ${c.stateAbbr}`.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={e => { setInput(e.target.value); setOpen(true); onSelect('', '') }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map(c => (
            <li
              key={c.citySlug + c.stateSlug}
              onMouseDown={() => {
                onSelect(c.city, `${c.city}, ${c.stateAbbr}`)
                setInput(`${c.city}, ${c.stateAbbr}`)
                setOpen(false)
              }}
              className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span><span className="font-medium">{c.city}</span>, {c.state}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SearchBar({
  initialCity = '',
  initialCategory = '',
  initialQuery = '',
  variant = 'hero',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [cityDisplay, setCityDisplay] = useState(initialCity)
  const [category, setCategory] = useState(initialCategory)
  const [urgent, setUrgent] = useState(false)
  const [locating, setLocating] = useState(false)
  const navigate = useNavigate()

  const handleNearMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let nearest = CITIES[0]
        let minDist = Infinity
        for (const c of CITIES) {
          const coords = CITY_COORDS[`${c.stateSlug}-${c.citySlug}`] ?? CITY_COORDS[c.citySlug]
          if (!coords) continue
          const d = haversineDistance(latitude, longitude, coords.lat, coords.lng)
          if (d < minDist) { minDist = d; nearest = c }
        }
        setCity(nearest.city)
        setCityDisplay(`${nearest.city}, ${nearest.stateAbbr}`)
        setLocating(false)
      },
      () => setLocating(false),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (urgent) {
      navigate('/search?category=emergency_vets')
      return
    }

    if (city && category && !query.trim()) {
      const cityMeta = CITIES.find(c => c.city === city)
      if (cityMeta) {
        navigate(`/${cityMeta.stateSlug}/${cityMeta.citySlug}/${category}`)
        return
      }
    }

    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (city) {
      const cityMeta = CITIES.find(c => c.city === city)
      if (cityMeta) {
        params.set('city', city)
        params.set('state', cityMeta.stateAbbr)
      }
    }
    if (category) params.set('category', category)
    navigate(`/search?${params.toString()}`)
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or service..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.slug} value={c.slug}>{c.pluralLabel}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-0">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <CityAutocomplete
            displayValue={cityDisplay}
            onSelect={(c, d) => { setCity(c); setCityDisplay(d) }}
            placeholder="e.g. Tampa, FL..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    )
  }

  // Hero variant
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <select
            value={category}
            onChange={e => { setCategory(e.target.value as CategorySlug | ''); setUrgent(false) }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700"
          >
            <option value="">Select Service</option>
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.pluralLabel}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 flex items-center gap-1.5">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <CityAutocomplete
              displayValue={cityDisplay}
              onSelect={(c, d) => { setCity(c); setCityDisplay(d) }}
              placeholder="e.g. Tampa, FL..."
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <button
            type="button"
            onClick={handleNearMe}
            title="Use my location"
            className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors shrink-0"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setUrgent(u => !u)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
            urgent
              ? 'bg-red-600 border-red-600 text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:block">Urgent Care</span>
        </button>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}
