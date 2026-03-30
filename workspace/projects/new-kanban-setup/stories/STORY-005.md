# STORY-005 — Stabilize Mission Control deployment

## Status
Ready

## Story
As an operator, I want Mission Control to run in a stable production mode, so that the UI and API do not disappear during normal use.

## Why this matters
- Eliminates dev-server instability.
- Prevents port churn and random process loss.
- Makes the board dependable enough to build on.

## Acceptance Criteria
- [ ] Frontend runs in production mode on port 4310.
- [ ] API runs reliably on port 4311.
- [ ] Startup instructions are documented.
- [ ] Core flows work after restart.

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

## Owner
Apex

## Priority
High
