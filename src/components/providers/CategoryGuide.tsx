import { Link } from 'react-router-dom'
import { BookOpen, HelpCircle, Search } from 'lucide-react'
import { getCategoryContent } from '@/data/category-content'

interface Props {
  category: string
  city: string
  state: string
  stateSlug?: string
  citySlug?: string
  /** Optional count of providers in this category in this city, for the context line */
  cityCategoryCount?: number
  /** Optional average rating across providers in this category in this city */
  cityCategoryAvgRating?: number | null
  /** The category's plural label, e.g. "Veterinarians" */
  categoryLabel: string
}

/**
 * Category-level educational content for provider pages.
 * Adds ~500 words of unique, useful content per page (educational guide,
 * FAQs, related queries) so Google indexes thin provider pages.
 *
 * Also emits FAQPage schema.org JSON-LD which qualifies the page for
 * FAQ rich snippets in search results.
 */
export function CategoryGuide({
  category,
  city,
  state,
  stateSlug,
  citySlug,
  cityCategoryCount,
  cityCategoryAvgRating,
  categoryLabel,
}: Props) {
  const content = getCategoryContent(category)
  if (!content) return null

  // FAQPage schema.org JSON-LD — qualifies the page for FAQ rich snippets in Google search
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  const cityContextLine = cityCategoryCount && cityCategoryCount > 0
    ? `There ${cityCategoryCount === 1 ? 'is' : 'are'} ${cityCategoryCount} verified ${categoryLabel.toLowerCase()} ${cityCategoryCount === 1 ? 'in' : 'across'} ${city}, ${state}${cityCategoryAvgRating ? `, with an average rating of ${cityCategoryAvgRating.toFixed(1)} stars` : ''}.`
    : null

  return (
    <div className="space-y-8 pt-2 border-t border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Educational guide — ~150 words, unique per category */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          {content.guideHeading}
        </h2>
        {cityContextLine && (
          <p className="text-sm text-gray-500 mb-3 italic">{cityContextLine}</p>
        )}
        <p className="text-gray-700 leading-relaxed">{content.guide}</p>
      </div>

      {/* FAQs — 6 per category, with FAQ schema.org markup for rich snippets */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-gray-400" />
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {content.faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-gray-50 border border-gray-200 rounded-xl p-4 open:bg-white open:border-blue-200 transition-colors"
            >
              <summary className="cursor-pointer font-semibold text-gray-900 text-sm leading-snug list-none flex items-start justify-between gap-3">
                <span>{faq.question}</span>
                <span className="text-blue-600 shrink-0 mt-0.5 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Related queries — internal-link block for SEO + user discovery */}
      {stateSlug && citySlug && content.relatedQueries.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Related searches in {city}
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.relatedQueries.map((q, i) => (
              <Link
                key={i}
                to={`/${stateSlug}/${citySlug}/${category}`}
                className="text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-300 text-blue-700 rounded-full transition-colors"
              >
                {q} in {city}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
