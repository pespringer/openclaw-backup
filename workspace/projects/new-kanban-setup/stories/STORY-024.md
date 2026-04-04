# STORY-024 — Add named agent assignment to stories

## Status
Done

## Story
As a user, I want stories to be assignable to named agents like Recon, Groove, Mach, Pitstop, and Marker, so that work can be routed by role instead of generic ownership only.

## Why this matters
- Makes delegation visible.
- Improves story-to-agent clarity.
- Prepares the board for real multi-agent execution.

## Acceptance Criteria
- [X] Stories support a named agent assignment field.
- [X] Agent assignment is visible on cards and in story detail.
- [X] Agent assignment is editable.
- [X] Existing owner/project fields remain compatible.

## Projected Work
- Estimate: M
- Approach:
  1. Add agent assignment metadata.
  2. Surface it in UI.
  3. Keep markdown syntax simple.
  4. Preserve compatibility with older stories.
- Dependencies: STORY-023
- Risks: confusion between human owner and execution agent if both are not clearly shown.

## Deliverable
- Named-agent assignment support in story model and UI.

## Actual Work
- Added a distinct `Agent` field to the story markdown model.
- Surfaced agent assignment in API responses, story editor controls, and board card metadata.
- Preserved the existing `Owner` field so human ownership and execution-role assignment remain separate.
- Normalized existing stories to include an `Agent` section with backward-compatible defaults.

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

