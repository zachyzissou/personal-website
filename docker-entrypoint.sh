#!/bin/sh

set -e

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

REPO_URL="https://github.com/zachyzissou/personal-website.git"
SRC_ROOT="/var/cache/site-src"
WEBSITE_CLONE="$SRC_ROOT/website"
WEBSITE_DIR="/usr/share/nginx/html"
STATE_FILE="$SRC_ROOT/last_deployed_commit"
UPDATE_INTERVAL_SECONDS="${UPDATE_INTERVAL_SECONDS:-600}"

# Make sure git is happy in container env
git config --global --add safe.directory "$WEBSITE_CLONE" 2>/dev/null || true

ensure_clones() {
  mkdir -p "$SRC_ROOT"
  if [ -d "$WEBSITE_CLONE/.git" ]; then
    log "📦 Updating website repo..."
    (cd "$WEBSITE_CLONE" && git fetch --depth=1 origin main && git reset --hard origin/main) || log "⚠️ Failed to update website repo"
  else
    log "📦 Cloning website repo..."
    rm -rf "$WEBSITE_CLONE" || true
    git clone --depth=1 -b main "$REPO_URL" "$WEBSITE_CLONE" || log "⚠️ Failed to clone website repo"
  fi
}

build_site() {
  if [ -f "$WEBSITE_CLONE/package.json" ]; then
    log "🔧 Installing dependencies and building site..."
    (cd "$WEBSITE_CLONE" && npm ci --prefer-offline --no-audit) || log "⚠️ npm ci failed"
    (cd "$WEBSITE_CLONE" && npm run build) || log "⚠️ npm run build failed"
  else
    log "ℹ️ No package.json found, skipping build"
  fi
}

deploy_site() {
  mkdir -p "$WEBSITE_DIR"
  rm -rf "$WEBSITE_DIR"/* || true
  # copy dist output if present, otherwise copy site/ static files
  if [ -d "$WEBSITE_CLONE/dist" ]; then
    cp -a "$WEBSITE_CLONE/dist/." "$WEBSITE_DIR/" || log "⚠️ Failed to copy dist"
  elif [ -d "$WEBSITE_CLONE/site" ]; then
    cp -a "$WEBSITE_CLONE/site/." "$WEBSITE_DIR/" || log "⚠️ Failed to copy site"
  else
    log "⚠️ No built site found in repo"
  fi
  echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body>OK</body></html>' > "$WEBSITE_DIR/health"
  chown -R nginx:nginx "$WEBSITE_DIR" 2>/dev/null || true
  chmod -R 755 "$WEBSITE_DIR" 2>/dev/null || true
}

current_commit() {
  [ -d "$WEBSITE_CLONE/.git" ] && (cd "$WEBSITE_CLONE" && git rev-parse --short HEAD) || echo "unknown"
}

update_once() {
  ensure_clones
  NEW_COMMIT=$(current_commit)
  OLD_COMMIT=""
  [ -f "$STATE_FILE" ] && OLD_COMMIT=$(cat "$STATE_FILE" 2>/dev/null || echo "")
  if [ "$NEW_COMMIT" != "$OLD_COMMIT" ] && [ "$NEW_COMMIT" != "unknown" ]; then
    log "🔄 New commit detected: $OLD_COMMIT -> $NEW_COMMIT"
    build_site
    deploy_site
    echo "$NEW_COMMIT" > "$STATE_FILE"
    log "✅ Deployed commit $NEW_COMMIT"
  else
    log "⏭️ No changes (commit $NEW_COMMIT). Skipping deploy."
  fi
}

# Initial update before starting nginx
update_once

# Start periodic updater in background
(
  while true; do
    sleep "$UPDATE_INTERVAL_SECONDS"
    update_once || log "⚠️ Periodic update failed"
  done
) &

log "🚀 Starting nginx..."
exec "$@"
