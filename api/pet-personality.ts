/**
 * Pet Personality Quiz endpoint.
 *
 * POST /api/pet-personality
 * Body: { email, state, petType, friendliness, energy, vetBehavior, zip }
 *
 * - Determines archetype from quiz answers
 * - Picks 3 best-matched providers in their state (city-preferred)
 * - Saves email + answers to newsletter_signups
 * - Sends results email via Resend
 * - Returns { archetype, emoji, description, providers } for on-page display
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)
const resend = new Resend(process.env.RESEND_API_KEY!)

const SITE = 'https://petosdirectory.com'
const FROM = 'PetOS Directory <malak@petosdirectory.com>'
const REPLY_TO = 'support@petoshealth.com'

interface Archetype {
  name: string
  emoji: string
  description: string
  preferredCategories: string[] // categories to surface for this personality
}

const ARCHETYPES: Record<string, Archetype> = {
  'Chaos Goblin': {
    name: 'Chaos Goblin',
    emoji: '🚀',
    description: 'High energy, never stops, lives at full throttle. Needs a structured outlet (training + daycare) and a vet who handles excitable pets without getting flustered.',
    preferredCategories: ['trainers', 'daycare', 'veterinarians'],
  },
  'Guardian': {
    name: 'Guardian',
    emoji: '🛡️',
    description: 'Cautious, protective, slow to trust. Needs a vet and groomer with experience handling reactive pets — calm environments, patient staff, no rushed handoffs.',
    preferredCategories: ['trainers', 'veterinarians', 'groomers'],
  },
  'Royal Lounger': {
    name: 'Royal Lounger',
    emoji: '😴',
    description: 'Chill, low-maintenance, lives a regal life of naps and snacks. The ideal candidate for a relaxed primary vet and occasional grooming.',
    preferredCategories: ['veterinarians', 'groomers', 'pet_pharmacies'],
  },
  'Anxious Athlete': {
    name: 'Anxious Athlete',
    emoji: '🏃',
    description: "Bursting with energy but stresses out at the vet. Needs Fear-Free certified vets, low-stress handling, and a high-energy outlet like daycare or trainer-led activity.",
    preferredCategories: ['veterinarians', 'trainers', 'daycare'],
  },
  'Social Butterfly': {
    name: 'Social Butterfly',
    emoji: '🥰',
    description: 'Loves people, loves attention, thrives in crowds. Easy match for any vet, groomer, or daycare in your area.',
    preferredCategories: ['veterinarians', 'groomers', 'daycare'],
  },
  'Easygoing Companion': {
    name: 'Easygoing Companion',
    emoji: '🐾',
    description: 'Adaptable and sweet — fits in just about anywhere. A balanced match with a primary vet, occasional grooming, and reliable boarding for trips.',
    preferredCategories: ['veterinarians', 'groomers', 'boarding'],
  },
}

function computeArchetype(a: any): Archetype {
  if (a.energy === 'nonstop') return ARCHETYPES['Chaos Goblin']
  if (a.friendliness === 'reactive') return ARCHETYPES['Guardian']
  if (a.energy === 'couch' && (a.vetBehavior === 'fine' || a.vetBehavior === 'tolerates')) return ARCHETYPES['Royal Lounger']
  if (a.energy === 'high' && (a.vetBehavior === 'stressed' || a.vetBehavior === 'meltdown')) return ARCHETYPES['Anxious Athlete']
  if (a.friendliness === 'loves' && a.vetBehavior === 'fine') return ARCHETYPES['Social Butterfly']
  return ARCHETYPES['Easygoing Companion']
}

function whyMatch(category: string, archetype: Archetype): string {
  const c = category.replace('_', ' ')
  const a = archetype.name
  if (a === 'Chaos Goblin') {
    if (category === 'trainers') return 'Top-rated trainer who can channel that nonstop energy into focus.'
    if (category === 'daycare') return 'Daycare so they burn off energy without destroying your house.'
    if (category === 'veterinarians') return 'A vet experienced with high-energy, hard-to-restrain pets.'
  }
  if (a === 'Guardian') {
    if (category === 'trainers') return 'Reactive-dog specialist for slow, trust-building work.'
    if (category === 'veterinarians') return 'Calm, low-stress handler — no rushed pokes.'
    if (category === 'groomers') return 'Patient groomer experienced with shy or protective pets.'
  }
  if (a === 'Royal Lounger') {
    if (category === 'veterinarians') return 'Easy primary care for routine wellness — your pet will barely notice.'
    if (category === 'groomers') return 'Pampering groomer for the occasional spa day.'
  }
  if (a === 'Anxious Athlete') {
    if (category === 'veterinarians') return 'Fear-Free or low-stress practice — gentle on anxious pets.'
    if (category === 'trainers') return 'Trainer who burns energy and builds calm-under-pressure skills.'
    if (category === 'daycare') return 'Active daycare so they tire out and stress less at home.'
  }
  if (a === 'Social Butterfly') {
    if (category === 'veterinarians') return 'Top-rated vet — your pet will love everyone there.'
    if (category === 'groomers') return 'Highly-rated groomer for a happy, tail-wagging spa day.'
    if (category === 'daycare') return 'Social daycare — they\'ll be the most popular pup there.'
  }
  return `Top-rated ${c} in your area, well suited to your pet.`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const body = req.body || {}
  const { email, state, petType, friendliness, energy, vetBehavior, zip } = body

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  if (!state || typeof state !== 'string') return res.status(400).json({ error: 'State required' })
  if (!petType || !friendliness || !energy || !vetBehavior) {
    return res.status(400).json({ error: 'Quiz answers incomplete' })
  }

  const cleanEmail = email.toLowerCase().trim()
  const cleanState = state.trim().toUpperCase().slice(0, 2)
  const cleanZip = typeof zip === 'string' ? zip.replace(/\D/g, '').slice(0, 5) : ''

  const archetype = computeArchetype({ petType, friendliness, energy, vetBehavior })

  // Save signup
  await supabase.from('newsletter_signups').upsert(
    {
      email: cleanEmail,
      state: cleanState,
      city: null,
      category: archetype.preferredCategories[0],
      source: 'pet_personality_quiz',
      referrer_slug: `archetype:${archetype.name}|pet:${petType}|energy:${energy}|zip:${cleanZip}`,
      status: 'active',
    },
    { onConflict: 'email' }
  )

  // Find providers — one from each preferred category, in their state, top-rated
  const providers: any[] = []
  for (const cat of archetype.preferredCategories) {
    if (providers.length >= 3) break
    const { data } = await supabase
      .from('providers')
      .select('business_name, category, address, city, state, rating, slug')
      .eq('state', cleanState)
      .eq('category', cat)
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(1)
    if (data?.[0] && !providers.find(p => p.slug === data[0].slug)) {
      providers.push({ ...data[0], why: whyMatch(cat, archetype) })
    }
  }
  // Fallback: top 3 highest rated in their state if we couldn't get 3 from preferred categories
  if (providers.length < 3) {
    const { data } = await supabase
      .from('providers')
      .select('business_name, category, address, city, state, rating, slug')
      .eq('state', cleanState)
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(10)
    for (const p of data || []) {
      if (providers.length >= 3) break
      if (!providers.find(x => x.slug === p.slug)) {
        providers.push({ ...p, why: whyMatch(p.category, archetype) })
      }
    }
  }

  // Build email
  const providerHtml = providers.map((p, i) => `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;">
      <div style="font-size:11px;color:#92400e;font-weight:700;letter-spacing:1px;">MATCH #${i + 1}</div>
      <div style="font-size:16px;font-weight:700;color:#111;margin-top:6px;">${escape(p.business_name)}</div>
      <div style="font-size:13px;color:#6b7280;margin-top:2px;text-transform:capitalize;">${escape(p.category.replace('_',' '))} · ${escape(p.city)}, ${escape(p.state)}</div>
      ${p.rating ? `<div style="font-size:13px;color:#92400e;margin-top:4px;">⭐ ${p.rating.toFixed(1)}</div>` : ''}
      <div style="font-size:13px;color:#374151;font-style:italic;margin-top:8px;">→ ${escape(p.why)}</div>
      <a href="${SITE}/provider/${p.slug}" style="display:inline-block;margin-top:10px;font-size:13px;color:#2563eb;text-decoration:none;font-weight:600;">View listing →</a>
    </div>
  `).join('')

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">
  <div style="text-align:center;padding:24px;background:linear-gradient(135deg,#fef3c7,#fed7aa);border-radius:14px;margin-bottom:20px;">
    <div style="font-size:48px;line-height:1;margin-bottom:8px;">${archetype.emoji}</div>
    <div style="font-size:11px;color:#92400e;font-weight:700;letter-spacing:1.5px;">YOUR PET IS A</div>
    <div style="font-size:28px;color:#111;font-weight:700;margin-top:4px;">${escape(archetype.name)}</div>
  </div>

  <p style="font-size:15px;line-height:1.6;color:#374151;">${escape(archetype.description)}</p>

  <h3 style="font-size:16px;color:#111;margin-top:28px;margin-bottom:12px;">Your top 3 perfect matches in ${escape(cleanState)}</h3>
  ${providerHtml || '<p style="color:#6b7280;font-size:14px;">We don\'t have provider listings in your state yet. Search the directory at <a href="' + SITE + '" style="color:#2563eb;">petosdirectory.com</a>.</p>'}

  <p style="font-size:13px;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
    More tips for ${escape(archetype.name)}-style pets coming soon.<br/>
    Browse the full directory: <a href="${SITE}" style="color:#2563eb;">petosdirectory.com</a><br/><br/>
    <a href="${SITE}/unsubscribe?email=${encodeURIComponent(cleanEmail)}" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
  </p>
</div>
`

  try {
    await resend.emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: cleanEmail,
      subject: `${archetype.emoji} Your pet is a ${archetype.name} — meet your matches`,
      html,
      tags: [
        { name: 'campaign', value: 'pet_personality_quiz' },
        { name: 'archetype', value: archetype.name.toLowerCase().replace(/\s+/g, '_') },
        { name: 'pet_type', value: String(petType) },
        { name: 'state', value: cleanState.toLowerCase() },
      ],
    })
  } catch (err: any) {
    console.error('Personality email send error:', err.message)
  }

  return res.status(200).json({
    archetype: archetype.name,
    emoji: archetype.emoji,
    description: archetype.description,
    providers,
  })
}

function escape(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
