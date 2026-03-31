#!/usr/bin/env bash
set -euo pipefail

echo "== Listening Ports =="
ss -ltnp '( sport = :4310 or sport = :4311 )' || true

echo
echo "== UI =="
curl -s http://127.0.0.1:4310 | grep -o 'Mission Control' | head -n1 || echo "UI check failed"

echo
echo "== API =="
curl -s http://127.0.0.1:4311/api/health | head -c 400 || echo "API check failed"

echo
