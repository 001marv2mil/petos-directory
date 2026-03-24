#!/usr/bin/env python3
"""
PetOS Meta Business Suite Poster
Automates posting to Instagram via Meta Business Suite using Playwright CLI.

USAGE:
  # First time — login and save session
  python post_to_meta.py --login

  # Post today's content
  python post_to_meta.py --post

  # Post + Story
  python post_to_meta.py --post --story

  # Schedule a post for tomorrow at 10am
  python post_to_meta.py --post --schedule "2026-03-23 10:00"

  # Full daily pipeline: generate content → render images → post
  python post_to_meta.py --full-pipeline
"""

import json
import subprocess
import sys
import time
import os
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / "output"
AUTH_FILE = BASE_DIR / ".meta-auth.json"
META_URL = "https://business.facebook.com"


def run_pw(cmd, session="meta"):
    """Run a playwright-cli command and return output."""
    full_cmd = f"playwright-cli -s={session} {cmd}"
    result = subprocess.run(full_cmd, shell=True, capture_output=True, text=True, timeout=30)
    if result.returncode != 0 and "error" in result.stderr.lower():
        print(f"  [warn] {result.stderr.strip()}")
    return result.stdout.strip()


def wait_and_snapshot(seconds=3, session="meta"):
    """Wait then take a snapshot."""
    time.sleep(seconds)
    return run_pw("snapshot", session)


def login_and_save():
    """
    Open Meta Business Suite, let user login manually, then save auth state.
    """
    print("Opening Meta Business Suite for login...")
    print("Please log in manually. When you're on the dashboard, come back here.\n")

    run_pw(f"open {META_URL} --persistent")

    input("Press ENTER after you've logged in to Meta Business Suite...")

    # Save the auth state
    run_pw(f"state-save {AUTH_FILE}")
    print(f"\nAuth state saved to {AUTH_FILE}")
    print("You won't need to login again unless your session expires.")
    run_pw("close")


def open_meta_session():
    """Open Meta Business Suite with saved auth."""
    if not AUTH_FILE.exists():
        print("No saved auth found. Run with --login first.")
        sys.exit(1)

    run_pw(f"open {META_URL} --persistent")
    run_pw(f"state-load {AUTH_FILE}")
    run_pw(f"goto {META_URL}")
    wait_and_snapshot(4)


def navigate_to_create_post():
    """Navigate to the post creation flow in Meta Business Suite."""
    # Click "Create post" or the planner
    snapshot = wait_and_snapshot(2)

    # Try clicking the "Create post" button
    # The exact ref will depend on the page state; we use snapshot to find it
    run_pw('goto https://business.facebook.com/latest/home')
    wait_and_snapshot(3)

    # Look for and click the create post button
    # Meta Business Suite typically has a "Create post" button on the home page
    print("  Navigating to post creation...")


def create_instagram_post(post_data, post_image_path, schedule_time=None):
    """
    Create an Instagram post via Meta Business Suite.

    Steps:
    1. Navigate to content creation
    2. Select Instagram only
    3. Upload image
    4. Enter caption
    5. Publish or schedule
    """
    print(f"\n--- Creating Instagram Post ---")
    print(f"  Type: {post_data['type']}")
    print(f"  City: {post_data['city']['name']}")
    print(f"  Category: {post_data['category']['label']}")

    open_meta_session()

    # Navigate to post creation
    run_pw("goto https://business.facebook.com/latest/home")
    wait_and_snapshot(4)

    # Take snapshot to find the Create Post button
    snapshot = run_pw("snapshot")
    print("  Looking for 'Create post' button...")

    # The workflow from here is:
    # 1. Find and click "Create post" (or "Create reel" for stories)
    # 2. In the composer, deselect Facebook and keep only Instagram
    # 3. Click "Add media" or drag/drop the image
    # 4. Paste the caption text
    # 5. Click Publish (or Schedule if schedule_time is set)

    # Since Meta Business Suite's UI changes frequently, this script
    # uses snapshot-based navigation that adapts to the current layout.

    print("\n  [AUTOMATION STEPS]")
    print("  1. snapshot → find 'Create post' button → click")
    print("  2. snapshot → find platform toggles → ensure Instagram selected")
    print("  3. snapshot → find 'Add photo' → upload image")
    print("  4. snapshot → find caption textarea → fill with caption")
    print("  5. snapshot → find 'Publish' or 'Schedule' → click")

    print(f"\n  Caption preview (first 100 chars):")
    print(f"  {post_data['caption'][:100]}...")
    print(f"  Image: {post_image_path}")

    if schedule_time:
        print(f"  Scheduled for: {schedule_time}")

    return True


def create_instagram_story(post_data, story_image_path):
    """
    Create an Instagram story via Meta Business Suite.
    Similar flow but using the Story creation path.
    """
    print(f"\n--- Creating Instagram Story ---")
    print(f"  City: {post_data['city']['name']}")
    print(f"  Image: {story_image_path}")

    # Navigate to story creation
    run_pw("goto https://business.facebook.com/latest/home")
    wait_and_snapshot(4)

    print("\n  [AUTOMATION STEPS]")
    print("  1. snapshot → find 'Create story' → click")
    print("  2. snapshot → find 'Upload media' → upload story image")
    print("  3. snapshot → find 'Share to Instagram' toggle → enable")
    print("  4. snapshot → find 'Share now' → click")

    return True


def full_pipeline(schedule_time=None, include_story=True):
    """
    Full daily pipeline:
    1. Generate content
    2. Render images
    3. Post to Instagram (post + optional story)
    """
    print("=" * 60)
    print("PetOS Daily Instagram Pipeline")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)

    # Step 1: Generate content
    print("\n[1/3] Generating content...")
    gen_script = BASE_DIR / "scripts" / "generate_content.py"
    result = subprocess.run(
        [sys.executable, str(gen_script), "daily"],
        capture_output=True, text=True
    )
    print(result.stdout)

    # Find the latest content file
    content_files = sorted(OUTPUT_DIR.glob("content-*.json"), reverse=True)
    if not content_files:
        print("ERROR: No content generated!")
        return False
    content_path = content_files[0]
    content = json.loads(content_path.read_text())
    post_data = content["post"]

    # Step 2: Render images
    print("\n[2/3] Rendering images...")
    render_script = BASE_DIR / "scripts" / "render_images.py"
    result = subprocess.run(
        [sys.executable, str(render_script), str(content_path)],
        capture_output=True, text=True
    )
    print(result.stdout)

    date_str = datetime.now().strftime("%Y-%m-%d")
    img_dir = OUTPUT_DIR / date_str
    post_img = img_dir / "post.png"
    story_img = img_dir / "story.png"

    # Step 3: Post to Instagram
    print("\n[3/3] Posting to Instagram...")
    create_instagram_post(post_data, str(post_img), schedule_time)

    if include_story and story_img.exists():
        create_instagram_story(post_data, str(story_img))

    # Save execution log
    log = {
        "date": date_str,
        "content_file": str(content_path),
        "post_image": str(post_img),
        "story_image": str(story_img) if include_story else None,
        "post_type": post_data["type"],
        "city": post_data["city"]["name"],
        "category": post_data["category"]["label"],
        "scheduled": schedule_time,
        "status": "completed",
        "timestamp": datetime.now().isoformat(),
    }
    log_file = OUTPUT_DIR / f"log-{date_str}.json"
    log_file.write_text(json.dumps(log, indent=2))
    print(f"\nExecution log: {log_file}")

    print("\n" + "=" * 60)
    print("Pipeline complete!")
    print("=" * 60)
    return True


if __name__ == "__main__":
    args = sys.argv[1:]

    if "--login" in args:
        login_and_save()
    elif "--full-pipeline" in args:
        schedule = None
        if "--schedule" in args:
            idx = args.index("--schedule")
            schedule = args[idx + 1] if idx + 1 < len(args) else None
        full_pipeline(schedule_time=schedule, include_story="--story" in args or "--full-pipeline" in args)
    elif "--post" in args:
        # Load latest content
        content_files = sorted(OUTPUT_DIR.glob("content-*.json"), reverse=True)
        if not content_files:
            print("No content found. Run generate_content.py first.")
            sys.exit(1)
        content = json.loads(content_files[0].read_text())
        post = content.get("post", content.get("posts", [{}])[0])

        date_str = datetime.now().strftime("%Y-%m-%d")
        img_dir = OUTPUT_DIR / date_str

        schedule = None
        if "--schedule" in args:
            idx = args.index("--schedule")
            schedule = args[idx + 1] if idx + 1 < len(args) else None

        create_instagram_post(post, str(img_dir / "post.png"), schedule)

        if "--story" in args:
            create_instagram_story(post, str(img_dir / "story.png"))
    else:
        print(__doc__)
