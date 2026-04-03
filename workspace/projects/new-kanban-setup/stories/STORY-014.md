# STORY-014 — Add story lifecycle timestamps

## Status
Done







## Story
As a user, I want to see open, update, and close timestamps on each story, so that key lifecycle events are visible without manual reconstruction.







## Why this matters
- Improves auditability.
- Makes story flow easier to understand.
- Helps track pace and responsiveness.

## Acceptance Criteria
- [X] Stories support opened/updated/closed timestamp fields.
- [X] Timestamps are shown in the story detail view.
- [X] Updated timestamp changes automatically when stories change.
- [X] Closed timestamp is set when a story moves to Done.

## Projected Work
- Estimate: M
- Approach:
  1. Add timestamp fields to the story model.
  2. Update write paths to maintain timestamps.
  3. Surface timestamps in the GUI.
  4. Keep behavior sensible for existing stories.
- Dependencies: current story persistence model
- Risks: conflicting update sources if writes come from multiple paths.

## Deliverable
- Lifecycle timestamps integrated into story storage and UI.

## Actual Work
- Added opened/updated/closed lifecycle fields to the story model and API responses.
- Updated markdown write flows so opened is initialized on first write, updated refreshes on each save, and closed is set when stories move to Done and cleared when reopened.
- Surfaced lifecycle timestamps in the story detail drawer and updated timestamp visibility on board cards.
- Normalized existing story markdown to include lifecycle sections without inventing fake historical timestamps.

## Owner
Apex







## Priority
Medium







## Project
Mission Control







## Opened
2026-04-03T03:36:39.164Z







## Updated
2026-04-03T03:39:21.176Z








## Closed
2026-04-03T03:36:39.164Z

## Update Log

