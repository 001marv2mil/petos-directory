import { Helmet } from 'react-helmet-async'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80&fit=crop'
const SITE_URL = 'https://petosdirectory.com'

interface PageMetaProps {
  title: string
  description: string
  image?: string
  path?: string
  type?: 'website' | 'profile'
}

export function PageMeta({ title, description, image, path, type = 'website' }: PageMetaProps) {
  const fullTitle = `${title} | PetOS Directory`
  const img = image ?? DEFAULT_IMAGE
  const url = path ? `${SITE_URL}${path}` : SITE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PetOS Directory" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}
