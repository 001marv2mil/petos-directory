import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { cn } from '@/lib/utils'
import {
  Calculator,
  ChevronRight,
  ChevronLeft,
  Share2,
  MapPin,
  CheckCircle,
  Stethoscope,
  Scissors,
  Home,
  Dumbbell,
  Pill,
  Shield,
  Info,
  Check,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish'
type DogSize = 'small' | 'medium' | 'large' | 'xlarge'
type ServiceKey = 'vet' | 'emergency' | 'grooming' | 'boarding' | 'training' | 'pharmacy'

interface CostEntry {
  low: number
  high: number
  mid: number
  note: string
}

// ─── Cost Data (Tampa Bay / Florida market rates) ──────────────────────────────

type CostMap = Record<ServiceKey, CostEntry>

const DOG_COSTS: Record<DogSize, CostMap> = {
  small: {
    vet:       { low: 200, high: 300, mid: 250, note: 'Wellness exam + core vaccines' },
    emergency: { low: 600, high: 1200, mid: 900, note: 'Recommended annual savings' },
    grooming:  { low: 480, high: 720, mid: 600, note: 'Monthly grooming (~$50/mo)' },
    boarding:  { low: 350, high: 600, mid: 475, note: '~10 nights/year at $35–60/night' },
    training:  { low: 150, high: 300, mid: 225, note: 'Group or private package' },
    pharmacy:  { low: 360, high: 480, mid: 420, note: 'Flea, tick & heartworm prevention' },
  },
  medium: {
    vet:       { low: 220, high: 320, mid: 275, note: 'Wellness exam + core vaccines' },
    emergency: { low: 800, high: 1500, mid: 1150, note: 'Recommended annual savings' },
    grooming:  { low: 600, high: 840, mid: 720, note: 'Monthly grooming (~$60/mo)' },
    boarding:  { low: 350, high: 600, mid: 475, note: '~10 nights/year at $35–60/night' },
    training:  { low: 150, high: 300, mid: 225, note: 'Group or private package' },
    pharmacy:  { low: 420, high: 540, mid: 480, note: 'Flea, tick & heartworm prevention' },
  },
  large: {
    vet:       { low: 300, high: 400, mid: 350, note: 'Wellness exam + core vaccines' },
    emergency: { low: 1000, high: 2000, mid: 1500, note: 'Recommended annual savings' },
    grooming:  { low: 840, high: 1200, mid: 1020, note: 'Monthly grooming (~$85/mo)' },
    boarding:  { low: 420, high: 650, mid: 535, note: '~10 nights/year at $42–65/night' },
    training:  { low: 200, high: 350, mid: 275, note: 'Group or private package' },
    pharmacy:  { low: 480, high: 600, mid: 540, note: 'Flea, tick & heartworm prevention' },
  },
  xlarge: {
    vet:       { low: 350, high: 450, mid: 400, note: 'Wellness exam + core vaccines' },
    emergency: { low: 1200, high: 2500, mid: 1850, note: 'Recommended annual savings' },
    grooming:  { low: 1080, high: 1440, mid: 1260, note: 'Monthly grooming (~$105/mo)' },
    boarding:  { low: 500, high: 720, mid: 610, note: '~10 nights/year at $50–72/night' },
    training:  { low: 250, high: 400, mid: 325, note: 'Group or private package' },
    pharmacy:  { low: 540, high: 720, mid: 630, note: 'Flea, tick & heartworm prevention' },
  },
}

const PET_COSTS: Record<Exclude<PetType, 'dog'>, Partial<CostMap>> = {
  cat: {
    vet:       { low: 150, high: 250, mid: 200, note: 'Annual wellness exam + vaccines' },
    emergency: { low: 500, high: 1200, mid: 850, note: 'Recommended annual savings' },
    grooming:  { low: 180, high: 300, mid: 240, note: 'Quarterly grooming (~$60/session)' },
    boarding:  { low: 250, high: 400, mid: 325, note: '~10 nights/year at $25–40/night' },
    pharmacy:  { low: 300, high: 420, mid: 360, note: 'Flea & parasite prevention' },
  },
  bird: {
    vet:       { low: 100, high: 200, mid: 150, note: 'Avian vet annual wellness' },
    emergency: { low: 200, high: 600, mid: 400, note: 'Recommended annual savings' },
    grooming:  { low: 80, high: 160, mid: 120, note: 'Nail/beak trims as needed' },
    boarding:  { low: 150, high: 280, mid: 215, note: '~10 nights/year at $15–28/night' },
  },
  rabbit: {
    vet:       { low: 150, high: 220, mid: 185, note: 'Annual wellness exam' },
    emergency: { low: 300, high: 800, mid: 550, note: 'Recommended annual savings' },
    grooming:  { low: 80, high: 160, mid: 120, note: 'Nail trims & brushing' },
    boarding:  { low: 200, high: 350, mid: 275, note: '~10 nights/year at $20–35/night' },
    pharmacy:  { low: 120, high: 240, mid: 180, note: 'Parasite prevention' },
  },
  fish: {
    vet:       { low: 60, high: 120, mid: 90, note: 'Aquatic vet (if needed)' },
    emergency: { low: 100, high: 300, mid: 200, note: 'Equipment + treatment fund' },
    grooming:  { low: 0, high: 0, mid: 0, note: 'Not applicable' },
    boarding:  { low: 0, high: 0, mid: 0, note: 'Usually cared for by a friend' },
  },
}

// Services that are available per pet type
const AVAILABLE_SERVICES: Record<PetType, ServiceKey[]> = {
  dog:    ['vet', 'emergency', 'grooming', 'boarding', 'training', 'pharmacy'],
  cat:    ['vet', 'emergency', 'grooming', 'boarding', 'pharmacy'],
  bird:   ['vet', 'emergency', 'grooming', 'boarding'],
  rabbit: ['vet', 'emergency', 'grooming', 'boarding', 'pharmacy'],
  fish:   ['vet', 'emergency'],
}

const SERVICE_META: Record<ServiceKey, { label: string; icon: React.ReactNode; description: string }> = {
  vet:       { label: 'Annual Vet Visits', icon: <Stethoscope className="w-5 h-5" />, description: 'Wellness exam, vaccines & routine checkup' },
  emergency: { label: 'Emergency Vet Fund', icon: <Shield className="w-5 h-5" />, description: 'Recommended savings for unexpected illness or injury' },
  grooming:  { label: 'Grooming', icon: <Scissors className="w-5 h-5" />, description: 'Monthly or quarterly bathing, trimming & styling' },
  boarding:  { label: 'Boarding / Pet Sitting', icon: <Home className="w-5 h-5" />, description: 'Overnight stays while you travel (~10 nights/year)' },
  training:  { label: 'Dog Training', icon: <Dumbbell className="w-5 h-5" />, description: 'Group classes or private sessions' },
  pharmacy:  { label: 'Flea, Tick & Heartworm', icon: <Pill className="w-5 h-5" />, description: 'Monthly preventatives for parasite protection' },
}

const PET_LABELS: Record<PetType, string> = {
  dog: 'Dog', cat: 'Cat', bird: 'Bird', rabbit: 'Rabbit', fish: 'Fish',
}

const PET_EMOJIS: Record<PetType, string> = {
  dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', fish: '🐠',
}

const DOG_SIZE_LABELS: Record<DogSize, string> = {
  small: 'Small (under 20 lbs)',
  medium: 'Medium (20–50 lbs)',
  large: 'Large (50–80 lbs)',
  xlarge: 'Extra Large (80+ lbs)',
}

const SEARCH_CATEGORY_MAP: Record<ServiceKey, string> = {
  vet: 'veterinarians',
  emergency: 'emergency_vets',
  grooming: 'groomers',
  boarding: 'boarding',
  training: 'trainers',
  pharmacy: 'pet_pharmacies',
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCostEntry(petType: PetType, dogSize: DogSize, service: ServiceKey): CostEntry | null {
  if (petType === 'dog') {
    return DOG_COSTS[dogSize][service] ?? null
  }
  const costs = PET_COSTS[petType as Exclude<PetType, 'dog'>]
  return (costs as CostMap)[service] ?? null
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CostCalculatorPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [petType, setPetType] = useState<PetType | null>(null)
  const [dogSize, setDogSize] = useState<DogSize>('medium')
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>(['vet', 'pharmacy'])
  const [copied, setCopied] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const availableServices = petType ? AVAILABLE_SERVICES[petType] : []

  function toggleService(key: ServiceKey) {
    setSelectedServices(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    )
  }

  function goToStep2() {
    if (!petType) return
    // Reset services to sensible defaults for the pet type
    const defaults: ServiceKey[] = petType === 'dog'
      ? ['vet', 'emergency', 'pharmacy']
      : petType === 'cat'
      ? ['vet', 'emergency', 'pharmacy']
      : ['vet', 'emergency']
    setSelectedServices(defaults.filter(s => availableServices.includes(s)))
    setStep(2)
  }

  function goToStep3() {
    setStep(3)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // Calculate costs
  const breakdown = selectedServices.map(service => {
    if (!petType) return null
    const entry = getCostEntry(petType, dogSize, service)
    if (!entry || entry.mid === 0) return null
    return { service, entry }
  }).filter(Boolean) as { service: ServiceKey; entry: CostEntry }[]

  const annualLow = breakdown.reduce((sum, b) => sum + b.entry.low, 0)
  const annualHigh = breakdown.reduce((sum, b) => sum + b.entry.high, 0)
  const annualMid = breakdown.reduce((sum, b) => sum + b.entry.mid, 0)
  const monthlyMid = Math.round(annualMid / 12)

  const petLabel = petType ? PET_LABELS[petType] : 'pet'
  const petEmoji = petType ? PET_EMOJIS[petType] : '🐾'

  async function handleShare() {
    const text = `My ${petLabel.toLowerCase()}'s annual care costs ~${fmt(annualMid)}/year. Get your free estimate → petosdirectory.com/calculator`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Pet Care Cost Estimate', text, url: 'https://petosdirectory.com/calculator' })
        return
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // ignore
    }
  }

  return (
    <>
      <PageMeta
        title="Pet Care Cost Calculator"
        description="Estimate your annual pet care costs for vet visits, grooming, boarding and more. Free calculator for pet owners."
        path="/calculator"
      />

      {/* Page header */}
      <div className="bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-5">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Pet Care Cost Calculator
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Find out what your pet's annual care really costs — based on Tampa Bay area averages.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            Based on Tampa Bay area average costs · Updated 2025
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {([1, 2, 3] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (s < step || (s === 2 && petType)) setStep(s)
                }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  step === s
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                )}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </button>
              <span className={cn(
                'text-sm font-medium hidden sm:block',
                step === s ? 'text-gray-900' : 'text-gray-400'
              )}>
                {s === 1 ? 'Your Pet' : s === 2 ? 'Services' : 'Your Estimate'}
              </span>
              {i < 2 && <div className={cn('w-10 h-px', step > s ? 'bg-green-400' : 'bg-gray-200')} />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Pet type ─────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">What kind of pet do you have?</h2>
            <p className="text-gray-500 text-sm mb-6">We'll tailor the estimates to your pet type.</p>

            <div className="grid grid-cols-5 gap-3 mb-8">
              {(['dog', 'cat', 'bird', 'rabbit', 'fish'] as PetType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setPetType(type)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    petType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <span className="text-3xl">{PET_EMOJIS[type]}</span>
                  <span className={cn(
                    'text-xs font-medium',
                    petType === type ? 'text-blue-700' : 'text-gray-600'
                  )}>
                    {PET_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>

            {/* Dog size selector */}
            {petType === 'dog' && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">How big is your dog?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['small', 'medium', 'large', 'xlarge'] as DogSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setDogSize(size)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                        dogSize === size
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-300'
                      )}
                    >
                      <span className="text-xl">
                        {size === 'small' ? '🐩' : size === 'medium' ? '🐕' : size === 'large' ? '🦮' : '🐕‍🦺'}
                      </span>
                      <span className={cn(
                        'text-sm font-medium',
                        dogSize === size ? 'text-blue-700' : 'text-gray-700'
                      )}>
                        {DOG_SIZE_LABELS[size]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={goToStep2}
              disabled={!petType}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all',
                petType
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Select services
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ── Step 2: Services ──────────────────────────────────────────────────── */}
        {step === 2 && petType && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Which services do you want to estimate? {petEmoji}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Select everything that applies to your {petLabel.toLowerCase()}. You can change these later.
            </p>

            <div className="space-y-3 mb-8">
              {availableServices.map(key => {
                const meta = SERVICE_META[key]
                const entry = getCostEntry(petType, dogSize, key)
                const isSelected = selectedServices.includes(key)
                if (!entry) return null

                return (
                  <button
                    key={key}
                    onClick={() => toggleService(key)}
                    className={cn(
                      'w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 mt-0.5',
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                    )}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          'font-semibold text-sm',
                          isSelected ? 'text-blue-800' : 'text-gray-800'
                        )}>
                          {meta.label}
                        </span>
                        <span className={cn(
                          'text-sm font-semibold flex-shrink-0',
                          isSelected ? 'text-blue-700' : 'text-gray-500'
                        )}>
                          {entry.mid > 0 ? `~${fmt(entry.mid)}/yr` : 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center',
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 py-3 px-5 rounded-xl font-semibold text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={goToStep3}
                disabled={selectedServices.length === 0}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all',
                  selectedServices.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                See my estimate
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ───────────────────────────────────────────────────── */}
        {step === 3 && petType && (
          <div ref={resultsRef} className="space-y-5">

            {/* Summary card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-blue-100 text-sm">
                <CheckCircle className="w-4 h-4" />
                Estimated annual cost for your {petLabel.toLowerCase()} {petEmoji}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Monthly estimate</p>
                  <p className="text-4xl font-bold">{fmt(monthlyMid)}</p>
                  <p className="text-blue-200 text-xs mt-1">per month</p>
                </div>
                <div className="sm:pb-1">
                  <p className="text-blue-200 text-sm mb-1">Annual estimate</p>
                  <p className="text-3xl font-bold">{fmt(annualMid)}</p>
                  <p className="text-blue-200 text-xs mt-1">per year</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-500/40 text-blue-100 text-xs">
                Range: {fmt(annualLow)} – {fmt(annualHigh)} annually · Based on Tampa Bay area rates
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Cost breakdown
              </h3>
              <div className="space-y-3">
                {breakdown.map(({ service, entry }) => (
                  <div key={service} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0">
                      {SERVICE_META[service].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{SERVICE_META[service].label}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">{fmt(entry.mid)}/yr</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-400">{entry.note}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {fmt(entry.low)}–{fmt(entry.high)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Annual total</span>
                <span className="font-bold text-lg text-gray-900">{fmt(annualMid)}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-gray-400 px-1">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Estimates reflect typical Tampa Bay area prices and vary by provider, pet health, and frequency.
              Emergency fund is a recommended savings amount, not a guaranteed expense.
            </div>

            {/* Find services */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Find these services near you
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Compare local providers in Tampa Bay and across Florida — for free.
              </p>
              <div className="flex flex-wrap gap-2">
                {breakdown.map(({ service }) => (
                  <Link
                    key={service}
                    to={`/search?category=${SEARCH_CATEGORY_MAP[service]}`}
                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors"
                  >
                    {SERVICE_META[service].icon}
                    {SERVICE_META[service].label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share + recalculate */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm bg-gray-900 hover:bg-gray-800 text-white transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share your estimate
                  </>
                )}
              </button>
              <button
                onClick={() => { setStep(1); setPetType(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Calculator className="w-4 h-4" />
                Recalculate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom trust section */}
      <div className="border-t border-gray-100 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Ready to find the best care for your {petLabel.toLowerCase()}?
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            Browse pet services near you
          </Link>
        </div>
      </div>
    </>
  )
}
