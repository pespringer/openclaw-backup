#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/claw/.openclaw/workspace/projects/new-kanban-setup"
UI_DIR="$ROOT/board-frontend"
LOG_DIR="$ROOT/.runtime"
HOST_IP="192.168.5.51"
mkdir -p "$LOG_DIR"

port_pid() {
  local port="$1"
  ss -ltnp "( sport = :$port )" 2>/dev/null | awk 'NR>1 {print $NF}' | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' | head -n1 || true
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local attempts="${3:-40}"
  local delay="${4:-0.25}"
  for _ in $(seq 1 "$attempts"); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "$label ready: $url"
      return 0
    fi
    sleep "$delay"
  done
  echo "$label failed to become ready: $url" >&2
  return 1
}

if systemctl --user list-unit-files mission-control.target >/dev/null 2>&1; then
  systemctl --user restart mission-control.target
  wait_for_http "http://127.0.0.1:4311/api/kanban" "API"
  wait_for_http "http://127.0.0.1:4310/" "UI"
  echo "Mission Control started (systemd)"
  echo "UI:  http://$HOST_IP:4310"
  echo "API: http://$HOST_IP:4311/api/kanban"
  exit 0
fi

"$ROOT/stop-mission-control.sh" >/dev/null 2>&1 || true

for PORT in 4310 4311; do
  PID=$(port_pid "$PORT")
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

wait_for_http "http://127.0.0.1:4311/api/kanban" "API"
wait_for_http "http://127.0.0.1:4310/" "UI"

echo "Mission Control started (manual fallback)"
echo "UI:  http://$HOST_IP:4310"
echo "API: http://$HOST_IP:4311/api/kanban"
