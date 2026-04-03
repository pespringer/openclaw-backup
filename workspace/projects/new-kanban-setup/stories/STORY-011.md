# STORY-011 — Make Mission Control survive gateway restarts and reboots

## Status
Done


## Story
As an operator, I want Mission Control to restart automatically when the gateway restarts or the machine reboots, so that the board remains available without manual intervention.

## Why this matters
- Prevents board downtime after gateway restarts.
- Improves operational reliability.
- Removes the need for manual recovery when processes die.

## Acceptance Criteria
- [ ] Mission Control auto-starts after a reboot.
- [ ] Mission Control auto-recovers after gateway restart.
- [ ] Frontend and API are supervised or otherwise managed reliably.
- [ ] Recovery/runbook behavior is documented.

## Projected Work
- Estimate: M
- Approach:
  1. Choose a supervision model (likely systemd services or similar).
  2. Implement persistent startup for frontend and API.
  3. Validate restart/reboot survival.
  4. Document the deployment model.
- Dependencies: stable Mission Control baseline
- Risks: process ownership and permissions mismatch.

## Deliverable
- Persistent/supervised Mission Control runtime.

## Owner
Apex

## Priority
Medium

## Project
Mission Control

## Opened


## Updated


## Closed

## Update Log

