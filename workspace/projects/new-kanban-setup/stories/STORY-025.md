# STORY-025 — Add story-to-run linkage for delegated agent work

## Status
Done

## Story
As a user, I want Mission Control stories to link to actual delegated runs and sessions, so that multi-agent execution is grounded in real runtime activity instead of implied status.

## Why this matters
- Solves the earlier disconnect between the board and real agent/sub-agent execution.
- Makes delegation auditable.
- Provides a bridge between planning and runtime truth.

## Acceptance Criteria
- [X] Stories can reference a delegated run/session.
- [X] Last execution status is visible.
- [X] Last execution summary is visible.
- [X] Links to related runs/sessions are accessible from the story.

## Projected Work
- Estimate: L
- Approach:
  1. Define execution linkage metadata.
  2. Map story records to runs/sessions.
  3. Render runtime truth in Mission Control.
  4. Keep history lightweight but useful.
- Dependencies: STORY-024, current agent operations surface
- Risks: ephemeral session data making history inconsistent without durable snapshots.

## Deliverable
- Story-to-run linkage model and runtime visibility.

## Actual Work
- Added explicit execution linkage fields to the story model:
  - `Execution Mode`
  - `Linked Session`
  - `Linked Run`
  - `Last Execution Status`
  - `Last Execution Summary`
- Surfaced execution linkage and latest execution state in the board UI and story detail drawer.
- Preserved compatibility by normalizing existing stories with default execution metadata.
- Established a durable manual linkage path so stories can now point to real delegated runs/sessions even before deeper runtime auto-mapping is implemented.

## Scope Note
- This story establishes the durable metadata model and UI visibility.
- Automatic runtime correlation can be improved later, but Mission Control no longer has to rely purely on implied or regex-derived linkage.

## Owner
Apex

## Priority
High

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

