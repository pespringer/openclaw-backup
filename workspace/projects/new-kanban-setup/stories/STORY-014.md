# STORY-014 — Add story lifecycle timestamps

## Status
Backlog

## Story
As a user, I want to see open, update, and close timestamps on each story, so that key lifecycle events are visible without manual reconstruction.

## Why this matters
- Improves auditability.
- Makes story flow easier to understand.
- Helps track pace and responsiveness.

## Acceptance Criteria
- [ ] Stories support opened/updated/closed timestamp fields.
- [ ] Timestamps are shown in the story detail view.
- [ ] Updated timestamp changes automatically when stories change.
- [ ] Closed timestamp is set when a story moves to Done.

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

## Owner
Apex

## Priority
Medium
