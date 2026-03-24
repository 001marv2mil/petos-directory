# PetOS Instagram Automation

Daily automated Instagram posts and stories to drive traffic to petoshealth.com.

## What It Does

Every day, this system:
1. **Generates** a city spotlight or listing spotlight post (rotating cities + categories)
2. **Renders** branded 1080x1080 post image + 1080x1920 story image
3. **Posts** to Instagram via Meta Business Suite using Playwright browser automation

## Content Types

- **City Spotlights** — Highlight a city's pet services with a CTA to explore on petoshealth.com
- **Listing Spotlights** — Feature a specific category (vets, groomers, etc.) in a city

## Setup

### 1. First-time Meta login
```bash
python3 scripts/post_to_meta.py --login
```
This opens Meta Business Suite in a browser. Log in manually, then press ENTER to save your session.

### 2. Test a dry run
```bash
./scripts/daily_run.sh --dry-run
```
Generates content and images without posting.

### 3. Run the full pipeline
```bash
./scripts/daily_run.sh
```

### 4. Generate a week at once
```bash
python3 scripts/generate_content.py weekly
```

## File Structure

```
social-automation/
├── scripts/
│   ├── generate_content.py   # Content + caption generator
│   ├── render_images.py      # HTML → PNG via Playwright
│   ├── post_to_meta.py       # Meta Business Suite automation
│   └── daily_run.sh          # Full pipeline orchestrator
├── templates/
│   ├── post_template.html    # 1080x1080 post design
│   └── story_template.html   # 1080x1920 story design
├── output/                   # Generated content + images
└── .meta-auth.json           # Saved Meta login (gitignored)
```

## Scheduling

Set up as a daily scheduled task to run automatically at your preferred posting time.
