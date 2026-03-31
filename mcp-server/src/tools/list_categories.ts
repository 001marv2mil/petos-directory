import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { CATEGORIES } from '../constants.js'

export function registerListCategories(server: McpServer): void {
  server.tool(
    'list_categories',
    'List all pet service categories available in PetOS Directory. Returns category slugs to use with search_providers.',
    {},
    async () => {
      const categories = CATEGORIES.map((c) => ({
        slug: c.slug,
        label: c.label,
        plural_label: c.pluralLabel,
        description: c.description,
      }))

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                total: categories.length,
                categories,
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
