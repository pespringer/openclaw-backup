# STORY-015 — Add in-story update history log

## Status
Backlog

## Story
As a user, I want story updates to be tracked within each story, so that the story itself contains an understandable change history over time.

## Why this matters
- Preserves operational context.
- Makes story evolution visible without relying on memory.
- Supports accountability and review.

## Acceptance Criteria
- [ ] Stories support an update log/history section.
- [ ] GUI-driven updates append meaningful entries.
- [ ] Update history is viewable in the story detail panel.
- [ ] Existing stories remain compatible.

## Projected Work
- Estimate: M
- Approach:
  1. Add update log structure to stories.
  2. Append entries on save/move/update actions.
  3. Render update history in the GUI.
  4. Keep entries readable and compact.
- Dependencies: story metadata and save/update flows
- Risks: noisy logs if updates are too granular.

## Deliverable
- Story-level update history integrated into storage and UI.

## Owner
Apex

## Priority
Medium
