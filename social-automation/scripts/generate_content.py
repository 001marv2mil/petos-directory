#!/usr/bin/env python3
"""
PetOS Instagram Content Generator
Generates daily city spotlight + listing posts for petoshealth.com
Outputs: caption text, hashtags, CTA, and triggers image generation
"""

import json
import random
import os
from datetime import datetime, timedelta
from pathlib import Path

# ── PetOS Data ──────────────────────────────────────────────────────────────

CITIES = [
    {"name": "Tampa", "state": "Florida", "slug": "florida/tampa"},
    {"name": "Los Angeles", "state": "California", "slug": "california/los-angeles"},
    {"name": "New York", "state": "New York", "slug": "new-york/new-york"},
    {"name": "Chicago", "state": "Illinois", "slug": "illinois/chicago"},
    {"name": "San Francisco", "state": "California", "slug": "california/san-francisco"},
    {"name": "Denver", "state": "Colorado", "slug": "colorado/denver"},
    {"name": "Miami", "state": "Florida", "slug": "florida/miami"},
    {"name": "Phoenix", "state": "Arizona", "slug": "arizona/phoenix"},
    {"name": "Austin", "state": "Texas", "slug": "texas/austin"},
    {"name": "Seattle", "state": "Washington", "slug": "washington/seattle"},
    {"name": "Boston", "state": "Massachusetts", "slug": "massachusetts/boston"},
    {"name": "Nashville", "state": "Tennessee", "slug": "tennessee/nashville"},
    {"name": "Portland", "state": "Oregon", "slug": "oregon/portland"},
    {"name": "San Diego", "state": "California", "slug": "california/san-diego"},
    {"name": "Atlanta", "state": "Georgia", "slug": "georgia/atlanta"},
    {"name": "Dallas", "state": "Texas", "slug": "texas/dallas"},
    {"name": "Minneapolis", "state": "Minnesota", "slug": "minnesota/minneapolis"},
    {"name": "Charlotte", "state": "North Carolina", "slug": "north-carolina/charlotte"},
    {"name": "Raleigh", "state": "North Carolina", "slug": "north-carolina/raleigh"},
    {"name": "Salt Lake City", "state": "Utah", "slug": "utah/salt-lake-city"},
]

CATEGORIES = [
    {"slug": "veterinarians", "label": "Veterinarians", "emoji": "🩺"},
    {"slug": "emergency-vets", "label": "Emergency Vets", "emoji": "🚨"},
    {"slug": "groomers", "label": "Groomers", "emoji": "✂️"},
    {"slug": "boarding", "label": "Boarding", "emoji": "🏠"},
    {"slug": "daycare", "label": "Daycare", "emoji": "☀️"},
    {"slug": "trainers", "label": "Trainers", "emoji": "🎓"},
    {"slug": "pet-pharmacies", "label": "Pet Pharmacies", "emoji": "💊"},
]

# ── Content Templates ───────────────────────────────────────────────────────

CITY_SPOTLIGHT_CAPTIONS = [
    "📍 {city}, {state}\n\nLooking for trusted pet care in {city}? We've got you covered.\n\nFrom top-rated vets to local groomers, PetOS connects you with verified pet services — real businesses, real reviews, real trust.\n\n👉 Explore {city} on petoshealth.com\n(link in bio)",

    "📍 {city} Pet Parents\n\nYour pet deserves the best care in {city}. We've mapped out the top veterinarians, groomers, boarding facilities, and more — all verified.\n\nStop guessing. Start trusting.\n\n👉 petoshealth.com/{slug}\n(link in bio)",

    "📍 Pet owners in {city} — this one's for you.\n\nWe built PetOS so you never have to wonder \"is this vet any good?\" again.\n\nVerified listings. Real hours. Real phone numbers. Real reviews from {city} pet parents.\n\n👉 Find your pet's next provider\n(link in bio)",

    "📍 {city}, {state}\n\nNew to {city}? Just got a puppy? Need a new vet?\n\nPetOS has the most complete directory of pet services in {city} — vets, groomers, boarding, daycare, trainers, and emergency care.\n\nAll verified. All real.\n\n👉 petoshealth.com/{slug}\n(link in bio)",
]

LISTING_SPOTLIGHT_CAPTIONS = [
    "{emoji} {category} in {city}\n\nDid you know {city} has some of the highest-rated {category_lower} in the state?\n\nPetOS makes it easy to compare, call, and book — all in one place.\n\n👉 Browse {category_lower} in {city}\npetoshealth.com/{slug}/{cat_slug}\n(link in bio)",

    "{emoji} Finding a great {category_single} in {city} shouldn't be hard.\n\nThat's why PetOS lists every verified {category_single} in {city} with real addresses, hours, phone numbers, and ratings.\n\nNo fake listings. No dead ends. Just the info you need.\n\n👉 See all {city} {category_lower}\n(link in bio)",

    "{emoji} {city} {category}\n\nWhether it's your first visit or you're switching providers, PetOS helps you find trusted {category_lower} in {city}.\n\nEvery listing is verified with real data — not AI-generated fluff.\n\n👉 petoshealth.com/{slug}/{cat_slug}\n(link in bio)",
]

STORY_HOOKS = [
    "🐾 Did you know?",
    "📍 Pet parents in {city}...",
    "🔍 Looking for a {category_single}?",
    "✅ Verified pet services in {city}",
    "🐶 Your pet deserves better",
    "🏥 Don't settle for less",
]

STORY_CTAS = [
    "Swipe up to explore →",
    "👉 Link in bio",
    "Tap to find yours →",
    "👉 petoshealth.com",
    "Find your pet's provider →",
]

# ── Hashtag Sets ────────────────────────────────────────────────────────────

BASE_HASHTAGS = [
    "#PetOS", "#petoshealth", "#petcare", "#petowners",
    "#dogsofinstagram", "#catsofinstagram", "#petsofinstagram",
    "#vetlife", "#pethealth", "#furbaby",
]

CITY_HASHTAGS = {
    "Tampa": ["#TampaPets", "#TampaFL", "#TampaBay", "#TampaDogs"],
    "Los Angeles": ["#LAPets", "#LosAngelesDogs", "#LADogLife", "#SoCalPets"],
    "New York": ["#NYCPets", "#NewYorkDogs", "#NYCDogWalking", "#NYPetCare"],
    "Chicago": ["#ChicagoPets", "#ChicagoDogs", "#WindyCityPets", "#ChiTownDogs"],
    "Miami": ["#MiamiPets", "#MiamiDogs", "#SoFlaPets", "#MiamiPetCare"],
    "Austin": ["#AustinPets", "#AustinDogs", "#ATXPets", "#KeepAustinPetFriendly"],
    "Seattle": ["#SeattlePets", "#SeattleDogs", "#PNWPets", "#SeattlePetCare"],
    "Denver": ["#DenverPets", "#DenverDogs", "#ColoradoPets", "#MileHighPets"],
    "Phoenix": ["#PhoenixPets", "#PhoenixDogs", "#AZPets", "#PhoenixPetCare"],
    "San Francisco": ["#SFPets", "#SFDogs", "#BayAreaPets", "#SanFranciscoDogs"],
}

CATEGORY_HASHTAGS = {
    "veterinarians": ["#vetvisit", "#animalhealth", "#petvet", "#veterinarian"],
    "emergency-vets": ["#emergencyvet", "#petemergency", "#24hourvet", "#urgentpetcare"],
    "groomers": ["#doggrooming", "#petgrooming", "#groomersofinstagram", "#freshcut"],
    "boarding": ["#dogboarding", "#petboarding", "#dogsitting", "#pethotel"],
    "daycare": ["#dogdaycare", "#puppydaycare", "#dogsocialization", "#dogplay"],
    "trainers": ["#dogtraining", "#puppytraining", "#obediencetraining", "#dogtrainer"],
    "pet-pharmacies": ["#petmeds", "#petpharmacy", "#petwellness", "#petmedication"],
}


def pick_city(exclude_recent=None):
    """Pick a city, avoiding recently used ones."""
    available = [c for c in CITIES if c["name"] not in (exclude_recent or [])]
    if not available:
        available = CITIES
    return random.choice(available)


def pick_category():
    """Pick a random category."""
    return random.choice(CATEGORIES)


def generate_hashtags(city_name, category_slug, max_tags=25):
    """Build a hashtag string, mixing base + city + category tags."""
    tags = list(BASE_HASHTAGS)
    tags += CITY_HASHTAGS.get(city_name, [f"#{city_name.replace(' ', '')}Pets"])
    tags += CATEGORY_HASHTAGS.get(category_slug, [])
    random.shuffle(tags)
    return " ".join(tags[:max_tags])


def generate_post(post_type="auto", city=None, category=None):
    """
    Generate a complete Instagram post package.
    Returns dict with: type, caption, hashtags, story_hook, story_cta, city, category, url, image_data
    """
    if city is None:
        city = pick_city()
    if category is None:
        category = pick_category()

    if post_type == "auto":
        post_type = random.choice(["city_spotlight", "listing_spotlight"])

    category_single = category["label"].rstrip("s")
    if category["label"] == "Daycare":
        category_single = "daycare"

    template_vars = {
        "city": city["name"],
        "state": city["state"],
        "slug": city["slug"],
        "category": category["label"],
        "category_lower": category["label"].lower(),
        "category_single": category_single.lower(),
        "cat_slug": category["slug"],
        "emoji": category["emoji"],
    }

    if post_type == "city_spotlight":
        caption = random.choice(CITY_SPOTLIGHT_CAPTIONS).format(**template_vars)
    else:
        caption = random.choice(LISTING_SPOTLIGHT_CAPTIONS).format(**template_vars)

    hashtags = generate_hashtags(city["name"], category["slug"])
    story_hook = random.choice(STORY_HOOKS).format(**template_vars)
    story_cta = random.choice(STORY_CTAS)

    url = f"https://petoshealth.com/{city['slug']}"
    if post_type == "listing_spotlight":
        url += f"/{category['slug']}"

    return {
        "type": post_type,
        "caption": caption,
        "hashtags": hashtags,
        "full_caption": f"{caption}\n\n·\n·\n·\n\n{hashtags}",
        "story": {
            "hook": story_hook,
            "cta": story_cta,
            "url": url,
        },
        "city": city,
        "category": category,
        "url": url,
        "image_data": {
            "type": post_type,
            "city_name": city["name"],
            "state": city["state"],
            "category_label": category["label"],
            "category_emoji": category["emoji"],
            "url": url,
        },
        "generated_at": datetime.now().isoformat(),
    }


def generate_weekly_content():
    """Generate 7 days of content, alternating types and rotating cities."""
    posts = []
    used_cities = []

    for day in range(7):
        city = pick_city(exclude_recent=used_cities[-3:] if used_cities else None)
        used_cities.append(city["name"])

        post_type = "city_spotlight" if day % 2 == 0 else "listing_spotlight"
        post = generate_post(post_type=post_type, city=city)
        post["scheduled_day"] = day
        post["scheduled_date"] = (datetime.now() + timedelta(days=day)).strftime("%Y-%m-%d")
        posts.append(post)

    return posts


def save_content(content, output_dir=None):
    """Save generated content to JSON file."""
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "output"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now().strftime("%Y-%m-%d")
    filepath = output_dir / f"content-{date_str}.json"

    with open(filepath, "w") as f:
        json.dump(content, f, indent=2)

    return filepath


if __name__ == "__main__":
    import sys

    mode = sys.argv[1] if len(sys.argv) > 1 else "daily"

    if mode == "weekly":
        content = generate_weekly_content()
        filepath = save_content({"type": "weekly", "posts": content})
        print(f"Generated {len(content)} posts for the week")
        for i, post in enumerate(content):
            print(f"  Day {i+1} ({post['scheduled_date']}): {post['type']} — {post['city']['name']}, {post['category']['label']}")
    else:
        post = generate_post()
        filepath = save_content({"type": "daily", "post": post})
        print(f"Generated: {post['type']} — {post['city']['name']}, {post['category']['label']}")

    print(f"Saved to: {filepath}")
    print(f"\n--- CAPTION ---\n{post['full_caption'] if mode != 'weekly' else content[0]['full_caption']}")
