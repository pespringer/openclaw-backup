# STORY-015 — Add in-story update history log

## Status
Done







## Story
As a user, I want story updates to be tracked within each story, so that the story itself contains an understandable change history over time. This should remain readable in history validation.





## Why this matters
- Preserves operational context.
- Makes story evolution visible without relying on memory.
- Supports accountability and review.

## Acceptance Criteria
- [X] Stories support an update log/history section.
- [X] GUI-driven updates append meaningful entries.
- [X] Update history is viewable in the story detail panel.
- [X] Existing stories remain compatible.

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

## Actual Work
- Added a markdown-backed `Update Log` section to stories and exposed it through the story API.
- Appended compact history entries for meaningful saves and explicit move actions.
- Rendered update history in the story detail drawer with compatibility for existing stories.
- Verified save-driven and move-driven entries against the live API.

## Owner
Apex





## Priority
Medium





## Project
Mission Control





## Opened
2026-04-03T03:50:15.186Z







## Updated
2026-04-03T03:51:28.418Z






## Update Log
- 2026-04-03T03:51:28.418Z — moved Ready → In Progress
- 2026-04-03T03:51:13.596Z — status In Progress → Ready

- 2026-04-03T03:51:13.590Z — story details updated




## Closed





