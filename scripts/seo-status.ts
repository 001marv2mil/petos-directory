// @ts-nocheck
/**
 * Pulls Google Search Console + GA4 stats.
 * Run: npx tsx --env-file=.env.local scripts/seo-status.ts
 *
 * Required env vars:
 *   GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json
 *   GSC_SITE_URL=sc-domain:petosdirectory.com   (or https://petosdirectory.com/)
 *   GA4_PROPERTY_ID=123456789                   (numeric, from GA4 Admin → Property Settings)
 */
import { google } from 'googleapis'

const SITE = process.env.GSC_SITE_URL || 'sc-domain:petosdirectory.com'
const GA4 = process.env.GA4_PROPERTY_ID

async function main() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
  })
  const authClient = await auth.getClient()

  console.log('=== SEO Status ===')
  console.log('Site:', SITE)
  console.log('')

  // --- Search Console: Sitemaps ---
  const sc = google.webmasters({ version: 'v3', auth: authClient as any })
  console.log('--- Sitemaps ---')
  try {
    const { data } = await sc.sitemaps.list({ siteUrl: SITE })
    for (const sm of data.sitemap || []) {
      console.log(`  ${sm.path}`)
      console.log(`    last submitted: ${sm.lastSubmitted}`)
      console.log(`    last downloaded: ${sm.lastDownloaded}`)
      console.log(`    is pending: ${sm.isPending}  errors: ${sm.errors}  warnings: ${sm.warnings}`)
      for (const c of sm.contents || []) {
        console.log(`    [${c.type}] submitted: ${c.submitted}  indexed: ${c.indexed}`)
      }
    }
    if (!data.sitemap?.length) console.log('  (no sitemaps registered)')
  } catch (e: any) {
    console.log('  ERR:', e.message)
  }
  console.log('')

  // --- Search Console: 28-day performance ---
  console.log('--- Search performance (last 28d) ---')
  try {
    const end = new Date().toISOString().slice(0, 10)
    const start = new Date(Date.now() - 28 * 86400e3).toISOString().slice(0, 10)
    const { data } = await sc.searchanalytics.query({
      siteUrl: SITE,
      requestBody: { startDate: start, endDate: end, dimensions: [], rowLimit: 1 },
    })
    const r = data.rows?.[0]
    if (r) {
      console.log(`  clicks: ${r.clicks}`)
      console.log(`  impressions: ${r.impressions}`)
      console.log(`  CTR: ${((r.ctr || 0) * 100).toFixed(2)}%`)
      console.log(`  avg position: ${(r.position || 0).toFixed(1)}`)
    } else {
      console.log('  (no data)')
    }

    // top pages
    const { data: pages } = await sc.searchanalytics.query({
      siteUrl: SITE,
      requestBody: { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 10 },
    })
    console.log('  Top pages by clicks:')
    for (const row of pages.rows || []) {
      console.log(`    ${row.clicks}\t${row.impressions}imp\t${row.keys?.[0]}`)
    }
  } catch (e: any) {
    console.log('  ERR:', e.message)
  }
  console.log('')

  // --- GA4 ---
  if (!GA4) {
    console.log('--- GA4: skipped (GA4_PROPERTY_ID not set) ---')
    return
  }
  console.log('--- GA4 (last 28d) ---')
  try {
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: authClient as any })
    const { data } = await analyticsdata.properties.runReport({
      property: `properties/${GA4}`,
      requestBody: {
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'engagementRate' },
        ],
      },
    })
    const row = data.rows?.[0]?.metricValues
    if (row) {
      console.log(`  active users: ${row[0].value}`)
      console.log(`  sessions: ${row[1].value}`)
      console.log(`  page views: ${row[2].value}`)
      console.log(`  engagement rate: ${(parseFloat(row[3].value || '0') * 100).toFixed(1)}%`)
    }

    // Top pages
    const { data: top } = await analyticsdata.properties.runReport({
      property: `properties/${GA4}`,
      requestBody: {
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      },
    })
    console.log('  Top pages by views:')
    for (const r of top.rows || []) {
      console.log(`    ${r.metricValues?.[0].value}\t${r.dimensionValues?.[0].value}`)
    }
  } catch (e: any) {
    console.log('  ERR:', e.message)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
