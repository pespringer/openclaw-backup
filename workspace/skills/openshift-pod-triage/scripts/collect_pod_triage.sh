#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Collect core Kubernetes/OpenShift pod triage evidence into a timestamped folder.

Usage:
  collect_pod_triage.sh -n <namespace> -p <pod> [-c <container>] [-o <output-dir>] [-k <oc|kubectl>]

Options:
  -n  Namespace (required)
  -p  Pod name (required)
  -c  Container name (optional)
  -o  Output directory base (default: current directory)
  -k  CLI to use, default: oc
  -h  Show help
EOF
}

NAMESPACE=""
POD=""
CONTAINER=""
OUT_BASE="$(pwd)"
KCLI="oc"

while getopts ":n:p:c:o:k:h" opt; do
  case "$opt" in
    n) NAMESPACE="$OPTARG" ;;
    p) POD="$OPTARG" ;;
    c) CONTAINER="$OPTARG" ;;
    o) OUT_BASE="$OPTARG" ;;
    k) KCLI="$OPTARG" ;;
    h)
      usage
      exit 0
      ;;
    :)
      echo "Option -$OPTARG requires a value" >&2
      usage >&2
      exit 2
      ;;
    \?)
      echo "Unknown option: -$OPTARG" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$NAMESPACE" || -z "$POD" ]]; then
  echo "Namespace and pod are required" >&2
  usage >&2
  exit 2
fi

if ! command -v "$KCLI" >/dev/null 2>&1; then
  echo "CLI not found: $KCLI" >&2
  exit 127
fi

TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="$OUT_BASE/pod-triage-${NAMESPACE}-${POD}-${TS}"
mkdir -p "$OUT_DIR"

run_capture() {
  local name="$1"
  shift
  {
    echo "$ $*"
    "$@"
  } >"$OUT_DIR/$name" 2>&1 || true
}

run_capture "pod-get.txt" "$KCLI" get pod "$POD" -n "$NAMESPACE" -o wide
run_capture "pod-describe.txt" "$KCLI" describe pod "$POD" -n "$NAMESPACE"
run_capture "pod.yaml" "$KCLI" get pod "$POD" -n "$NAMESPACE" -o yaml
run_capture "events.txt" "$KCLI" get events -n "$NAMESPACE" --sort-by=.lastTimestamp
run_capture "workloads.txt" "$KCLI" get deploy,statefulset,daemonset,job,cronjob -n "$NAMESPACE"
run_capture "pvc.txt" "$KCLI" get pvc -n "$NAMESPACE"
run_capture "serviceaccounts.txt" "$KCLI" get sa -n "$NAMESPACE"
run_capture "resourcequota.txt" "$KCLI" get resourcequota -n "$NAMESPACE"
run_capture "limitrange.txt" "$KCLI" get limitrange -n "$NAMESPACE"

CONTAINERS=( )
if [[ -n "$CONTAINER" ]]; then
  CONTAINERS=( "$CONTAINER" )
else
  mapfile -t CONTAINERS < <("$KCLI" get pod "$POD" -n "$NAMESPACE" -o jsonpath='{range .spec.containers[*]}{.name}{"\n"}{end}' 2>/dev/null || true)
fi

if [[ ${#CONTAINERS[@]} -eq 0 ]]; then
  CONTAINERS=( "all-containers" )
fi

for c in "${CONTAINERS[@]}"; do
  safe_name="${c//\//_}"
  if [[ "$c" == "all-containers" ]]; then
    run_capture "logs-${safe_name}.txt" "$KCLI" logs "$POD" -n "$NAMESPACE" --all-containers --tail=200
    run_capture "logs-${safe_name}-previous.txt" "$KCLI" logs "$POD" -n "$NAMESPACE" --all-containers --previous --tail=200
  else
    run_capture "logs-${safe_name}.txt" "$KCLI" logs "$POD" -n "$NAMESPACE" -c "$c" --tail=200
    run_capture "logs-${safe_name}-previous.txt" "$KCLI" logs "$POD" -n "$NAMESPACE" -c "$c" --previous --tail=200
  fi
done

cat >"$OUT_DIR/README.txt" <<EOF
Collected pod triage evidence.

Namespace: $NAMESPACE
Pod: $POD
Container filter: ${CONTAINER:-<auto>}
CLI: $KCLI
Timestamp (UTC): $TS

Files in this directory are best-effort captures. Some commands may fail if the resource does not exist or your access is limited.
EOF

echo "$OUT_DIR"
