# STORY-019 — Add dependency and blocker mapping to stories

## Status
Done

## Story
As a user, I want stories to declare blockers and dependencies, so that Mission Control can show what is blocked, what unlocks progress, and what should happen next.

## Why this matters
- Prevents hidden sequencing problems.
- Makes execution order clearer.
- Improves prioritization beyond raw column status.

## Acceptance Criteria
- [x] Stories support blocker/dependency metadata.
- [x] Blocked cards are visually identifiable.
- [x] Dependencies are visible in story detail view.
- [x] Board can surface unblock-first candidates.

## Projected Work
- Estimate: M
- Approach:
  1. Add dependency fields to story storage.
  2. Render dependency status on cards and in drawer.
  3. Surface blocked/unblocked signals.
  4. Keep syntax simple in markdown.
- Dependencies: current story metadata model
- Risks: dependency graphs becoming noisy without strong conventions.

## Deliverable
- Dependency/blocker-aware story model and board cues.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened

## Dependencies
- STORY-024
- STORY-018

## Blockers

## Updated
2026-04-04T20:32:00Z

## Update Log
- 2026-04-04T20:32:00Z — restarted Mission Control, verified dependency API/UI live, and closed STORY-019
- 2026-04-04T13:20:00Z — dependency metadata model, dependency insights API, and blocked/unblock-first UI cues in progress

## Agent
Apex

## Execution Mode
manual

## Linked Session

## Linked Run

## Last Execution Status
idle

## Last Execution Summary
Mission Control restarted and dependency/blocker flow verified live.

## Execution Timeline
- 2026-04-04T20:32:00Z — Apex • completed • Mission Control restarted and dependency/blocker flow verified live.

## Closed
2026-04-04T20:32:00Z

