import pg from 'pg'

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

const r = await c.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
)
console.log('Tables in public schema:')
for (const row of r.rows) console.log('  - ' + row.table_name)

const counts = await c.query("SELECT count(*)::int AS n FROM providers")
console.log('\nproviders rows:', counts.rows[0].n)

await c.end()
