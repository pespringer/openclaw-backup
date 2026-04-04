# STORY-018 — Add project filter and grouping controls to Mission Control

## Status
Done

## Story
As a user, I want to filter and group the board by project name, so that multiple projects can be tracked in the same system without the board becoming noisy.

## Why this matters
- Makes the existing `Project` field operationally useful.
- Reduces cross-project noise.
- Turns project metadata into a real portfolio control, not just a label.

## Acceptance Criteria
- [X] Board supports filtering by project.
- [X] Board supports grouping cards by project.
- [X] Unassigned/missing project values are handled clearly.
- [X] Filter/group state is visible in the UI.

## Projected Work
- Estimate: M
- Approach:
  1. Add project filter UI.
  2. Add project-grouped board rendering option.
  3. Keep default board view simple.
  4. Preserve markdown compatibility.
- Dependencies: STORY-013
- Risks: UI clutter if grouping and kanban layout fight each other.

## Deliverable
- Multi-project board controls for filtering and grouping.

## Actual Work
- Added project-aware board controls in the UI.
- Implemented project filtering so the board can focus on a single project.
- Implemented grouped-by-project rendering so multiple projects can be viewed as separate sections in one surface.
- Preserved existing markdown compatibility by deriving project options from story metadata already on the board.

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

