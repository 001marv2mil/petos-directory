import { useState } from 'react'
import { ChevronDown, Search, PawPrint } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { CITIES } from '@/lib/constants'

interface Faq {
  question: string
  answer: string
}

interface FaqGroup {
  category: string
  faqs: Faq[]
}

function buildFaqGroups(city: string): FaqGroup[] {
  return [
    {
      category: 'Cost Questions',
      faqs: [
        {
          question: `How much does a vet visit cost in ${city}?`,
          answer: `A routine vet visit in ${city} typically costs between $50 and $250, depending on the clinic and what's included. A basic wellness exam (no vaccines or lab work) runs $50–$100. Add vaccinations and expect $150–$250. Specialist visits can reach $200–$400 or more. Emergency after-hours visits typically start at $100–$200 just for the exam fee, before any treatment.`,
        },
        {
          question: `How much does dog grooming cost in ${city}?`,
          answer: `A full-service dog groom in ${city} (bath, dry, haircut, nail trim, ear cleaning) typically costs $40–$120. Pricing is driven mostly by breed size and coat type — a small dog like a Shih Tzu runs $45–$65, while a large breed like a Golden Retriever can be $85–$120. Add-ons like teeth brushing ($10–$20) or de-shedding treatments ($15–$30) increase the total. Many groomers in ${city} offer monthly packages at a slight discount.`,
        },
        {
          question: `How much does dog boarding cost per night in ${city}?`,
          answer: `Dog boarding in ${city} costs $30–$80 per night. Standard kennel-style boarding runs $30–$45/night. Suite-style or luxury boarding (private rooms, more play time) is $50–$80/night. In-home pet sitting tends to fall in the $40–$60/night range. Holiday and weekend rates are often 10–20% higher. Always tour the facility before booking to check cleanliness and staff interaction.`,
        },
        {
          question: `How much does dog training cost in ${city}?`,
          answer: `Dog training in ${city} typically costs $100–$200 for a single private session, or $150–$300 for a group class series (6–8 weeks). Board-and-train programs — where your dog stays with a trainer — run $1,500–$3,500 for 2–4 weeks depending on goals. Puppy kindergarten is usually on the lower end at $120–$200 for a full series. Look for trainers who use positive reinforcement methods and are certified by the CCPDT or IAABC.`,
        },
      ],
    },
    {
      category: 'Finding Services',
      faqs: [
        {
          question: `What is the best veterinarian in ${city}?`,
          answer: `The best vet in ${city} depends on your pet's needs and your location within the city. Look for clinics with 4.5+ star ratings across at least 50 reviews — that's a meaningful signal of consistent quality. Personal recommendations from neighbors or local community groups are often the most reliable source. PetOS shows verified ratings and real reviews to help you compare options near you. For specialty or emergency needs, search specifically for AAHA-accredited clinics or board-certified specialists.`,
        },
        {
          question: `Where can I find emergency vet care in ${city}?`,
          answer: `Search for "emergency veterinarian" or "24-hour vet" near ${city} on PetOS to find clinics with after-hours and emergency services. Emergency animal hospitals are equipped for urgent, life-threatening situations — severe injuries, difficulty breathing, suspected poisoning, uncontrolled bleeding, or seizures. They're staffed 24/7 with surgical suites and intensive care capability. Always call ahead so the team can prepare before you arrive with a critical case.`,
        },
        {
          question: `How do I find a trusted vet for my dog?`,
          answer: `Start with clinics that have 4.5+ star ratings across at least 50 reviews — that's a meaningful signal of consistent quality, not just a few happy customers. Ask neighbors or local community groups for personal recommendations. Many clinics offer a free "meet and greet" before committing — see how the staff interact with your dog and how comfortable you feel asking questions. AAHA accreditation is an optional but rigorous quality standard worth checking. Most importantly, look for vets who communicate clearly and don't rush you — that relationship matters across years of care.`,
        },
        {
          question: `What's the difference between a vet and an emergency vet?`,
          answer: `A regular (primary care) vet handles routine and preventive care: annual exams, vaccines, dental cleanings, minor illness, and chronic condition management — typically by appointment during business hours. An emergency vet is set up for urgent, life-threatening situations: severe injuries, difficulty breathing, suspected poisoning, uncontrolled bleeding, or seizures. Emergency clinics are staffed 24/7 with surgical suites and intensive care capability. The tradeoff: emergency vets are significantly more expensive and your pet may be seen by someone you've never met. When in doubt after hours, call your primary vet's emergency line first — they can advise whether the situation truly needs immediate emergency care.`,
        },
      ],
    },
    {
      category: 'Pet Care Tips',
      faqs: [
        {
          question: `What pet services are covered by pet insurance?`,
          answer: `Most pet insurance plans cover accidents and illnesses: emergency vet visits, surgeries, hospitalizations, diagnostic tests (X-rays, bloodwork), prescription medications, and specialist referrals. Wellness or preventive care add-ons (at extra cost) cover routine exams, vaccines, flea/tick prevention, and dental cleanings. What's typically NOT covered: pre-existing conditions, cosmetic procedures, and often dental disease present before enrollment. Important: insurance reimburses you after you pay the vet — you still pay upfront and submit a claim. Enroll while your pet is young and healthy for the best coverage and rates.`,
        },
        {
          question: `How often should I take my dog to the vet?`,
          answer: `Puppies (under 1 year): every 3–4 weeks for vaccines and checkups until the full puppy series is complete, then a spay/neuter appointment. Adult dogs (1–7 years): once a year for a wellness exam, annual vaccines, heartworm test, and flea/tick prevention renewal. Senior dogs (7+ years, or 5+ for large breeds): twice a year. Health changes accelerate in senior dogs, and catching problems early can extend quality of life and reduce future costs. Anytime: if your dog shows changes in eating, drinking, energy, weight, or behavior — don't wait for the annual visit.`,
        },
      ],
    },
  ]
}

export default function FaqPage() {
  const params = useParams<{ state?: string; city?: string }>()
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const cityMeta =
    params.state && params.city
      ? CITIES.find(c => c.stateSlug === params.state && c.citySlug === params.city)
      : null

  const cityName = cityMeta?.city ?? 'your area'
  const isCity = !!cityMeta
  const faqGroups = buildFaqGroups(cityName)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(cityMeta && {
      about: {
        '@type': 'City',
        name: cityMeta.city,
        containedInPlace: {
          '@type': 'State',
          name: cityMeta.state,
        },
      },
    }),
    mainEntity: faqGroups.flatMap(group =>
      group.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
  }

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const metaTitle = isCity
    ? `Pet Care FAQ in ${cityMeta!.city}, ${cityMeta!.stateAbbr} — Costs, Vets & Services`
    : 'Pet Care FAQ — Costs, Vets & Services Near You'

  const metaDescription = isCity
    ? `Answers to the most common questions about pet care costs, finding vets, grooming, and boarding in ${cityMeta!.city}, ${cityMeta!.state}.`
    : 'Answers to the most common questions about pet care costs, finding trusted vets, grooming, boarding, and more.'

  const metaPath = isCity
    ? `/${cityMeta!.stateSlug}/${cityMeta!.citySlug}/faq`
    : '/faq'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        path={metaPath}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      {isCity && (
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/${cityMeta!.stateSlug}`} className="hover:text-gray-600 transition-colors">{cityMeta!.state}</Link>
          <span>/</span>
          <Link to={`/${cityMeta!.stateSlug}/${cityMeta!.citySlug}`} className="hover:text-gray-600 transition-colors">{cityMeta!.city}</Link>
          <span>/</span>
          <span className="text-gray-600">FAQ</span>
        </nav>
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Pet Care FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {isCity
            ? `Pet Care Questions in ${cityMeta!.city}`
            : 'Common Pet Care Questions'}
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          {isCity
            ? `Real answers about vet costs, grooming, boarding, and finding trusted pet services in ${cityMeta!.city}.`
            : 'Real answers about vet costs, grooming, boarding, training, and finding trusted pet care near you.'}
        </p>
      </div>

      {/* FAQ Groups */}
      <div className="space-y-10">
        {faqGroups.map(group => (
          <div key={group.category}>
            <h2 className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-4">
              {group.category}
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {group.faqs.map(faq => {
                const key = faq.question
                const isOpen = openItems.has(key)
                return (
                  <div key={key} className="bg-white">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-900 text-base leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <p className="pt-4 text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 p-6 sm:p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
        <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isCity ? `Find pet services in ${cityMeta!.city}` : 'Find pet services near you'}
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {isCity
            ? `Browse verified vets, groomers, boarders, and trainers in ${cityMeta!.city}.`
            : 'Browse verified vets, groomers, boarders, and trainers across hundreds of cities.'}
        </p>
        {isCity ? (
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to={`/${cityMeta!.stateSlug}/${cityMeta!.citySlug}/veterinarians`}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Veterinarians
            </Link>
            <Link
              to={`/${cityMeta!.stateSlug}/${cityMeta!.citySlug}/groomers`}
              className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Groomers
            </Link>
            <Link
              to={`/${cityMeta!.stateSlug}/${cityMeta!.citySlug}/boarding`}
              className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Boarding
            </Link>
            <Link
              to={`/${cityMeta!.stateSlug}/${cityMeta!.citySlug}/trainers`}
              className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Trainers
            </Link>
          </div>
        ) : (
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            Search pet services
          </Link>
        )}
      </div>
    </div>
  )
}
