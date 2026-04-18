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
const ADMIN_EMAILS = ['petosdirectory@gmail.com', '001marv2mil@gmail.com', 'malak@petosdirectory.com']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Verify admin
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.slice(7)
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData.user) return res.status(401).json({ error: 'Invalid token' })
  if (!ADMIN_EMAILS.includes(userData.user.email?.toLowerCase() ?? '')) {
    return res.status(403).json({ error: 'Not an admin' })
  }

  const { claim_id, provider_updates } = req.body || {}
  if (!claim_id) return res.status(400).json({ error: 'Missing claim_id' })

  // Get the claim
  const { data: claim, error: claimError } = await supabase
    .from('claim_requests')
    .select('*')
    .eq('id', claim_id)
    .single()

  if (claimError || !claim) return res.status(404).json({ error: 'Claim not found' })
  if (claim.status !== 'pending') return res.status(400).json({ error: 'Claim already processed' })

  // Mark claim approved
  await supabase
    .from('claim_requests')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: userData.user.email ?? null,
    })
    .eq('id', claim_id)

  // Apply any admin-edited provider fields (description, address, category, phone, website)
  // Whitelist explicitly to prevent updating slug, id, ratings, etc.
  const ALLOWED_FIELDS = ['description', 'address', 'category', 'phone', 'website'] as const
  const cleanedUpdates: Record<string, string | null> = {}
  if (provider_updates && typeof provider_updates === 'object') {
    for (const key of ALLOWED_FIELDS) {
      const val = (provider_updates as Record<string, unknown>)[key]
      if (typeof val === 'string') {
        const trimmed = val.trim()
        cleanedUpdates[key] = trimmed === '' ? null : trimmed
      }
    }
  }

  // Link provider to owner's email + mark as verified + apply any field updates
  await supabase
    .from('providers')
    .update({
      claimed_by_email: claim.owner_email.toLowerCase().trim(),
      claimed_at: new Date().toISOString(),
      verified: true,
      ...cleanedUpdates,
    })
    .eq('id', claim.provider_id)

  // Get provider for email
  const { data: provider } = await supabase
    .from('providers')
    .select('business_name, slug, city, state')
    .eq('id', claim.provider_id)
    .single()

  // Send approval email to business owner
  try {
    await resend.emails.send({
      from: 'Malak from PetOS Directory <malak@petosdirectory.com>',
      replyTo: 'info@petoshealth.com',
      to: claim.owner_email,
      subject: `${claim.business_name} — your listing is approved`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#374151;">
          <p style="font-size:15px;line-height:1.6;">Hi ${claim.owner_name.split(' ')[0]},</p>
          <p style="font-size:15px;line-height:1.6;">
            Good news — your claim for <strong>${claim.business_name}</strong> has been approved.
          </p>
          <p style="font-size:15px;line-height:1.6;">
            You can now log in to your business dashboard to update photos, hours, your description, and add a special offer:
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="${SITE}/dashboard" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
              Open Business Dashboard
            </a>
          </p>
          <p style="font-size:14px;line-height:1.6;color:#6b7280;">
            Sign in with <strong>${claim.owner_email}</strong> — if you haven't set a password yet, click "Sign in" and use the magic link or create a password.
          </p>
          <p style="font-size:15px;line-height:1.6;margin-top:24px;">— Malak<br/>PetOS Directory</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send approval email:', err)
  }

  return res.status(200).json({ ok: true, provider_slug: provider?.slug })
}
