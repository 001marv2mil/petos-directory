import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSupabaseClient, type Provider } from '../db.js'
import { CITIES, CATEGORIES } from '../constants.js'

function buildProviderUrl(provider: Provider): string {
  const cityMeta = CITIES.find(
    (c) => c.city.toLowerCase() === provider.city.toLowerCase()
  )
  if (!cityMeta) return `https://petosdirectory.com`

  return `https://petosdirectory.com/${cityMeta.stateSlug}/${cityMeta.citySlug}/${provider.category}/${provider.slug}`
}

function formatHours(
  hours: Provider['hours']
): Record<string, string> | null {
  if (!hours) return null

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const formatted: Record<string, string> = {}

  for (const day of days) {
    const h = hours[day]
    if (!h) continue
    formatted[day] = h.closed ? 'Closed' : `${h.open} – ${h.close}`
  }

  return formatted
}

export function registerGetProvider(server: McpServer): void {
  server.tool(
    'get_provider',
    'Get full details for a single pet service provider by their unique slug. Returns all available info including address, phone, hours, description, services, and a direct link to their PetOS profile.',
    {
      slug: z
        .string()
        .describe(
          'The provider\'s unique slug, e.g. "happy-paws-veterinary-tampa". Obtain from search_providers results.'
        ),
    },
    async ({ slug }) => {
      const db = getSupabaseClient()

      const { data, error } = await db
        .from('providers')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Provider not found with slug: "${slug}". Use search_providers to find valid slugs.`,
            },
          ],
          isError: true,
        }
      }

      const provider = data as Provider
      const categoryMeta = CATEGORIES.find((c) => c.slug === provider.category)

      const result = {
        name: provider.business_name,
        slug: provider.slug,
        category: {
          slug: provider.category,
          label: categoryMeta?.label ?? provider.category,
          description: categoryMeta?.description ?? null,
        },
        address: provider.address,
        city: provider.city,
        state: provider.state,
        zip: provider.zip ?? null,
        phone: provider.phone ?? null,
        website: provider.website ?? null,
        rating: provider.rating ?? null,
        review_count: provider.review_count,
        description: provider.description ?? null,
        services: provider.services ?? [],
        hours: formatHours(provider.hours),
        emergency: provider.emergency,
        verified: provider.verified,
        hero_image: provider.hero_image ?? null,
        url: buildProviderUrl(provider),
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
}
