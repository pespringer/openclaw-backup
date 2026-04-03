#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/claw/.openclaw/workspace/projects/new-kanban-setup"
LOG_DIR="$ROOT/.runtime"

port_pid() {
  local port="$1"
  ss -ltnp "( sport = :$port )" 2>/dev/null | awk 'NR>1 {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | head -n1 || true
}

stop_pid() {
  local pid="$1"
  [ -n "${pid:-}" ] || return 0
  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 20); do
    if ! kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
    sleep 0.25
  done
  kill -9 "$pid" 2>/dev/null || true
}

for FILE in "$LOG_DIR/ui.pid" "$LOG_DIR/api.pid"; do
  if [ -f "$FILE" ]; then
    PID=$(cat "$FILE")
    stop_pid "$PID"
    rm -f "$FILE"
  fi
done

for PORT in 4310 4311; do
  PID=$(port_pid "$PORT")
  if [ -n "${PID:-}" ]; then
    stop_pid "$PID"
  fi
done

echo "Mission Control stopped"
