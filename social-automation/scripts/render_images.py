#!/usr/bin/env python3
"""
PetOS Image Renderer
Takes content JSON and renders Instagram post + story images using Playwright.
"""

import json
import subprocess
import sys
import re
from pathlib import Path
from datetime import datetime


TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
OUTPUT_DIR = Path(__file__).parent.parent / "output"


def render_post_image(post_data, output_path):
    """Render a 1080x1080 Instagram post image."""
    template = (TEMPLATE_DIR / "post_template.html").read_text()

    city = post_data["city"]["name"]
    state = post_data["city"]["state"]
    category = post_data["category"]["label"]
    emoji = post_data["category"]["emoji"]
    post_type = post_data["type"]

    if post_type == "city_spotlight":
        type_class = "city-spotlight"
        type_label = f"City Spotlight — {city}"
        headline = f'Trusted Pet Care in <span class="highlight">{city}</span>'
        subtext = f"Find verified vets, groomers, boarding, and more for your pet in {city}, {state}."
    else:
        type_class = "listing"
        type_label = f"{category} in {city}"
        headline = f'Top <span class="highlight">{category}</span> in {city}'
        subtext = f"Compare ratings, hours, and reviews for every verified {category.lower()} in {city}."

    html = template
    html = html.replace("__POST_TYPE__", type_class)
    html = html.replace("__EMOJI__", emoji)
    html = html.replace("__TYPE_LABEL__", type_label)
    html = html.replace("__HEADLINE__", headline)
    html = html.replace("__SUBTEXT__", subtext)

    temp_html = OUTPUT_DIR / "temp_post.html"
    temp_html.write_text(html)

    # Use playwright-cli to screenshot
    subprocess.run(["playwright-cli", "open", f"file://{temp_html.resolve()}"], check=True)
    subprocess.run(["playwright-cli", "resize", "1080", "1080"], check=True)
    subprocess.run(["playwright-cli", "screenshot", f"--filename={output_path}"], check=True)
    subprocess.run(["playwright-cli", "close"], check=True)

    temp_html.unlink(missing_ok=True)
    print(f"  Post image saved: {output_path}")


def render_story_image(post_data, output_path):
    """Render a 1080x1920 Instagram story image."""
    template = (TEMPLATE_DIR / "story_template.html").read_text()

    city = post_data["city"]["name"]
    category = post_data["category"]["label"]
    emoji = post_data["category"]["emoji"]
    story = post_data["story"]

    hook_text = f'Find Trusted <span class="green">{category}</span> in {city}'
    tag_text = f"{city} • {category}"
    desc_text = f"Verified listings with real hours, phone numbers, and reviews. No fake data."

    html = template
    html = html.replace("__HOOK_TEXT__", hook_text)
    html = html.replace("__TAG_EMOJI__", emoji)
    html = html.replace("__TAG_TEXT__", tag_text)
    html = html.replace("__DESC_TEXT__", desc_text)
    html = html.replace("__CTA_TEXT__", story["cta"])

    temp_html = OUTPUT_DIR / "temp_story.html"
    temp_html.write_text(html)

    subprocess.run(["playwright-cli", "open", f"file://{temp_html.resolve()}"], check=True)
    subprocess.run(["playwright-cli", "resize", "1080", "1920"], check=True)
    subprocess.run(["playwright-cli", "screenshot", f"--filename={output_path}"], check=True)
    subprocess.run(["playwright-cli", "close"], check=True)

    temp_html.unlink(missing_ok=True)
    print(f"  Story image saved: {output_path}")


def render_from_content_file(content_path):
    """Read a content JSON file and render all images."""
    content = json.loads(Path(content_path).read_text())
    date_str = datetime.now().strftime("%Y-%m-%d")
    img_dir = OUTPUT_DIR / date_str
    img_dir.mkdir(parents=True, exist_ok=True)

    if content["type"] == "daily":
        post = content["post"]
        render_post_image(post, str(img_dir / "post.png"))
        render_story_image(post, str(img_dir / "story.png"))
        print(f"\nImages ready in: {img_dir}")

    elif content["type"] == "weekly":
        for i, post in enumerate(content["posts"]):
            day_dir = img_dir / f"day-{i+1}"
            day_dir.mkdir(exist_ok=True)
            render_post_image(post, str(day_dir / "post.png"))
            render_story_image(post, str(day_dir / "story.png"))
        print(f"\n{len(content['posts'])} days of images ready in: {img_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Find the most recent content file
        content_files = sorted(OUTPUT_DIR.glob("content-*.json"), reverse=True)
        if not content_files:
            print("No content files found. Run generate_content.py first.")
            sys.exit(1)
        content_path = content_files[0]
    else:
        content_path = sys.argv[1]

    print(f"Rendering images from: {content_path}")
    render_from_content_file(content_path)
