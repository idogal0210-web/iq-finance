#!/usr/bin/env bash
# iQ.finance dev helper
# Run: ./dev.sh          → start dev server
# Run: ./dev.sh sync     → pull latest from GitHub

set -e
cd "$(dirname "$0")"

if [ "$1" = "sync" ]; then
  echo "→ Pulling latest from GitHub..."
  git pull origin main
  npm install --legacy-peer-deps
  echo "✓ Synced to $(git log --oneline -1)"
  exit 0
fi

echo "→ Pulling latest from GitHub..."
git pull origin main --quiet

echo "→ Starting dev server at http://localhost:5173"
npm run dev
