import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

;(async () => {
  // Pull all providers' contact_email in pages
  const PAGE = 1000
  let all: { id: string, contact_email: string | null, business_name: string, city: string, state: string }[] = []
  let offset = 0
  while (true) {
    const { data, error } = await sb.from('providers').select('id, contact_email, business_name, city, state').range(offset, offset + PAGE - 1)
    if (error) { console.error(error); process.exit(1) }
    if (!data || data.length === 0) break
    all = all.concat(data as any)
    if (data.length < PAGE) break
    offset += PAGE
  }
  console.log('Total providers:', all.length)

  const withEmail = all.filter(p => p.contact_email && p.contact_email.trim())
  const withoutEmail = all.length - withEmail.length
  console.log('With contact_email:', withEmail.length)
  console.log('Without contact_email (NULL/empty):', withoutEmail)

  // Normalize + dedupe
  const norm = (e: string) => e.toLowerCase().trim()
  const emailMap = new Map<string, typeof withEmail>()
  for (const p of withEmail) {
    const k = norm(p.contact_email!)
    if (!emailMap.has(k)) emailMap.set(k, [])
    emailMap.get(k)!.push(p)
  }
  console.log('Unique emails (case-insensitive):', emailMap.size)
  console.log('Duplicate email rows:', withEmail.length - emailMap.size)

  // Placeholder filter
  const PLACEHOLDER = [/^info@domain\.com$/i,/^user@domain\.com$/i,/^example@/i,/^test@test\./i,/^filler@/i,/^noreply@/i,/^no-reply@/i,/^donotreply@/i,/^yourname@/i,/^name@/i,/^email@/i,/^sample@/i,/^placeholder@/i]
  const CHAIN = ['enroll@petco.com','info@petsmart.com','info@banfield.com','info@dogtopia.com']
  let placeholder = 0, chain = 0
  for (const [e] of emailMap) {
    if (CHAIN.includes(e)) chain++
    else if (PLACEHOLDER.some(p => p.test(e)) || e.includes('@example.') || e.includes('@domain.')) placeholder++
  }
  console.log('Placeholder/invalid emails:', placeholder)
  console.log('Chain emails (PetSmart/Banfield/etc):', chain)
  console.log('Usable unique emails:', emailMap.size - placeholder - chain)

  // Top duplicate offenders
  const dups = Array.from(emailMap.entries()).filter(([, rows]) => rows.length > 1).sort((a, b) => b[1].length - a[1].length).slice(0, 15)
  console.log('\nTop duplicate emails (one email, many listings):')
  for (const [e, rows] of dups) {
    console.log(`  ${rows.length}×  ${e}`)
  }
})().catch(e => { console.error(e); process.exit(1) })
