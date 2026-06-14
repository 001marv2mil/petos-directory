#!/bin/bash
# PetOS Daily Instagram Automation
# Run this daily or set up as a scheduled task
#
# Usage:
#   ./daily_run.sh              # Generate + render + post
#   ./daily_run.sh --dry-run    # Generate + render only (no posting)
#   ./daily_run.sh --weekly     # Generate a full week of content

set -e

# === DISABLED 2026-05-31 ===
# Auto-posting to Instagram is paused. Owner flagged unwanted posts
# appearing in their accounts; this script is the prime suspect even
# though we couldn't confirm. To re-enable, delete this guard block
# AND confirm no other scheduler (Buffer/Later/Meta-native/n8n) is
# still queued.
if [[ "$1" != "--i-confirm-posting-is-intended" ]]; then
    echo "ERROR: daily_run.sh is DISABLED. See header comment."
    echo "Re-enable with the --i-confirm-posting-is-intended flag,"
    echo "but verify no other scheduler is queued first."
    exit 2
fi
shift  # consume the guard flag so downstream parsing still works

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$BASE_DIR/output"
DATE=$(date +%Y-%m-%d)

echo "=========================================="
echo "PetOS Instagram Automation — $DATE"
echo "=========================================="

# Step 1: Generate content
echo ""
echo "[Step 1] Generating content..."
if [[ "$1" == "--weekly" ]]; then
    python3 "$SCRIPT_DIR/generate_content.py" weekly
else
    python3 "$SCRIPT_DIR/generate_content.py" daily
fi

# Step 2: Render images
echo ""
echo "[Step 2] Rendering images..."
LATEST_CONTENT=$(ls -t "$OUTPUT_DIR"/content-*.json 2>/dev/null | head -1)
if [ -z "$LATEST_CONTENT" ]; then
    echo "ERROR: No content file found!"
    exit 1
fi
python3 "$SCRIPT_DIR/render_images.py" "$LATEST_CONTENT"

# Step 3: Post (unless dry run)
if [[ "$1" == "--dry-run" ]]; then
    echo ""
    echo "[Step 3] DRY RUN — skipping posting"
    echo ""
    echo "Content ready in: $OUTPUT_DIR/$DATE/"
    echo "Content JSON: $LATEST_CONTENT"
    echo ""
    echo "To post manually:"
    echo "  python3 $SCRIPT_DIR/post_to_meta.py --post --story"
else
    echo ""
    echo "[Step 3] Posting to Instagram via Meta Business Suite..."
    python3 "$SCRIPT_DIR/post_to_meta.py" --full-pipeline
fi

echo ""
echo "Done! Check $OUTPUT_DIR/$DATE/ for today's assets."
