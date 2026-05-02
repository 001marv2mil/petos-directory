import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const ADMIN_EMAIL = 'info@petosdirectory.com'
const FROM_EMAIL = 'PetOS Directory <noreply@petosdirectory.com>'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, owner_name, owner_email, owner_phone, role, message } = req.body

  if (!slug || !owner_name || !owner_email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Look up provider
  const { data: provider, error: lookupErr } = await supabase
    .from('providers')
    .select('id, business_name')
    .eq('slug', slug)
    .single()

  if (lookupErr || !provider) {
    return res.status(404).json({ error: 'Listing not found' })
  }

  // Insert claim request
  const { error: insertErr } = await supabase.from('claim_requests').insert({
    provider_id: provider.id,
    business_name: provider.business_name,
    owner_name,
    owner_email,
    owner_phone: owner_phone || null,
    role,
    message: message || null,
  })

  if (insertErr) {
    return res.status(500).json({ error: 'Failed to submit claim' })
  }

  // Send confirmation email to claimant
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: owner_email,
      subject: `Claim received for ${provider.business_name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 20px; color: #111827; margin: 0;">PetOS Directory</h1>
          </div>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${owner_name},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            We received your claim request for <strong>${provider.business_name}</strong>.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #166534; font-size: 14px; margin: 0;"><strong>What happens next:</strong></p>
            <ul style="color: #166534; font-size: 14px; padding-left: 20px; margin: 8px 0 0;">
              <li>We'll verify your ownership within 1-2 business days</li>
              <li>You'll get an email once approved</li>
              <li>Then you can update hours, photos, and your profile</li>
            </ul>
          </div>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Thank you for claiming your listing. Verified businesses get a trust badge and appear higher in search results.
          </p>
          <p style="color: #6b7280; font-size: 13px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            PetOS Directory — Trusted pet services near you<br/>
            <a href="https://petosdirectory.com" style="color: #16a34a;">petosdirectory.com</a>
          </p>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Failed to send confirmation email:', emailErr)
  }

  // Send admin notification
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New claim: ${provider.business_name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; padding: 16px;">
          <h2 style="font-size: 18px; color: #111827;">New Claim Request</h2>
          <table style="width: 100%; font-size: 14px; color: #374151; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: 600;">Business:</td><td>${provider.business_name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Name:</td><td>${owner_name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Email:</td><td><a href="mailto:${owner_email}">${owner_email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Phone:</td><td>${owner_phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Role:</td><td>${role}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Message:</td><td>${message || 'None'}</td></tr>
          </table>
          <p style="margin-top: 16px;">
            <a href="https://petosdirectory.com/provider/${slug}" style="color: #16a34a;">View listing</a>
          </p>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Failed to send admin notification:', emailErr)
  }

  return res.status(200).json({ success: true })
}
