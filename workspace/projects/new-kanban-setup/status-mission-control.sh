#!/usr/bin/env bash
set -euo pipefail

echo "== Ownership Model =="
if systemctl --user list-unit-files mission-control.target >/dev/null 2>&1; then
  echo "systemd user services available"
  systemctl --user --no-pager --plain --full status mission-control.target mission-control-api.service mission-control-ui.service || true
else
  echo "manual fallback"
fi

echo
echo "== Listening Ports =="
ss -ltnp '( sport = :4310 or sport = :4311 )' || true

echo
echo "== UI =="
if curl -fsS http://127.0.0.1:4310/ >/tmp/mission-control-ui.$$ 2>/dev/null; then
  if grep -q 'Mission Control' /tmp/mission-control-ui.$$; then
    echo "UI OK"
  else
    echo "UI reachable but title marker missing"
  fi
else
  echo "UI check failed"
fi
rm -f /tmp/mission-control-ui.$$

echo
echo "== API =="
if curl -fsS http://127.0.0.1:4311/api/health >/tmp/mission-control-api.$$ 2>/dev/null; then
  echo "API OK"
  head -c 400 /tmp/mission-control-api.$$
  echo
else
  echo "API check failed"
fi
rm -f /tmp/mission-control-api.$$

echo
