# STORY-023 — Formalize named agent roles in Mission Control

## Status
Done

## Story
As an operator, I want the named agent team formalized in Mission Control, so that delegation, ownership, and handoffs use a consistent vocabulary.

## Why this matters
- Makes multi-agent work easier to reason about.
- Prevents role drift and naming churn.
- Establishes a durable execution model for future automation.

## Acceptance Criteria
- [X] Agent charter exists in the project.
- [X] Named roles are documented consistently.
- [X] Mission Control docs reference the canonical agent team.
- [X] The role set is stable enough for future UI/runtime linkage.

## Projected Work
- Estimate: S
- Approach:
  1. Define canonical agent names and purposes.
  2. Document handoff expectations.
  3. Reference the charter from project docs.
  4. Treat names as stable identifiers.
- Dependencies: Patrick-approved agent names
- Risks: role overlap if responsibilities are too vague.

## Deliverable
- Formal agent charter for Mission Control.

## Actual Work
- Added `AGENT_CHARTER.md` as the canonical home for Mission Control agent roles.
- Locked the approved role names and responsibilities:
  - Apex
  - Recon
  - Groove
  - Mach
  - Pitstop
  - Marker
- Documented the default handoff chain and referenced the charter from the main project README.

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

