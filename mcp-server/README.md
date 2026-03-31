# PetOS Directory MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants direct access to the PetOS Directory database — real pet service listings across 164 US cities.

When connected, Claude, Cursor, or any MCP-compatible AI can answer questions like:
- *"Find me a vet in Tampa"*
- *"Are there any 24/7 emergency animal hospitals in Austin?"*
- *"What dog groomers are in Denver?"*

---

## Tools

| Tool | Description |
|------|-------------|
| `search_providers` | Search for pet service providers by city, category, and optional keyword |
| `get_provider` | Get full details for a single provider by slug |
| `list_cities` | List all 164 supported US cities |
| `list_categories` | List all 7 service categories with slugs |
| `find_emergency_vets` | Find 24/7 emergency vet clinics near a city |

### Categories

- `veterinarians` — Routine checkups, vaccinations, general health care
- `emergency_vets` — 24/7 emergency and critical care animal hospitals
- `groomers` — Bathing, haircuts, nail trims, full grooming
- `boarding` — Overnight and extended stays
- `daycare` — Supervised daytime play and socialization
- `trainers` — Obedience training, behavioral correction, puppy classes
- `pet_pharmacies` — Prescription medications and supplements

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |

---

## Install in Claude Desktop

1. Open Claude Desktop → **Settings** → **Developer** → **Edit Config**

2. Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "petos-directory": {
      "command": "npx",
      "args": ["-y", "@petosdirectory/mcp-server"],
      "env": {
        "SUPABASE_URL": "your-supabase-url",
        "SUPABASE_ANON_KEY": "your-supabase-anon-key"
      }
    }
  }
}
```

3. Restart Claude Desktop. You should see the PetOS tools available.

### Run from local source

If you've cloned this repo:

```json
{
  "mcpServers": {
    "petos-directory": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "your-supabase-url",
        "SUPABASE_ANON_KEY": "your-supabase-anon-key"
      }
    }
  }
}
```

---

## Install in Cursor

1. Open **Cursor Settings** → **MCP**
2. Click **Add new MCP server**
3. Enter:
   - **Name:** `petos-directory`
   - **Type:** `command`
   - **Command:** `npx -y @petosdirectory/mcp-server`
4. Add environment variables:
   - `SUPABASE_URL` → your Supabase URL
   - `SUPABASE_ANON_KEY` → your Supabase anon key
5. Save and restart Cursor.

---

## Install in VS Code (with MCP extension)

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "petos-directory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@petosdirectory/mcp-server"],
      "env": {
        "SUPABASE_URL": "${env:SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${env:SUPABASE_ANON_KEY}"
      }
    }
  }
}
```

---

## Submit to Smithery

[Smithery](https://smithery.ai) is the MCP registry — submitting here makes the server discoverable by all MCP clients.

1. Make sure the server is published to npm:
   ```bash
   cd mcp-server
   npm publish --access public
   ```

2. Go to [smithery.ai/new](https://smithery.ai/new)

3. Enter:
   - **Package name:** `@petosdirectory/mcp-server`
   - **Description:** Find trusted pet services across 164 US cities
   - **Category:** Productivity / Local

4. Add the `smithery.yaml` config file (see below)

### `smithery.yaml`

Create this file in `mcp-server/`:

```yaml
name: PetOS Directory
description: Find trusted pet service providers — vets, groomers, boarding, and more — across 164 US cities.
tools:
  - name: search_providers
    description: Search for pet service providers by city and category
  - name: get_provider
    description: Get full details for a single provider
  - name: list_cities
    description: List all supported US cities
  - name: list_categories
    description: List all service categories
  - name: find_emergency_vets
    description: Find emergency vet clinics near a city
config:
  env:
    SUPABASE_URL:
      description: Supabase project URL
      required: true
    SUPABASE_ANON_KEY:
      description: Supabase anon public key
      required: true
```

---

## Local Development

```bash
cd mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run in dev mode (no build step)
SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector dist/index.js
```

---

## Example Interactions

**User:** Find me a vet in Tampa
**Claude:** *(calls `search_providers` with city="Tampa", category="veterinarians")*
→ Returns top-rated vets with addresses, phones, and direct PetOS links

**User:** My dog ate chocolate — I need an emergency vet in Miami now
**Claude:** *(calls `find_emergency_vets` with city="Miami")*
→ Returns emergency clinics with phone numbers + ASPCA Poison Control

**User:** What cities does PetOS cover?
**Claude:** *(calls `list_cities`)*
→ Returns all 164 cities grouped by state

---

## Links

- **PetOS Directory:** [petosdirectory.com](https://petosdirectory.com)
- **MCP Docs:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Smithery Registry:** [smithery.ai](https://smithery.ai)
