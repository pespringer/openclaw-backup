# STORY-031 — Eliminate duplicate-start noise and port collision retries in Mission Control

## Status
Done

## Story
As an operator, I want Mission Control startup and restart flows to avoid duplicate process launches, so that logs stay clean, verification is trustworthy, and transient `EADDRINUSE` errors stop obscuring real problems.

## Why this matters
- Reduces noisy false-positive failures in UI/API logs.
- Makes troubleshooting much easier.
- Prevents accidental restart loops and misleading health signals.

## Acceptance Criteria
- [X] Mission Control startup path does not repeatedly attempt to bind already-owned ports.
- [X] UI and API logs no longer fill with repeated `EADDRINUSE` failures during normal restart/use.
- [X] Start/stop/restart behavior has a single clear ownership model.
- [X] Health checks distinguish real failures from already-running services.

## Projected Work
- Estimate: M
- Approach:
  1. Audit current startup/restart flow and supervision overlap.
  2. Remove or guard duplicate launch paths.
  3. Improve readiness/ownership detection.
  4. Re-test normal restart and repeated start invocations.
- Dependencies: current Mission Control runtime model
- Risks: breaking the currently working runtime while trying to clean the logs.

## Deliverable
- Clean Mission Control startup/restart behavior without duplicate-start port collision noise.

## Actual Work
- Switched Mission Control runtime scripts to prefer user-level systemd as the primary ownership model.
- Preserved manual fallback only for environments without the user services.
- Fixed the stop path so it also sweeps stray port owners after stopping systemd, which removed stale manual listeners.
- Verified a full stop/start/status cycle with clean ownership:
  - UI owned by `mission-control-ui.service`
  - API owned by `mission-control-api.service`
  - listening ports match the systemd-managed processes
- Eliminated the main source of repeated `EADDRINUSE` startup noise.

## Owner
Apex

## Priority
Medium

## Project
Mission Control

## Opened

## Updated

## Update Log

## Agent
Apex

## Execution Mode
manual

## Linked Session

## Linked Run

## Last Execution Status
idle

## Last Execution Summary

## Execution Timeline
