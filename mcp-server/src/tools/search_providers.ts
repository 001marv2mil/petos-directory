import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSupabaseClient, type Provider } from '../db.js'
import { CITIES, CATEGORIES } from '../constants.js'

function buildProviderUrl(provider: Provider): string {
  const cityMeta = CITIES.find(
    (c) => c.city.toLowerCase() === provider.city.toLowerCase()
  )
  const categoryMeta = CATEGORIES.find((c) => c.slug === provider.category)

  if (!cityMeta || !categoryMeta) {
    return `https://petosdirectory.com`
  }

  return `https://petosdirectory.com/${cityMeta.stateSlug}/${cityMeta.citySlug}/${provider.category}/${provider.slug}`
}

function formatProvider(provider: Provider) {
  return {
    name: provider.business_name,
    slug: provider.slug,
    category: provider.category,
    address: provider.address,
    city: provider.city,
    state: provider.state,
    phone: provider.phone ?? null,
    website: provider.website ?? null,
    rating: provider.rating ?? null,
    review_count: provider.review_count,
    verified: provider.verified,
    emergency: provider.emergency,
    url: buildProviderUrl(provider),
  }
}

export function registerSearchProviders(server: McpServer): void {
  server.tool(
    'search_providers',
    'Search for pet service providers in a specific city and/or category. Use this to answer questions like "find me a vet in Tampa" or "dog groomers in Austin".',
    {
      city: z.string().describe('City name, e.g. "Tampa" or "Austin"'),
      category: z
        .enum([
          'veterinarians',
          'emergency_vets',
          'groomers',
          'boarding',
          'daycare',
          'trainers',
          'pet_pharmacies',
        ])
        .optional()
        .describe(
          'Service category slug. One of: veterinarians, emergency_vets, groomers, boarding, daycare, trainers, pet_pharmacies'
        ),
      query: z
        .string()
        .optional()
        .describe('Optional free-text search within business names'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .describe('Number of results to return (default 5, max 20)'),
    },
    async ({ city, category, query, limit }) => {
      const db = getSupabaseClient()

      let q = db
        .from('providers')
        .select(
          'id, slug, business_name, category, address, city, state, zip, phone, website, rating, review_count, emergency, verified, description, services'
        )
        .ilike('city', city)
        .order('rating', { ascending: false })
        .limit(limit)

      if (category) {
        q = q.eq('category', category)
      }

      if (query) {
        q = q.ilike('business_name', `%${query}%`)
      }

      const { data, error } = await q

      if (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error querying providers: ${error.message}`,
            },
          ],
          isError: true,
        }
      }

      const providers = (data ?? []) as Provider[]

      if (providers.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No providers found in ${city}${category ? ` for category "${category}"` : ''}. Try a nearby city or a different category.`,
            },
          ],
        }
      }

      const results = providers.map(formatProvider)

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                count: results.length,
                city,
                category: category ?? 'all',
                providers: results,
              },
              null,
              2
            ),
          },
        ],
      }
    }
  )
}
