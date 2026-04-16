/**
 * Render a preview of the new dual-CTA Email #1 to a local HTML file.
 * Pulls a real provider from Supabase and writes preview to preview-email1.html.
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE = 'https://petosdirectory.com'
const FEATURED_URL = 'https://buy.stripe.com/fZu00jeJLblfecd4tg04802'

const CATEGORY_LABELS: Record<string, string> = {
  veterinarians: 'veterinarian', emergency_vets: 'emergency vet', groomers: 'pet groomer',
  boarding: 'pet boarding facility', daycare: 'dog daycare', trainers: 'pet trainer',
  pet_pharmacies: 'pet pharmacy',
}

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

function render(p: any): string {
  const listingUrl = `${SITE}/provider/${p.slug}`
  const claimUrl = `${SITE}/claim/${p.slug}?name=${encodeURIComponent(p.business_name)}`
  const catLabel = CATEGORY_LABELS[p.category] || 'pet service'
  const ratingLine = p.rating && p.review_count
    ? `<p style="color:#374151;font-size:14px;">Your listing shows a <strong>${p.rating}/5 rating</strong> from ${p.review_count} reviews — that's great social proof for pet owners searching in ${p.city}.</p>`
    : ''
  const base = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">`
  const footer = `
    <p style="font-size:13px;color:#9ca3af;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
      PetOS Directory — Trusted pet services near you<br/>
      <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a><br/><br/>
      <a href="${SITE}/unsubscribe?email=preview" style="color:#9ca3af;font-size:12px;">Unsubscribe</a>
    </p></div>`

  return `${base}
    <p style="font-size:15px;line-height:1.6;">Hi there,</p>
    <p style="font-size:15px;line-height:1.6;">
      We just added <strong>${p.business_name}</strong> to
      <a href="${SITE}" style="color:#16a34a;">petosdirectory.com</a> — a free
      directory helping pet owners find trusted ${catLabel}s in ${p.city}, ${p.state}.
    </p>
    <p style="font-size:15px;line-height:1.6;">
      Your listing is live here:
      <a href="${listingUrl}" style="color:#16a34a;">${listingUrl}</a>
    </p>
    ${ratingLine}
    <p style="font-size:15px;line-height:1.6;">
      No action needed — it's completely free. If you'd like to update your hours,
      add photos, or include a special offer, you can claim it here:
    </p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${claimUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Claim Your Listing (Free)
      </a>
    </p>

    <div style="border-top:1px solid #e5e7eb;margin:28px 0;padding-top:24px;">
      <p style="font-size:15px;line-height:1.6;font-weight:600;color:#111827;">
        Want to stand out from other ${catLabel}s in ${p.city}?
      </p>
      <p style="font-size:14px;line-height:1.6;color:#374151;">
        Featured businesses get <strong>top placement</strong>, a highlighted card
        with photo, and <strong>priority in search results</strong> across the directory.
      </p>
      <p style="text-align:center;margin:20px 0;">
        <a href="${FEATURED_URL}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Get Featured — $99/mo
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280;text-align:center;">
        Cancel anytime. Your basic listing stays free, always.
      </p>
    </div>

    <p style="font-size:15px;line-height:1.6;">Best,<br/>Malak<br/>PetOS Directory</p>
  ${footer}`
}

;(async () => {
  // Pick a realistic provider with contact_email + slug + rating
  const { data } = await sb
    .from('providers')
    .select('id, business_name, city, state, category, slug, rating, review_count, contact_email')
    .not('contact_email', 'is', null)
    .not('slug', 'is', null)
    .not('rating', 'is', null)
    .limit(1)
  if (!data || data.length === 0) { console.error('no sample provider found'); process.exit(1) }
  const p = data[0]
  const subject = `${p.business_name} is now on petosdirectory.com`
  const html = render(p)
  const full = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Preview: ${subject}</title>
<style>body{background:#f3f4f6;margin:0;padding:20px;font-family:-apple-system,sans-serif}
.meta{max-width:560px;margin:0 auto 16px;padding:12px 16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;color:#6b7280}
.email{background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)}</style></head>
<body>
<div class="meta">
  <strong>Subject:</strong> ${subject}<br/>
  <strong>Sample provider:</strong> ${p.business_name} (${p.city}, ${p.state}) — ${p.category}<br/>
  <strong>Rating:</strong> ${p.rating}/5 (${p.review_count} reviews)
</div>
<div class="email">${html}</div>
</body></html>`

  const outPath = resolve('preview-email1.html')
  writeFileSync(outPath, full)
  console.log('Preview written to:', outPath)
  console.log('Subject:', subject)
  console.log('Sample:', p.business_name, '—', p.city, p.state)
})().catch(e => { console.error(e); process.exit(1) })
