import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Copy, CheckCheck, Calculator } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'

type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish'
type DogSize = 'small' | 'medium' | 'large' | 'xl'
type ServiceKey = 'vet' | 'emergency' | 'grooming' | 'boarding' | 'training' | 'flea'

const PET_OPTIONS: { type: PetType; label: string; emoji: string }[] = [
  { type: 'dog', label: 'Dog', emoji: '🐕' },
  { type: 'cat', label: 'Cat', emoji: '🐱' },
  { type: 'bird', label: 'Bird', emoji: '🐦' },
  { type: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { type: 'fish', label: 'Fish', emoji: '🐟' },
]

const DOG_SIZES: { size: DogSize; label: string; weight: string }[] = [
  { size: 'small', label: 'Small', weight: 'Under 25 lbs' },
  { size: 'medium', label: 'Medium', weight: '25–60 lbs' },
  { size: 'large', label: 'Large', weight: '60–100 lbs' },
  { size: 'xl', label: 'XL', weight: '100 lbs+' },
]

const AVAILABLE_SERVICES: Record<PetType, ServiceKey[]> = {
  dog: ['vet', 'emergency', 'grooming', 'boarding', 'training', 'flea'],
  cat: ['vet', 'emergency', 'grooming', 'boarding', 'flea'],
  bird: ['vet', 'emergency', 'boarding'],
  rabbit: ['vet', 'emergency', 'grooming', 'boarding', 'flea'],
  fish: ['vet', 'emergency', 'boarding'],
}

const SERVICE_INFO: Record<ServiceKey, { label: string; description: string }> = {
  vet: { label: 'Annual Vet Visits', description: 'Routine checkups & vaccinations' },
  emergency: { label: 'Emergency Vet Fund', description: 'Recommended savings for unexpected emergencies' },
  grooming: { label: 'Grooming', description: 'Professional grooming services' },
  boarding: { label: 'Boarding', description: '~7 nights/year estimate' },
  training: { label: 'Training', description: 'Basic obedience (one-time cost)' },
  flea: { label: 'Flea/Tick/Heartworm Prevention', description: 'Monthly preventative medications' },
}

const CATEGORY_LINKS: Record<ServiceKey, string> = {
  vet: '/search?city=Tampa&category=veterinarians',
  emergency: '/search?city=Tampa&category=emergency_vets',
  grooming: '/search?city=Tampa&category=groomers',
  boarding: '/search?city=Tampa&category=boarding',
  training: '/search?city=Tampa&category=trainers',
  flea: '/search?city=Tampa&category=veterinarians',
}

function getAnnualCost(service: ServiceKey, petType: PetType, dogSize: DogSize): number {
  switch (service) {
    case 'vet': {
      if (petType === 'dog') {
        const costs: Record<DogSize, number> = { small: 250, medium: 300, large: 375, xl: 425 }
        return costs[dogSize]
      }
      const byType: Record<PetType, number> = { dog: 0, cat: 200, bird: 150, rabbit: 175, fish: 75 }
      return byType[petType]
    }
    case 'emergency':
      return 1200
    case 'grooming': {
      if (petType === 'dog') {
        const monthly: Record<DogSize, number> = { small: 50, medium: 70, large: 90, xl: 120 }
        return monthly[dogSize] * 12
      }
      const byType: Record<PetType, number> = { dog: 0, cat: 35 * 12, bird: 0, rabbit: 25 * 12, fish: 0 }
      return byType[petType]
    }
    case 'boarding':
      return 315
    case 'training':
      return 200
    case 'flea':
      return 40 * 12
  }
}

export default function CostCalculatorPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [petType, setPetType] = useState<PetType | null>(null)
  const [dogSize, setDogSize] = useState<DogSize>('medium')
  const [services, setServices] = useState<Set<ServiceKey>>(new Set<ServiceKey>(['vet', 'emergency']))
  const [copied, setCopied] = useState(false)

  function toggleService(key: ServiceKey) {
    setServices(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function goToStep2() {
    if (!petType) return
    const available = AVAILABLE_SERVICES[petType]
    setServices(new Set(available.filter(s => s === 'vet' || s === 'emergency')))
    setStep(2)
  }

  function handleShare() {
    if (!petType) return
    const petLabel = PET_OPTIONS.find(p => p.type === petType)?.label ?? 'pet'
    const text = `My ${petLabel}'s annual care costs ~$${annualTotal.toLocaleString()}/year. Get your estimate → petosdirectory.com/calculator`
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const annualTotal = petType
    ? Array.from(services).reduce((sum, s) => sum + getAnnualCost(s, petType, dogSize), 0)
    : 0
  const monthlyTotal = Math.round(annualTotal / 12)
  const selectedPet = PET_OPTIONS.find(p => p.type === petType)

  const stepLabels: Record<1 | 2 | 3, string> = { 1: 'Pet Details', 2: 'Services', 3: 'Results' }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <PageMeta
        title="Pet Care Cost Calculator — Estimate Your Annual Pet Expenses"
        description="Calculate how much it costs to care for your dog, cat, bird, rabbit, or fish in Tampa. Get monthly and annual estimates for vet visits, grooming, boarding, and more."
        path="/calculator"
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
            <Calculator className="w-7 h-7 text-blue-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Care Cost Calculator</h1>
          <p className="text-gray-500 text-base">Get a realistic annual estimate for pet care in Tampa, FL</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as const).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= s ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                {stepLabels[s]}
              </span>
              {s < 3 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

          {/* STEP 1 — Pet Details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What kind of pet do you have?</h2>
              <p className="text-gray-500 text-sm mb-6">Select your pet to get accurate cost estimates</p>

              <div className="grid grid-cols-5 gap-3 mb-8">
                {PET_OPTIONS.map(({ type, label, emoji }) => (
                  <button
                    key={type}
                    onClick={() => setPetType(type)}
                    className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 transition-all ${
                      petType === type
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl leading-none">{emoji}</span>
                    <span className={`text-xs font-semibold ${petType === type ? 'text-blue-700' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {petType === 'dog' && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Dog size</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DOG_SIZES.map(({ size, label, weight }) => (
                      <button
                        key={size}
                        onClick={() => setDogSize(size)}
                        className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all ${
                          dogSize === size
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className={`text-sm font-bold ${dogSize === size ? 'text-blue-700' : 'text-gray-700'}`}>
                          {label}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">{weight}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={goToStep2}
                disabled={!petType}
                className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Next: Select Services
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 — Services */}
          {step === 2 && petType && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Which services do you use?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Select all that apply for your {selectedPet?.label.toLowerCase()}
              </p>

              <div className="space-y-3 mb-8">
                {AVAILABLE_SERVICES[petType].map(key => {
                  const info = SERVICE_INFO[key]
                  const annual = getAnnualCost(key, petType, dogSize)
                  const isChecked = services.has(key)
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => toggleService(key)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{info.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{info.description}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-gray-900">${annual.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">per year</div>
                      </div>
                    </label>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={services.size === 0}
                  className="flex-1 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  See My Estimate
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && petType && (
            <div>
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 mb-1">
                  Estimated annual cost for your {selectedPet?.label.toLowerCase()}
                </p>
                <div className="text-5xl font-bold text-gray-900 mb-2">${annualTotal.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">
                  ~<span className="font-semibold text-gray-700">${monthlyTotal.toLocaleString()}</span>/month
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cost Breakdown</h3>
                <div className="space-y-2.5">
                  {Array.from(services).map(key => {
                    const annual = getAnnualCost(key, petType, dogSize)
                    const info = SERVICE_INFO[key]
                    return (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{info.label}</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">${annual.toLocaleString()}/yr</span>
                          <span className="text-gray-400 text-xs ml-2">(${Math.round(annual / 12)}/mo)</span>
                        </div>
                      </div>
                    )
                  })}
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-700">${annualTotal.toLocaleString()}/yr</span>
                  </div>
                </div>
              </div>

              {/* Find services near you */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Find these services near you in Tampa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from(services).map(key => {
                    const info = SERVICE_INFO[key]
                    return (
                      <Link
                        key={key}
                        to={CATEGORY_LINKS[key]}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-blue-700 font-medium hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0" />
                        {info.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors mb-3"
              >
                {copied
                  ? <CheckCheck className="w-4 h-4 text-green-600" />
                  : <Copy className="w-4 h-4" />
                }
                {copied ? 'Copied to clipboard!' : 'Share my estimate'}
              </button>

              <button
                onClick={() => {
                  setStep(1)
                  setPetType(null)
                  setServices(new Set<ServiceKey>(['vet', 'emergency']))
                }}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
              >
                Start over
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          Estimates based on typical Tampa, FL market rates. Actual costs may vary by provider, breed, and individual pet needs.
        </p>
      </div>
    </div>
  )
}
