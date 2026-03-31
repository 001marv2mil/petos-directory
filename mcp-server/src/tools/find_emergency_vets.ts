import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getSupabaseClient, type Provider } from '../db.js'
import { CITIES } from '../constants.js'

function buildProviderUrl(provider: Provider): string {
  const cityMeta = CITIES.find(
    (c) => c.city.toLowerCase() === provider.city.toLowerCase()
  )
  if (!cityMeta) return `https://petosdirectory.com`

  return `https://petosdirectory.com/${cityMeta.stateSlug}/${cityMeta.citySlug}/emergency_vets/${provider.slug}`
}

export function registerFindEmergencyVets(server: McpServer): void {
  server.tool(
    'find_emergency_vets',
    'Find 24/7 emergency veterinary clinics near a specific city. Use this when someone has a pet emergency and needs immediate care.',
    {
      city: z
        .string()
        .describe('City name to search for emergency vets, e.g. "Tampa"'),
    },
    async ({ city }) => {
      const db = getSupabaseClient()

      // Search the requested city first, then fallback to emergency flag
      const { data, error } = await db
        .from('providers')
        .select(
          'id, slug, business_name, category, address, city, state, phone, website, rating, review_count, emergency, verified, hours'
        )
        .ilike('city', city)
        .eq('category', 'emergency_vets')
        .order('rating', { ascending: false })
        .limit(10)

      if (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching emergency vets: ${error.message}`,
            },
          ],
          isError: true,
        }
      }

      // Also grab any providers with emergency=true in that city (across all categories)
      const { data: emergencyFlagged } = await db
        .from('providers')
        .select(
          'id, slug, business_name, category, address, city, state, phone, website, rating, review_count, emergency, verified, hours'
        )
        .ilike('city', city)
        .eq('emergency', true)
        .neq('category', 'emergency_vets') // avoid duplicates
        .order('rating', { ascending: false })
        .limit(5)

      const allProviders = [
        ...(data ?? []),
        ...(emergencyFlagged ?? []),
      ] as Provider[]

      if (allProviders.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No emergency vets found in ${city}. In a life-threatening emergency, call your nearest animal hospital or the ASPCA Poison Control hotline at (888) 426-4435.`,
            },
          ],
        }
      }

      const results = allProviders.map((p) => ({
        name: p.business_name,
        slug: p.slug,
        address: p.address,
        city: p.city,
        state: p.state,
        phone: p.phone ?? null,
        rating: p.rating ?? null,
        emergency_24_7: p.emergency,
        url: buildProviderUrl(p),
      }))

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                city,
                emergency_clinics_found: results.length,
                important: 'Call ahead to confirm hours before visiting.',
                aspca_poison_control: '(888) 426-4435',
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
