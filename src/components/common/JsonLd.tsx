/** Renders any JSON-LD object as an inline script tag */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const SITE = 'https://petosdirectory.com'

/** BreadcrumbList — pass ordered items */
export function BreadcrumbJsonLd({ items }: { items: Array<{ label: string; href?: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE}${item.href}` } : {}),
    })),
  }
  return <JsonLd data={data} />
}

/** ItemList — for category/search result pages */
export function ItemListJsonLd({ items }: {
  items: Array<{ name: string; url: string; description?: string; image?: string }>
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: item.name,
        url: `${SITE}${item.url}`,
        ...(item.description ? { description: item.description } : {}),
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  }
  return <JsonLd data={data} />
}

/** FAQPage — for city and category landing pages */
export function FaqJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return <JsonLd data={data} />
}

/** WebSite with SearchAction — goes on homepage for sitelinks searchbox */
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PetOS Directory',
    url: SITE,
    description: 'Find trusted veterinarians, groomers, pet boarding, dog daycare, trainers, and emergency vets across the United States.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
  return <JsonLd data={data} />
}
