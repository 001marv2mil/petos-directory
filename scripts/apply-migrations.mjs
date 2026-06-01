/**
 * One-shot migration runner for the new Supabase project.
 *
 * Reads supabase/migrations/*.sql in filename order and executes each
 * inside a single transaction per file. Existing migrations history is
 * NOT tracked here — this script is meant for fresh DB recreation only.
 *
 * Usage (from petos-directory/):
 *   node --env-file=.env.local scripts/apply-migrations.mjs
 *
 * Reads DATABASE_URL from env. Connection string format:
 *   postgresql://postgres.<ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.resolve(__dirname, '..', 'supabase', 'migrations')

const conn = process.env.DATABASE_URL
if (!conn || conn.includes('[YOUR-PASSWORD]')) {
  console.error('DATABASE_URL is missing or unresolved.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()

console.log(`Found ${files.length} migration files in ${migrationsDir}\n`)

let ok = 0
let failed = 0

await client.connect()
console.log('Connected.\n')

try {
  for (const f of files) {
    const full = path.join(migrationsDir, f)
    const sql = fs.readFileSync(full, 'utf-8')
    process.stdout.write(`  ${f.padEnd(60)} ... `)
    try {
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('COMMIT')
      console.log('ok')
      ok++
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {})
      console.log(`FAIL: ${err.message}`)
      failed++
    }
  }
} finally {
  await client.end()
}

console.log(`\nDone. ${ok} applied, ${failed} failed.`)
process.exit(failed > 0 ? 1 : 0)
