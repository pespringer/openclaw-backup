#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_SRC="/home/claw/.openclaw/workspace"
OPENCLAW_CONFIG_SRC="/home/claw/.openclaw/openclaw.json"

cd "$REPO_DIR"

mkdir -p workspace config

# 1) Sync workspace (text continuity + agent operating files)
rsync -a --delete \
  --exclude ".git/" \
  "$WORKSPACE_SRC/" \
  "$REPO_DIR/workspace/"

# 2) Redact OpenClaw config before committing
# Redaction approach: recursively replace values for common secret-like keys.
# This is intentionally conservative (better over-redact than leak tokens).
if [[ -f "$OPENCLAW_CONFIG_SRC" ]]; then
  jq 'def scrub:
        walk(
          if type == "object" then
            with_entries(
              if (.key|test("(?i)(token|secret|password|apiKey|apikey|key)$")) then
                .value = "***REDACTED***"
              else
                .
              end
            )
          else . end
        );
      scrub' \
    "$OPENCLAW_CONFIG_SRC" > "$REPO_DIR/config/openclaw.redacted.json"
else
  echo "WARN: openclaw.json not found at $OPENCLAW_CONFIG_SRC" >&2
fi

# 3) Commit + push only if there are changes
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "backup: $(date -u +%F_%H%M%SZ)"
  git push
else
  echo "No changes to back up."
fi
