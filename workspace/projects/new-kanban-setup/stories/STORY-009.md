# STORY-009 — Add Agent Operations module to Mission Control

## Status
In Progress

## Story
As an operator, I want Mission Control to show agent activity and execution state, so that I can understand what is running, blocked, or recently completed.

## Why this matters
- Makes agent work visible.
- Connects execution to stories.
- Reduces the need to inspect logs manually.

## Acceptance Criteria
- [ ] Agent activity section exists in the UI.
- [ ] Active and recent agent state is summarized.
- [ ] Failures and blocked states are visible.
- [ ] The view supports expansion later.

## Projected Work
- Estimate: M
- Approach:
  1. Define initial agent activity model.
  2. Add backend aggregation.
  3. Render operational summaries in UI.
  4. Leave hooks for future detail views.
- Dependencies: system health baseline
- Risks: surfacing noisy low-value status.

## Deliverable
- Agent Operations panel integrated into Mission Control.

## Owner
Apex

## Priority
Medium
