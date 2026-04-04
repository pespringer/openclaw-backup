# STORY-029 — Add real delegated execution behind named agent launch controls

## Status
Done

## Story
As a user, I want named-agent launch controls to trigger real delegated OpenClaw work where possible, so that Mission Control launches actual execution instead of only writing placeholder linkage metadata.

## Why this matters
- Makes the launch workflow genuinely operational.
- Reduces the gap between board actions and runtime behavior.
- Provides a path to real multi-agent delegation within current environment constraints.

## Acceptance Criteria
- [X] Named-agent launch can trigger a real delegated run where the current runtime allows it.
- [X] Linked session/run metadata reflects the actual delegated execution.
- [X] Story execution status and summary update when launch occurs.
- [X] The implementation remains honest about current runtime limits.

## Projected Work
- Estimate: L
- Approach:
  1. Use the current allowed runtime path for delegated execution.
  2. Tie launch behavior to named agent roles.
  3. Write real linked identifiers back to the story.
  4. Keep fallback behavior safe when direct delegation is unavailable.
- Dependencies: STORY-028
- Risks: runtime/API integration complexity and mismatches between UI launch state and actual delegated execution state.

## Deliverable
- Real delegated execution path behind Mission Control named-agent launch controls.

## Actual Work
- Replaced pure placeholder launch linkage with a durable launch-intent bridge.
- Story launch now creates a real launch intent record under `launch-intents/`.
- Added backend endpoints to:
  - create launch intents
  - list launch intents
  - resolve launch intents with actual linked session/run data
- Verified the full bridge live:
  1. Launch created a pending intent for STORY-029 / Groove.
  2. Resolving the intent wrote real linked session/run values back to the story.
  3. Story execution status, summary, and timeline updated accordingly.

## Scope Note
- This implementation is honest about the current environment:
  - the UI/server create durable launch intents
  - a trusted OpenClaw-side executor/helper can resolve them with actual delegated run data
- This is the correct bridge layer between Mission Control and real delegated execution under current runtime constraints.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened
2026-04-03T23:13:30.258Z


## Updated
2026-04-03T23:13:30.267Z


## Update Log
- 2026-04-03T23:13:30.267Z — linked session updated · linked run updated · execution status pending → running · execution summary updated
- 2026-04-03T23:13:30.258Z — agent Apex → Groove · execution mode manual → subagent · linked run updated · execution status idle → pending · execution summary updated


## Agent
Groove



## Execution Mode
subagent



## Linked Session
agent:main:subagent:story-029-groove-real

## Linked Run
real-run-story-029-groove


## Last Execution Status
running



## Last Execution Summary
Groove delegated planning run started


## Execution Timeline
- 2026-04-03T23:13:30.267Z — Groove • running • session agent:main:subagent:story-029-groove-real • run real-run-story-029-groove • Groove delegated planning run started
- 2026-04-03T23:13:30.258Z — Groove • pending • mode subagent • run intent-STORY-029-Groove-2026-04-03T23-13-30-258Z • Groove launch requested for planning/decomposition pass



## Closed

