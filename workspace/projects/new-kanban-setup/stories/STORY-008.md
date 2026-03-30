# STORY-008 — Add System Health panel to Mission Control

## Status
In Progress

## Story
As an operator, I want Mission Control to show its own system health, so that service failures and instability are visible immediately instead of being discovered indirectly.

## Why this matters
- Reduces blind debugging.
- Makes failures obvious at the UI layer.
- Improves trust in the control surface.

## Acceptance Criteria
- [ ] Health section is visible in the UI.
- [ ] Frontend/API health is surfaced clearly.
- [ ] Recent runtime issues can be summarized in the panel.
- [ ] Panel is useful without cluttering the main board.

## Projected Work
- Estimate: M
- Approach:
  1. Define health data model.
  2. Add health endpoint and UI panel.
  3. Surface runtime state and basic diagnostics.
  4. Fit panel into Mission Control layout.
- Dependencies: stable production baseline
- Risks: overfitting to temporary process behaviors.

## Deliverable
- System Health panel integrated into Mission Control.

## Owner
Apex

## Priority
High
