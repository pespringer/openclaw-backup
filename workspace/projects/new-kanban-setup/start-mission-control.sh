#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/claw/.openclaw/workspace/projects/new-kanban-setup"
UI_DIR="$ROOT/board-frontend"
LOG_DIR="$ROOT/.runtime"
mkdir -p "$LOG_DIR"

# Stop old listeners if they exist
for PORT in 4310 4311; do
  PID=$(ss -ltnp "( sport = :$PORT )" 2>/dev/null | awk 'NR>1 {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | head -n1 || true)
  if [ -n "${PID:-}" ]; then
    kill "$PID" 2>/dev/null || true
    sleep 1
  fi
done

cd "$ROOT"
nohup node server.js > "$LOG_DIR/api.log" 2>&1 &
echo $! > "$LOG_DIR/api.pid"

cd "$UI_DIR"
nohup npm run start > "$LOG_DIR/ui.log" 2>&1 &
echo $! > "$LOG_DIR/ui.pid"

echo "Mission Control started"
echo "UI:  http://192.168.5.51:4310"
echo "API: http://192.168.5.51:4311/api/kanban"
