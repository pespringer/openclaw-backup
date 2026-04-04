# STORY-027 — Map named agents to OpenClaw execution behaviors

## Status
Done

## Story
As an operator, I want the named Mission Control agents to map to real OpenClaw execution behaviors, so that Recon, Groove, Mach, Pitstop, and Marker are actionable runtime roles instead of documentation-only labels.

## Why this matters
- Makes the named agent system operational.
- Bridges role identity to actual execution behavior.
- Clarifies what automation is possible now versus later.

## Acceptance Criteria
- [X] Each named agent has a defined execution behavior.
- [X] Current OpenClaw runtime constraints are documented honestly.
- [X] A practical launch policy exists for using named agents today.
- [X] Future separation into distinct runtime agents is identified cleanly.

## Projected Work
- Estimate: M
- Approach:
  1. Inspect current OpenClaw agent/runtime capabilities.
  2. Define role-to-behavior mapping.
  3. Document present-day launch rules.
  4. Identify the gap to full first-class agent runtime support.
- Dependencies: STORY-023 to STORY-026
- Risks: pretending separate runtime agents exist when the current environment does not support them.

## Deliverable
- Role-to-runtime mapping for Mission Control named agents.

## Actual Work
- Inspected the current OpenClaw runtime and confirmed that only `main` is exposed as a directly targetable agent id in this environment.
- Defined each named agent as a practical execution behavior today:
  - Apex → orchestration
  - Recon → research
  - Groove → planning
  - Mach → coding
  - Pitstop → QA
  - Marker → documentation
- Documented the current launch policy in `AGENT_CHARTER.md`, including the honest constraint that role identity is currently preserved through story metadata and execution behavior rather than six distinct runtime agent ids.
- Defined the future upgrade path to true first-class runtime agent separation.

## Decision
Mission Control will use the named agent system immediately as a **role-and-behavior layer**.

It will not pretend that the current OpenClaw environment already provides six independent configured runtime agents. That separation remains a future enhancement.

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
Mapped named agents to current OpenClaw execution behaviors and documented runtime constraints honestly.

## Execution Timeline
