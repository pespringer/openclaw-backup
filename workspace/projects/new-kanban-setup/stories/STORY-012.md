# STORY-012 — Keep Mission Control board state fresh automatically

## Status
Done

## Story
As a user, I want the Mission Control board to refresh automatically and immediately reflect in-GUI changes, so that the displayed state stays current without manual reloads.

## Why this matters
- Prevents stale board views.
- Makes collaboration with background updates more reliable.
- Improves trust in the GUI as the current source of operational truth.

## Acceptance Criteria
- [ ] Board auto-refreshes on a defined interval.
- [ ] A visible freshness/last-updated indicator is shown.
- [ ] Story changes made inside the GUI refresh the displayed state immediately.
- [ ] Save/move/create/update flows leave the board in a current state without manual reload.

## Projected Work
- Estimate: M
- Approach:
  1. Add refresh cadence and freshness indicator.
  2. Ensure post-action reloads are immediate and reliable.
  3. Avoid disruptive refreshes while editing.
  4. Validate state consistency after story changes.
- Dependencies: stable runtime baseline
- Risks: refresh timing interfering with in-progress edits.

## Deliverable
- Board freshness automation and current-state UX improvements.

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

