# PetOS Backlink Outreach

Goal: **20 backlinks in 60 days** to unlock Google's crawl budget so more of our 10,290 sitemap URLs get indexed.

See the full plan at `C:\Users\m1uva\.claude\plans\i-want-to-create-partitioned-dolphin.md`.

## Files in this folder

| File | What it is | How to use it |
|---|---|---|
| **backlink-tracker.csv** | Master tracker. Every pitch/directory/resource attempt lives here. | Open in Excel/Google Sheets. Fill in `date_sent`, `contact_name`, `status`, etc. as you go. |
| **niche-press-pitch.md** | The pitch body + 11 verified pet press emails + 4 form submissions | Week 1 — copy pitch, send |
| **journalist-pitches.md** | 8 city-specific pitches for local TV (Cleveland, St. Paul, Savannah, etc.) with 23 outlets total | Week 2 — use Hunter.io to find reporters, then send |

## Quick reference: the 6 emails to send on Day 1

1. `editorial@kinship.com`
2. `news@dvm360.com`
3. `gpolyn@petage.com`
4. `smahan@navc.com`
5. `info@moderndogmagazine.com`
6. `info@petliferadio.com`

## Tracker columns explained

- **date_sent** — when you actually sent the pitch/submission
- **week** — 1/2/3/4/5-6/7-8 per the plan
- **channel** — Niche Pet Press / Local TV / Directory / Resource Page
- **outlet** — site name
- **contact_name** — specific editor/reporter if known
- **contact_email_or_url** — where you sent it
- **pitch_subject** — the subject line used (for A/B learning later)
- **status** — pending / sent / replied / published / declined / no-response
- **reply_date** — when they replied (helps measure channel response time)
- **published_url** — link to the published article
- **backlink_live** — YES / NO — confirmed with Ahrefs free checker or a manual `Ctrl+F petosdirectory` on the article
- **da_estimate** — rough Domain Authority (optional — for learning which channels are highest quality)
- **notes** — anything else

## Weekly review (5 min Friday)

1. Count rows where `status = sent` → target for Week 1: 15
2. Count rows where `backlink_live = YES` → target: climbing to 20 by Day 60
3. If any channel is at 0% reply rate after 10 sends, pause it and reinforce the winning channels

## When you get a reply

1. Reply within 24 hours
2. Offer: raw data CSV, direct quotes, a specific city breakdown
3. **Explicitly ask**: *"Would you link to the full report at https://petosdirectory.com/reports/emergency-vet-access-2026 so readers can dig into the data?"* — this is where the backlink comes from. If you don't ask, you don't always get it.
4. After the piece publishes, verify the backlink is `dofollow` (right-click → Inspect the link → check for `rel="nofollow"` — if nofollow, still has value but less)
