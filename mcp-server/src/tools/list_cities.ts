import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { CITIES } from '../constants.js'

export function registerListCities(server: McpServer): void {
  server.tool(
    'list_cities',
    'List all cities supported by PetOS Directory. Use this to find the correct city name before calling search_providers.',
    {},
    async () => {
      const cities = CITIES.map((c) => ({
        city: c.city,
        state: c.state,
        stateAbbr: c.stateAbbr,
        slug: c.citySlug,
        url: `https://petosdirectory.com/${c.stateSlug}/${c.citySlug}`,
      }))

      // Group by state for readability
      const byState: Record<string, typeof cities> = {}
      for (const city of cities) {
        if (!byState[city.state]) byState[city.state] = []
        byState[city.state].push(city)
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: cities.length,
                cities_by_state: byState,
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
