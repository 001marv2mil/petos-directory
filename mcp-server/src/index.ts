#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerSearchProviders } from './tools/search_providers.js'
import { registerGetProvider } from './tools/get_provider.js'
import { registerListCities } from './tools/list_cities.js'
import { registerListCategories } from './tools/list_categories.js'
import { registerFindEmergencyVets } from './tools/find_emergency_vets.js'

const server = new McpServer({
  name: 'petos-directory',
  version: '1.0.0',
})

// Register all tools
registerSearchProviders(server)
registerGetProvider(server)
registerListCities(server)
registerListCategories(server)
registerFindEmergencyVets(server)

// Connect via stdio (standard for Claude Desktop / Cursor / Smithery)
const transport = new StdioServerTransport()
await server.connect(transport)
