#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/claw/.openclaw/workspace/projects/new-kanban-setup"
LOG_DIR="$ROOT/.runtime"

for FILE in "$LOG_DIR/ui.pid" "$LOG_DIR/api.pid"; do
  if [ -f "$FILE" ]; then
    PID=$(cat "$FILE")
    kill "$PID" 2>/dev/null || true
    rm -f "$FILE"
  fi
done

for PORT in 4310 4311; do
  PID=$(ss -ltnp "( sport = :$PORT )" 2>/dev/null | awk 'NR>1 {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | head -n1 || true)
  if [ -n "${PID:-}" ]; then
    kill "$PID" 2>/dev/null || true
  fi
done

echo "Mission Control stopped"
