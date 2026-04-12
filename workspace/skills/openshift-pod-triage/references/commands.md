# Command reference

## Basic pod state

```bash
oc get pods -n <namespace>
oc get pod <pod> -n <namespace> -o wide
oc describe pod <pod> -n <namespace>
oc get events -n <namespace> --sort-by=.lastTimestamp | tail -n 50
```

## Logs

```bash
oc logs <pod> -n <namespace> --all-containers --tail=200
oc logs <pod> -n <namespace> --all-containers --previous --tail=200
oc logs <pod> -n <namespace> -c <container> --tail=200
```

## Workload ownership

```bash
oc get pod <pod> -n <namespace> -o jsonpath='{.metadata.ownerReferences[*].kind} {.metadata.ownerReferences[*].name}'
oc get deploy,statefulset,daemonset,job,cronjob -n <namespace>
```

## Resource and scheduling checks

```bash
oc top pod <pod> -n <namespace>
oc describe node <node>
oc get resourcequota -n <namespace>
oc get limitrange -n <namespace>
```

## Storage checks

```bash
oc get pvc -n <namespace>
oc describe pvc <pvc> -n <namespace>
oc get pv
```

## Service account and secrets

```bash
oc get sa -n <namespace>
oc describe sa <service-account> -n <namespace>
oc get secret -n <namespace>
```

## YAML inspection

```bash
oc get pod <pod> -n <namespace> -o yaml
oc get deploy <deployment> -n <namespace> -o yaml
```

## Kubernetes fallback

Replace `oc` with `kubectl` when OpenShift CLI is not available.
