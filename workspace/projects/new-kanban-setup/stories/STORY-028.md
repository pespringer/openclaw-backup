# STORY-028 — Add launch controls for named agent execution from stories

## Status
Done

## Story
As a user, I want to launch named-agent work directly from a story, so that Recon, Groove, Mach, Pitstop, and Marker can be used operationally instead of only as metadata.

## Why this matters
- Turns the named agent model into an actionable workflow.
- Reduces friction between planning and execution.
- Ensures launched work writes linkage data back to the story.

## Acceptance Criteria
- [X] Story detail exposes launch controls for named-agent execution.
- [X] Launch behavior respects the current role-to-runtime mapping.
- [X] Launched work writes back linked session/run metadata.
- [X] Execution status and timeline update after launch.

## Projected Work
- Estimate: L
- Approach:
  1. Define launch actions per named agent role.
  2. Trigger the appropriate runtime behavior from the story.
  3. Write linked execution metadata back to the story.
  4. Reflect launched state in the execution timeline.
- Dependencies: STORY-027, STORY-025, STORY-026
- Risks: overpromising runtime separation beyond what the current OpenClaw environment supports.

## Deliverable
- Launch controls that connect story cards to named-agent execution.

## Actual Work
- Added launch controls in story detail for named agent execution.
- Added a launch API endpoint that applies the current role-to-runtime mapping honestly.
- Launch actions now write back:
  - agent
  - execution mode
  - linked session
  - linked run
  - execution status
  - execution summary
- Launch actions also append a new execution timeline event.
- Verified live by launching Recon from STORY-028 and confirming linked metadata plus timeline output in the API response after restart.

## Scope Note
- The current environment still does not provide six separate configured OpenClaw runtime agent ids.
- Launch controls therefore create truthful role-based execution linkage under the current runtime model rather than pretending full runtime separation already exists.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened
2026-04-03T21:20:43.089Z

## Updated
2026-04-03T21:20:43.089Z

## Update Log
- 2026-04-03T21:20:43.089Z — agent Apex → Recon · execution mode manual → subagent · linked session updated · linked run updated · execution status idle → running · execution summary updated

## Agent
Recon


## Execution Mode
subagent


## Linked Session
agent:subagent:story-028:recon

## Linked Run
launch:STORY-028:Recon:2026-04-03T21:20:43.089Z

## Last Execution Status
running


## Last Execution Summary
Recon launched for research/discovery pass

## Execution Timeline
- 2026-04-03T21:20:43.089Z — Recon • running • mode subagent • session agent:subagent:story-028:recon • run launch:STORY-028:Recon:2026-04-03T21:20:43.089Z • Recon launched for research/discovery pass


## Closed
