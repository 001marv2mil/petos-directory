import { useState } from 'react'
import { Check, Mail, Sparkles } from 'lucide-react'

type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
type Friendliness = 'loves' | 'friendly' | 'nervous' | 'reactive'
type Energy = 'couch' | 'chill' | 'high' | 'nonstop'
type VetBehavior = 'fine' | 'tolerates' | 'stressed' | 'meltdown'

interface Answers {
  petType: PetType | null
  friendliness: Friendliness | null
  energy: Energy | null
  vetBehavior: VetBehavior | null
  zip: string
}

const STATES: Array<[string, string]> = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
  ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
  ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
  ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],
  ['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

interface Result {
  archetype: string
  emoji: string
  description: string
  providers: Array<{
    business_name: string
    category: string
    address: string
    city: string
    state: string
    rating: number | null
    slug: string
    why: string
  }>
}

export function PetPersonalityQuiz() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 'email' | 'result'>(1)
  const [answers, setAnswers] = useState<Answers>({
    petType: null, friendliness: null, energy: null, vetBehavior: null, zip: '',
  })
  const [email, setEmail] = useState('')
  const [state, setState] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  function pick<K extends keyof Answers>(field: K, value: Answers[K]) {
    setAnswers(prev => ({ ...prev, [field]: value }))
    // auto-advance to next step
    setStep(prev => {
      if (prev === 1) return 2
      if (prev === 2) return 3
      if (prev === 3) return 4
      if (prev === 4) return 5
      return prev
    })
  }

  async function handleSubmit() {
    if (!email || !state) {
      setError('Email and state are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/pet-personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, state, ...answers }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Error ${res.status}`)
        return
      }
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  // Result screen
  if (step === 'result' && result) {
    return (
      <section className="my-14 p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{result.emoji}</div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Your pet is...</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{result.archetype}</h3>
          <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">{result.description}</p>
        </div>

        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3 mt-8">Your perfect matches</h4>
        <div className="space-y-3">
          {result.providers.map(p => (
            <a
              key={p.slug}
              href={`/provider/${p.slug}`}
              className="block bg-white border border-amber-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="font-bold text-gray-900">{p.business_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 capitalize">{p.category.replace('_', ' ')} · {p.city}, {p.state}</div>
                </div>
                {p.rating && (
                  <div className="text-sm font-semibold text-amber-700 shrink-0">⭐ {p.rating.toFixed(1)}</div>
                )}
              </div>
              <div className="text-sm text-gray-600 italic mt-2">→ {p.why}</div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          ✓ Sent to <strong>{email}</strong> — check your inbox to save this list.
        </div>
      </section>
    )
  }

  // Email gate
  if (step === 'email') {
    const archetypeName = computeArchetype(answers).archetype
    return (
      <section className="my-14 p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl">
        <div className="text-center max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-amber-600 mx-auto mb-4" />
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Almost done</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Your pet is a {archetypeName}</h3>
          <p className="text-gray-700 mb-6">
            Drop your email + state and I'll send you the full results plus <strong>3 perfectly matched local providers</strong> for your pet's personality.
          </p>

          <div className="space-y-3 text-left">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
            />
            <select
              required
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
            >
              <option value="">Your state</option>
              {STATES.map(([abbr, name]) => (
                <option key={abbr} value={abbr}>{name}</option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={submitting || !email || !state}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {submitting ? 'Finding your matches…' : <><Mail className="w-4 h-4" /> See my results + matches</>}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-700">⚠️ {error}</p>}
          <p className="mt-3 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    )
  }

  // Question screens
  const totalSteps = 5
  return (
    <section className="my-14 p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 max-w-md mx-auto">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${i <= (step as number) ? 'bg-amber-600' : 'bg-amber-200'}`}
          />
        ))}
        <span className="text-xs text-amber-700 font-semibold ml-2 shrink-0">{step}/{totalSteps}</span>
      </div>

      {step === 1 && (
        <QuestionCard title="What kind of pet?" subtitle="Tap one">
          <Choice emoji="🐕" label="Dog" onClick={() => pick('petType', 'dog')} selected={answers.petType === 'dog'} />
          <Choice emoji="🐈" label="Cat" onClick={() => pick('petType', 'cat')} selected={answers.petType === 'cat'} />
          <Choice emoji="🦜" label="Bird" onClick={() => pick('petType', 'bird')} selected={answers.petType === 'bird'} />
          <Choice emoji="🐇" label="Rabbit" onClick={() => pick('petType', 'rabbit')} selected={answers.petType === 'rabbit'} />
          <Choice emoji="🐾" label="Other" onClick={() => pick('petType', 'other')} selected={answers.petType === 'other'} />
        </QuestionCard>
      )}

      {step === 2 && (
        <QuestionCard title="How does your pet feel about strangers?">
          <Choice emoji="🥰" label="Loves everyone" onClick={() => pick('friendliness', 'loves')} selected={answers.friendliness === 'loves'} />
          <Choice emoji="🙂" label="Friendly but cautious" onClick={() => pick('friendliness', 'friendly')} selected={answers.friendliness === 'friendly'} />
          <Choice emoji="😬" label="Nervous or shy" onClick={() => pick('friendliness', 'nervous')} selected={answers.friendliness === 'nervous'} />
          <Choice emoji="🛡️" label="Don't even try" onClick={() => pick('friendliness', 'reactive')} selected={answers.friendliness === 'reactive'} />
        </QuestionCard>
      )}

      {step === 3 && (
        <QuestionCard title="Energy level?">
          <Choice emoji="😴" label="Couch potato" onClick={() => pick('energy', 'couch')} selected={answers.energy === 'couch'} />
          <Choice emoji="🚶" label="Chill cruiser" onClick={() => pick('energy', 'chill')} selected={answers.energy === 'chill'} />
          <Choice emoji="🏃" label="High energy" onClick={() => pick('energy', 'high')} selected={answers.energy === 'high'} />
          <Choice emoji="🚀" label="Nonstop chaos" onClick={() => pick('energy', 'nonstop')} selected={answers.energy === 'nonstop'} />
        </QuestionCard>
      )}

      {step === 4 && (
        <QuestionCard title="How do they handle the vet?">
          <Choice emoji="🤗" label="No problem" onClick={() => pick('vetBehavior', 'fine')} selected={answers.vetBehavior === 'fine'} />
          <Choice emoji="😐" label="Tolerates it" onClick={() => pick('vetBehavior', 'tolerates')} selected={answers.vetBehavior === 'tolerates'} />
          <Choice emoji="😨" label="Stresses out" onClick={() => pick('vetBehavior', 'stressed')} selected={answers.vetBehavior === 'stressed'} />
          <Choice emoji="😡" label="Full meltdown" onClick={() => pick('vetBehavior', 'meltdown')} selected={answers.vetBehavior === 'meltdown'} />
        </QuestionCard>
      )}

      {step === 5 && (
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Last question</h3>
          <p className="text-sm text-gray-600 mb-6">Where do you live? (5-digit zip)</p>
          <input
            type="text"
            placeholder="33647"
            value={answers.zip}
            onChange={e => setAnswers(p => ({ ...p, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
            inputMode="numeric"
            maxLength={5}
            className="w-full px-4 py-3 text-center text-xl tracking-widest border-2 border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <button
            onClick={() => setStep('email')}
            disabled={answers.zip.length !== 5}
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            See my pet's personality
          </button>
        </div>
      )}
    </section>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function QuestionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 text-center mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Choice({ emoji, label, onClick, selected }: { emoji: string; label: string; onClick: () => void; selected: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
        selected
          ? 'bg-amber-600 text-white border-2 border-amber-600'
          : 'bg-white border-2 border-amber-200 hover:border-amber-400 text-gray-900'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="font-semibold text-base">{label}</span>
    </button>
  )
}

// Mirrors the server-side scoring so the email-gate header can show the archetype name
function computeArchetype(a: Answers): { archetype: string } {
  if (a.energy === 'nonstop') return { archetype: 'Chaos Goblin' }
  if (a.friendliness === 'reactive') return { archetype: 'Guardian' }
  if (a.energy === 'couch' && (a.vetBehavior === 'fine' || a.vetBehavior === 'tolerates')) return { archetype: 'Royal Lounger' }
  if (a.energy === 'high' && (a.vetBehavior === 'stressed' || a.vetBehavior === 'meltdown')) return { archetype: 'Anxious Athlete' }
  if (a.friendliness === 'loves' && a.vetBehavior === 'fine') return { archetype: 'Social Butterfly' }
  return { archetype: 'Easygoing Companion' }
}
