---
name: openshift-pod-triage
description: Diagnose unhealthy Kubernetes or OpenShift pods with a repeatable triage workflow and a bundled evidence-collection script. Use when Codex needs to investigate pod failures such as CrashLoopBackOff, Error, ImagePullBackOff, ErrImagePull, Pending, ContainerCreating stalls, failing probes, restarts, evictions, scheduling/resource issues, PVC mount problems, config/secret/service-account mistakes, or namespace-specific workload health problems.
---

# OpenShift Pod Triage

## Overview

Use this skill to turn a vague pod outage into a fast, evidence-based diagnosis. Start with a quick classification, collect the right facts once, then explain the most likely cause, impact, and next fix.

## Workflow

1. Identify the failing workload, namespace, and pod state.
2. Collect structured evidence with `scripts/collect_pod_triage.sh` when shell access is available.
3. Match the symptoms against the decision tree below.
4. Confirm the likely cause with one or two targeted commands, not a long random walk.
5. Report findings clearly: symptom, evidence, root cause, immediate fix, and prevention ideas.

## Quick classification

Start with:

```bash
oc get pods -n <namespace>
oc describe pod <pod> -n <namespace>
oc logs <pod> -n <namespace> --all-containers --tail=200
```

Then bucket the issue:

- **CrashLoopBackOff / Error / Completed unexpectedly**: application start-up, command, config, secret, dependency, or probe issue
- **ImagePullBackOff / ErrImagePull**: bad image reference, registry auth, image policy, or network access issue
- **Pending**: scheduler, quota, node selector, taint/toleration, PVC, or insufficient resources
- **ContainerCreating**: image pull, mount, CNI, secret/configmap, or admission delay
- **High restart count but Running**: probe failures, OOMKill, intermittent dependency failure, or short-lived crash/restart cycle
- **Evicted**: node memory, ephemeral storage, or pressure condition

## Decision tree

### If the pod is `CrashLoopBackOff`

Check, in order:

1. Previous container logs
   ```bash
   oc logs <pod> -n <namespace> --all-containers --previous --tail=200
   ```
2. Termination reason and exit code in `oc describe pod`
3. Command, args, env, mounted secrets/configmaps
4. Liveness/readiness/startup probe failures
5. Dependency reachability such as database, broker, or API

Common patterns:

- `OOMKilled`: raise limits carefully, inspect heap/process behavior
- `Exit Code 1`: app/config failure, bad env var, missing dependency, startup script bug
- `Exit Code 126/127`: command not executable or missing binary
- Probe failures before startup completes: tune `startupProbe`, `initialDelaySeconds`, thresholds

### If the pod is `ImagePullBackOff` or `ErrImagePull`

Check:

```bash
oc describe pod <pod> -n <namespace>
oc get secret -n <namespace>
```

Focus on:

- image name/tag typo
- image no longer exists
- missing or wrong pull secret
- registry route or network failure
- policy preventing pull from untrusted registry

### If the pod is `Pending`

Check:

```bash
oc describe pod <pod> -n <namespace>
oc get pvc -n <namespace>
oc get events -n <namespace> --sort-by=.lastTimestamp | tail -n 50
```

Focus on:

- insufficient CPU or memory
- unsatisfied node selector or affinity
- missing toleration for tainted nodes
- PVC not bound
- quota or limitrange rejection

### If the pod is `Running` but unhealthy

Check:

```bash
oc describe pod <pod> -n <namespace>
oc logs <pod> -n <namespace> --all-containers --tail=200
```

Focus on:

- readiness failures keeping the service out of endpoints
- liveness probe killing a slow app
- intermittent dependency failures
- partial sidecar failure
- memory pressure causing repeated restarts

## Evidence collection script

Use the bundled script to gather the core evidence in one pass:

```bash
bash scripts/collect_pod_triage.sh -n <namespace> -p <pod>
```

Useful options:

- `-c <container>` to scope logs to one container
- `-o <dir>` to write output somewhere specific
- `-k kubectl` when `kubectl` is available instead of `oc`

The script captures pod YAML, describe output, container status summary, recent logs, previous logs when present, PVC status, workload objects, and recent namespace events.

## Output format

Prefer this structure in the final answer:

```text
Issue
- What is failing, where, and how it presents

Most likely cause
- Short diagnosis tied to direct evidence

Evidence
- 2-5 bullets with specific commands, events, exit codes, or log lines

Immediate fix
- Smallest safe next action

Follow-up checks
- What to verify after the fix

Prevention
- Optional hardening or monitoring suggestion
```

## Reference files

Read these when needed:

- `references/patterns.md` for common failure signatures and what they usually mean
- `references/commands.md` for concise OpenShift and Kubernetes triage commands

## Guardrails

- Prefer `oc` on OpenShift, but fall back to `kubectl` when needed.
- Do not guess a root cause from status alone. Tie it to logs, events, describe output, or container state.
- Do not recommend deleting or restarting pods as the main fix unless the evidence points to a transient issue.
- Distinguish symptom from cause. `CrashLoopBackOff` is a restart symptom, not a diagnosis.
- If access is partial, say exactly what is missing and what command would confirm the hypothesis.
