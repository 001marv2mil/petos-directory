Authority Standard (CRITICAL)

Everything must meet this standard:

👉 Would a pet owner trust this to choose a vet for their pet?

If the answer is not 100% yes → fix it

Product Positioning

PetOS should feel like:

Zocdoc (healthcare trust)

Yelp (local discovery)

Google Maps (data reliability)

Combined into one pet-focused system

Trust System Architecture
1. Real Data Only

NO fake listings

NO placeholder businesses

NO empty pages

Every listing must feel:

local

specific

real

2. Complete Business Profiles

Each business MUST include:

Business name

Full address

Phone number

Hours of operation

Category (vet, groomer, etc.)

Description (clean, human, not generic AI spam)

Images (future-ready)

If missing data:

→ Do NOT show broken UI
→ Handle gracefully

3. Verification Layer

System must support:

Verified badge

“Claim this business” (future-ready)

Trust indicators (top-rated, popular, etc.)

4. No Dead Ends

NEVER allow:

blank pages

empty categories

broken links

If no data:

→ show fallback UI (not empty screens)

Core Product Structure
1. Homepage (Trust Entry Point)

Must include:

Strong headline:
“Find trusted pet services near you”

Search bar:

city

category

Sections:

Top rated

Recently added

Popular in [city]

Clean, premium layout

2. City Pages

Example:

/tampa

Must include:

Top categories

Featured businesses

Real listings

Must feel:

👉 local, active, alive

3. Category Pages

Example:

/tampa/veterinarians

Must:

show multiple listings

never be empty

use clean list/grid

4. Business Profile Pages

This is the MOST important page.

Must feel like:

👉 a real business profile, not a card

Include:

Name (large, clear)

Address

Phone

Hours

Description

Category

Trust indicators

Layout must feel:

👉 professional, structured, readable

UX / UI Authority Rules
Design must feel:

Minimal

Structured

Premium

Calm

NEVER:

clutter

random colors

inconsistent spacing

“template look”

Copywriting Rules

Text must feel:

human

confident

helpful

NOT:

robotic

generic

spammy

Example:

❌ “Best pet service provider in your area”
✅ “Trusted by pet owners in Tampa”

Data & Scale System

Must support:

thousands of listings

multiple cities

multiple categories

Avoid:

hardcoding

static data patterns

Use:

scalable structure

reusable components

Search & Discovery

Must include:

city-based search

category filters

clean results layout

Future-ready:

ratings

sorting

distance

Performance Rules

fast load times

no broken routes

no UI lag

Development Rules
Before coding:

write plan

define structure

While coding:

reuse components

keep logic clean

After coding:

verify UI

verify data

verify flow

What NOT to Build

fake demo directory

empty marketplace

UI-only app

This must feel:

👉 real, active, useful

Definition of Done

A feature is ONLY done if:

it works

it looks premium

it builds trust

it feels real

Execution Priority

Always prioritize:

Trust

Data

Structure

UI

NOT the other way around
## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools directly.

If gstack skills aren't working, run `cd .claude/skills/gstack && ./setup` to rebuild.

Available skills:
- `/office-hours` — describe what you're building, get structured guidance
- `/plan-ceo-review` — product/strategy review of a feature idea
- `/plan-eng-review` — architecture and technical review
- `/plan-design-review` — design and UX review
- `/design-consultation` — design advice and direction
- `/design-shotgun` — rapid design exploration
- `/design-html` — generate HTML/CSS designs
- `/design-review` — review existing designs
- `/review` — code review on current branch changes
- `/ship` — prepare and ship a PR
- `/land-and-deploy` — land PR and deploy
- `/canary` — canary deploy
- `/qa` — QA against a staging URL (opens browser)
- `/qa-only` — QA without deploy steps
- `/browse` — web browsing skill
- `/connect-chrome` — connect to Chrome for browser automation
- `/setup-browser-cookies` — set up browser cookies
- `/setup-deploy` — configure deployment
- `/investigate` — deep investigation of a bug or issue
- `/retro` — retrospective on recent work
- `/document-release` — generate release notes
- `/autoplan` — auto-generate a plan from context
- `/careful` — careful mode for risky changes
- `/freeze` — freeze dependencies or config
- `/unfreeze` — unfreeze dependencies or config
- `/guard` — add guards/safeguards to code
- `/benchmark` — run benchmarks
- `/codex` — OpenAI Codex integration
- `/cso` — chief security officer review (OWASP + STRIDE)
- `/learn` — learn from the codebase
- `/gstack-upgrade` — upgrade gstack to latest
