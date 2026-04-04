# STORY-005 — Stabilize Mission Control deployment

## Status
Done

## Story
As an operator, I want Mission Control to run in a stable production mode, so that the UI and API do not disappear during normal use.

## Why this matters
- Eliminates dev-server instability.
- Prevents port churn and random process loss.
- Makes the board dependable enough to build on.

## Acceptance Criteria
- [X] Frontend runs in production mode on port 4310.
- [X] API runs reliably on port 4311.
- [X] Startup instructions are documented.
- [X] Core flows work after restart.

## Projected Work
- Estimate: M
- Approach:
  1. Build the frontend.
  2. Run frontend with `next start`.
  3. Validate API and UI together.
  4. Document startup and recovery.
- Dependencies: board-frontend, server.js
- Risks: lingering dev-process conflicts.

## Deliverable
- Stable production-ready Mission Control baseline.

## Actual Work
- Built the frontend for production mode.
- Switched the frontend from dev server to `next start`.
- Verified UI/API paths repeatedly during runtime stabilization.
- Identified recurring API process drops as the main remaining stability issue.
- Added start/stop/status scripts for consistent runtime control.
- Validated full stack restart and health checks through the new scripts.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened


## Updated


## Closed

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

