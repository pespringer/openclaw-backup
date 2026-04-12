# Common failure patterns

## CrashLoopBackOff

Usually means the process starts, exits, and Kubernetes keeps retrying.

Look for:
- application stack trace in previous logs
- bad entrypoint or missing binary
- secret or configmap key mismatch
- startup taking longer than probe timing allows
- dependency connection refusal or timeout
- OOMKill in container state

## ImagePullBackOff / ErrImagePull

Look for:
- image tag typo
- image deleted from registry
- pull secret not attached to service account
- denied access from registry
- registry DNS or route failure

## Pending

Look for:
- `0/N nodes available`
- node selector or affinity mismatch
- taint without toleration
- PVC waiting for binding
- quota exceeded

## ContainerCreating

Look for:
- mount failures for secret, configmap, or PVC
- CNI setup delays
- image pull still in progress or blocked
- admission webhook delay or rejection

## Running with restarts

Look for:
- liveness probe too aggressive
- intermittent upstream dependency failures
- memory leaks causing periodic OOMKill
- sidecar container failure hidden behind a healthy main container

## Evicted

Look for:
- node memory pressure
- ephemeral storage pressure
- noisy-neighbor workload on same node

## Probe failures

Interpret carefully:
- readiness failure means traffic should stay away, but the container may still be fine enough to keep running
- liveness failure means kubelet is killing the container
- startup probe exists to protect slow boots from premature liveness failures

## Resource signals

Useful clues:
- `OOMKilled` in describe output
- throttling symptoms when CPU limit is too low
- Java/.NET apps that need larger memory headroom than their defaults assume

## Config and identity failures

Common misses:
- wrong namespace assumed in config
- missing secret key
- rotated credential not redeployed
- wrong service account or SCC context
- RBAC denial visible in app logs or events
