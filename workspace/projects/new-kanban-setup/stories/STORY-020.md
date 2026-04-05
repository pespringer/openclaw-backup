# STORY-020 — Add next-action priority mode to Mission Control

## Status
Done

## Story
As a user, I want Mission Control to highlight the best next action, so that I can act quickly without manually scanning the entire board every time.

## Why this matters
- Makes the board useful at decision time, not just review time.
- Reduces friction when returning to work cold.
- Helps enforce WIP limits and unblock high-leverage work.

## Acceptance Criteria
- [x] Mission Control can identify candidate next actions.
- [x] Priority mode considers blockers, status, and recency.
- [x] The recommended next action is clearly visible.
- [x] The reasoning is understandable, not a black box.

## Projected Work
- Estimate: M
- Approach:
  1. Define lightweight ranking rules.
  2. Add next-action summary UI.
  3. Surface why the card is recommended.
  4. Avoid over-automation.
- Dependencies: blocker/dependency signals preferred
- Risks: weak ranking logic undermining trust.

## Deliverable
- Next-action recommendation layer for Mission Control.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened

## Updated
2026-04-05T00:34:00Z

## Update Log
- 2026-04-05T00:34:00Z — implemented next-action scoring, added visible recommendation panel, verified API/UI live
- 2026-04-04T22:56:00Z — pulled into active work after STORY-019 closeout; scoping next-action ranking rules and UI entry point

## Agent
Apex

## Execution Mode
manual

## Linked Session

## Linked Run

## Last Execution Status
idle

## Last Execution Summary
Implemented next-action scoring and recommendation UI, then verified it live after restart.

## Execution Timeline
- 2026-04-05T00:34:00Z — Apex • completed • Implemented next-action scoring and recommendation UI, then verified it live after restart.
- 2026-04-04T22:56:00Z — Apex • running • Story pulled into active work after STORY-019 completion.

## Closed
2026-04-05T00:34:00Z

