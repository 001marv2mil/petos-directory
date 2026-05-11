import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { CITIES, CATEGORIES, getCityMeta } from '@/lib/constants'
import { PageMeta } from '@/components/common/PageMeta'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { assignProviderImages } from '@/lib/images'
import type { Provider, CategorySlug } from '@/types'
import { PawPrint, ChevronRight, ChevronLeft, Search, MapPin, Stethoscope, Scissors, Home, Sun, Award, AlertCircle, Pill } from 'lucide-react'

type Step = 'pet' | 'need' | 'city' | 'results'

const PET_TYPES = [
  { id: 'dog', label: 'Dog', emoji: '' },
  { id: 'cat', label: 'Cat', emoji: '' },
  { id: 'bird', label: 'Bird', emoji: '' },
  { id: 'reptile', label: 'Reptile', emoji: '' },
  { id: 'small', label: 'Small Animal', emoji: '' },
  { id: 'other', label: 'Other', emoji: '' },
]

const NEEDS = [
  { id: 'veterinarians' as CategorySlug, label: 'Routine vet care', desc: 'Checkups, vaccines, general health', icon: Stethoscope },
  { id: 'emergency_vets' as CategorySlug, label: 'Emergency care', desc: 'Urgent or after-hours treatment', icon: AlertCircle },
  { id: 'groomers' as CategorySlug, label: 'Grooming', desc: 'Baths, haircuts, nail trims', icon: Scissors },
  { id: 'boarding' as CategorySlug, label: 'Boarding', desc: 'Overnight or extended stays', icon: Home },
  { id: 'daycare' as CategorySlug, label: 'Daycare', desc: 'Daytime play and socialization', icon: Sun },
  { id: 'trainers' as CategorySlug, label: 'Training', desc: 'Obedience, behavior, puppy classes', icon: Award },
  { id: 'pet_pharmacies' as CategorySlug, label: 'Pharmacy', desc: 'Medications and supplements', icon: Pill },
]

// Group cities by state for the selector
const STATES_WITH_CITIES = (() => {
  const map = new Map<string, typeof CITIES[number][]>()
  for (const c of CITIES) {
    const arr = map.get(c.stateAbbr) || []
    arr.push(c)
    map.set(c.stateAbbr, arr)
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})()

export default function QuizPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('pet')
  const [petType, setPetType] = useState('')
  const [need, setNeed] = useState<CategorySlug | ''>('')
  const [selectedCity, setSelectedCity] = useState('')
  const [citySearch, setCitySearch] = useState('')

  const cityMeta = selectedCity ? CITIES.find(c => `${c.stateAbbr}-${c.citySlug}` === selectedCity) : null

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['quiz-results', cityMeta?.city, cityMeta?.stateAbbr, need],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .ilike('city', cityMeta!.city)
        .ilike('state', cityMeta!.stateAbbr)
        .eq('category', need)
        .order('rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false, nullsFirst: false })
        .limit(6)
      if (error) throw error
      return assignProviderImages((data ?? []) as Provider[])
    },
    enabled: step === 'results' && !!cityMeta && !!need,
    staleTime: 1000 * 60 * 10,
  })

  const filteredCities = citySearch
    ? CITIES.filter(c =>
        c.city.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.stateAbbr.toLowerCase().includes(citySearch.toLowerCase())
      ).slice(0, 12)
    : CITIES.slice(0, 12)

  const progress = step === 'pet' ? 25 : step === 'need' ? 50 : step === 'city' ? 75 : 100
  const catMeta = need ? CATEGORIES.find(c => c.slug === need) : null

  return (
    <div className="min-h-[80vh]">
      <PageMeta
        title="Find the Right Pet Care - Quick Quiz"
        description="Answer 3 quick questions and we'll match you with the best-rated pet care providers near you. Takes 30 seconds."
        path="/quiz"
      />

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Step 1: Pet type */}
        {step === 'pet' && (
          <div className="text-center">
            <PawPrint className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              What kind of pet do you have?
            </h1>
            <p className="text-gray-500 mb-8">This helps us find the right providers for you</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
              {PET_TYPES.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => { setPetType(pet.id); setStep('need') }}
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:border-green-400 hover:bg-green-50 ${
                    petType === pet.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <span className="block text-2xl mb-1">{pet.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{pet.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: What do you need? */}
        {step === 'need' && (
          <div>
            <button onClick={() => setStep('pet')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              What does your pet need?
            </h2>
            <p className="text-gray-500 mb-8 text-center">Pick the service you're looking for</p>

            <div className="space-y-3">
              {NEEDS.map(n => {
                const Icon = n.icon
                return (
                  <button
                    key={n.id}
                    onClick={() => { setNeed(n.id); setStep('city') }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:border-green-400 hover:bg-green-50 ${
                      need === n.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{n.label}</span>
                      <span className="block text-sm text-gray-500">{n.desc}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: City */}
        {step === 'city' && (
          <div>
            <button onClick={() => setStep('need')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Where are you located?
            </h2>
            <p className="text-gray-500 mb-6 text-center">We'll find top-rated {catMeta?.pluralLabel.toLowerCase()} near you</p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your city..."
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {filteredCities.map(c => (
                <button
                  key={`${c.stateAbbr}-${c.citySlug}`}
                  onClick={() => {
                    setSelectedCity(`${c.stateAbbr}-${c.citySlug}`)
                    setStep('results')
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-green-400 hover:bg-green-50 text-left transition-all"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{c.city}, {c.stateAbbr}</span>
                </button>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No cities match "{citySearch}". Try a different search.
              </p>
            )}
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && cityMeta && catMeta && (
          <div>
            <button onClick={() => setStep('city')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <PawPrint className="w-4 h-4" /> Your matches are ready
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Top {catMeta.pluralLabel} in {cityMeta.city}, {cityMeta.stateAbbr}
              </h2>
              <p className="text-gray-500">
                Based on ratings and reviews from pet owners like you
              </p>
            </div>

            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-32" />
                ))}
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-4">
                {results.map(p => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            )}

            {!isLoading && results.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-4">
                  We don't have {catMeta.pluralLabel.toLowerCase()} in {cityMeta.city} yet.
                </p>
                <Link to="/search" className="text-green-600 font-medium hover:underline">
                  Try searching a nearby city &rarr;
                </Link>
              </div>
            )}

            {/* Browse more */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}/best/${catMeta.slug}`}
                className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                See full rankings
              </Link>
              <Link
                to={`/${cityMeta.stateSlug}/${cityMeta.citySlug}`}
                className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
              >
                Browse all pet services in {cityMeta.city}
              </Link>
            </div>

            {/* Retake */}
            <button
              onClick={() => { setStep('pet'); setPetType(''); setNeed(''); setSelectedCity('') }}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
