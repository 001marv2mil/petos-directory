/**
 * Renders every lead magnet email to a local HTML file you can preview.
 * Output goes to public/lead-magnet-previews/ which is git-ignored.
 *
 * Run: npx tsx scripts/preview-magnets.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { MAGNETS, type Magnet } from '../src/data/lead-magnets'

const SITE = 'https://petosdirectory.com'
const HEALTH = 'https://petoshealth.com'
const SAMPLE = { name: 'Brandon Pet Hospital', city: 'Brandon', state: 'FL' }

function escape(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderEmail(magnet: Magnet): string {
  const sectionsHtml = magnet.sections.map(s => `
    <div style="margin-top:20px;">
      <h3 style="font-size:15px;color:#111;margin:0 0 8px 0;font-weight:700;">${escape(s.heading)}</h3>
      <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.65;color:#374151;">
        ${s.bullets.map(b => `<li style="margin-bottom:6px;">${escape(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escape(magnet.emailSubject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:620px;margin:0 auto;padding:32px 16px;color:#374151;background:#fff;">
  <p style="text-align:center;font-size:11px;color:#9ca3af;margin:0 0 12px 0;">📧 EMAIL PREVIEW · This is what lands in the recipient's inbox</p>
  <div style="background:linear-gradient(135deg,#fef3c7,#fed7aa);border-radius:14px;padding:24px;margin-bottom:24px;">
    <div style="font-size:11px;color:#92400e;font-weight:700;letter-spacing:1.5px;">PETOS DIRECTORY · FREE FOR PET OWNERS</div>
    <h1 style="font-size:26px;color:#111;margin:8px 0 0 0;font-weight:800;line-height:1.2;">${escape(magnet.emailHeadline)}</h1>
    <p style="font-size:12px;color:#9ca3af;margin:6px 0 0 0;">You requested this on the listing for <strong>${SAMPLE.name}</strong> in ${SAMPLE.city}, ${SAMPLE.state}.</p>
  </div>
  <p style="font-size:15px;line-height:1.65;color:#374151;margin:0 0 8px 0;">${escape(magnet.emailIntro)}</p>
  ${sectionsHtml}
  <div style="margin-top:32px;padding:20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
    <div style="font-size:11px;color:#1d4ed8;font-weight:700;letter-spacing:1.5px;">WANT THIS AUTOMATED?</div>
    <h3 style="font-size:18px;color:#111;margin:6px 0 8px 0;font-weight:700;">PetOS Health does this for every visit, every pet.</h3>
    <p style="font-size:14px;line-height:1.6;color:#1e3a8a;margin:0 0 12px 0;">
      Track vaccines, store records, schedule vet visits, get AI symptom checks, and never lose a piece of your pet's health history again. All in one app.
    </p>
    <a href="${HEALTH}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;">Try PetOS Health free →</a>
  </div>
  <p style="font-size:13px;color:#9ca3af;margin-top:28px;border-top:1px solid #e5e7eb;padding-top:16px;line-height:1.6;">
    Browse the full directory: <a href="${SITE}" style="color:#2563eb;">petosdirectory.com</a><br/>
    Reply to this email if you have questions. A real person reads every reply.
  </p>
</div>
</body></html>`
}

const outDir = join(process.cwd(), 'public', 'lead-magnet-previews')
mkdirSync(outDir, { recursive: true })

const links: string[] = []
for (const [category, magnet] of Object.entries(MAGNETS)) {
  writeFileSync(join(outDir, `${category}.html`), renderEmail(magnet), 'utf8')
  links.push(`
    <li style="margin-bottom:12px;padding:16px 20px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
      <a href="/lead-magnet-previews/${category}.html" style="font-size:17px;font-weight:700;color:#2563eb;text-decoration:none;">${escape(magnet.title)} →</a>
      <div style="font-size:13px;color:#6b7280;margin-top:6px;">Category: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${category}</code></div>
      <div style="font-size:13px;color:#6b7280;margin-top:4px;">Subject: <em>${escape(magnet.emailSubject)}</em></div>
    </li>`)
  console.log(`✓ ${category}.html`)
}

writeFileSync(join(outDir, 'index.html'), `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Lead Magnet Previews</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:720px;margin:0 auto;padding:32px 16px;background:#f9fafb;color:#111;">
<h1 style="font-size:30px;margin:0 0 8px 0;">Lead Magnet Email Previews</h1>
<p style="font-size:15px;color:#6b7280;margin:0 0 28px 0;">Click any below to see exactly what lands in the recipient's inbox.</p>
<ul style="list-style:none;padding:0;margin:0;">${links.join('')}</ul>
<p style="font-size:12px;color:#9ca3af;margin-top:32px;">Sample provider: ${SAMPLE.name} · ${SAMPLE.city}, ${SAMPLE.state}</p>
</body></html>`, 'utf8')

console.log('\n✓ Done. Previews ready at /lead-magnet-previews/')
