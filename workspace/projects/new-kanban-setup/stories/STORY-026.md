# STORY-026 — Add execution timeline and handoff history to stories

## Status
Done



## Story
As a user, I want each story to show execution timeline and handoff history, so that agent collaboration is understandable after the fact.



## Why this matters
- Makes multi-agent work traceable.
- Preserves execution context across sessions.
- Reduces confusion when a story has been touched by multiple agents.

## Acceptance Criteria
- [X] Story detail shows execution events in time order.
- [X] Handoffs between named agents are visible.
- [X] Recent outcomes and failures are captured.
- [X] The timeline remains readable, not log spam.

## Projected Work
- Estimate: L
- Approach:
  1. Define execution event structure.
  2. Add timeline rendering to story detail.
  3. Show agent handoffs and outcomes.
  4. Keep history compact.
- Dependencies: STORY-025
- Risks: too much event noise reducing usefulness.

## Deliverable
- Execution timeline and handoff history in Mission Control.

## Actual Work
- Added a dedicated `Execution Timeline` section to story markdown.
- Parsed and rendered execution events separately from the general update log.
- Timeline entries now capture named agent, execution status, execution mode, linked session/run, and summary.
- Verified end-to-end by writing a live execution event for STORY-026 and confirming it appears in the API response after restart.

## Scope Note
- This is a compact story-level timeline, not a full event-sourcing system.
- It is intentionally readable first, with room for deeper runtime integration later.

## Owner
Apex



## Priority
Medium



## Project
Mission Control



## Opened
2026-04-03T19:21:24.648Z


## Updated
2026-04-03T19:21:47.317Z


## Update Log
- 2026-04-03T19:21:47.317Z — agent Apex → Recon · execution mode manual → subagent · linked session updated · linked run updated · execution status idle → running · execution summary updated

## Agent
Recon


## Execution Mode
subagent


## Linked Session
agent:subagent:test-story-026

## Linked Run
run-story-026-demo

## Last Execution Status
running


## Last Execution Summary
Recon started discovery pass

## Execution Timeline
- 2026-04-03T19:21:47.317Z — Recon • running • mode subagent • session agent:subagent:test-story-026 • run run-story-026-demo • Recon started discovery pass



## Closed

