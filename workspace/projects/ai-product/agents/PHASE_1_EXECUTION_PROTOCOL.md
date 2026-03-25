# Phase 1 Execution Protocol

_Operates with: **Apex (Orchestrator)**, **Mach (Coding)**, **Pitstop (QA)**_
_Last updated: 2026-03-24 (UTC)_

## Objective
Create a provably reliable build + validate (Coding + QA) loop with strict gate enforcement before scaling to Phase 2.

---

## Status Flow (Phase 1)

1) **Backlog → Ready**:
   - **Apex** confirms story is clear, scoped, and dependencies resolved.
   - Apex adds acceptance criteria if missing.
   - Apex dispatches story to **Mach (Coding)** for execution.

2) **Ready → In Progress**:
   - **Mach** begins development, adhering strictly to scoped requirements.
   - Updates work log + documents tests/changes.
   - On completion, **Mach** initiates QA handoff.

3) **In Progress → Review**:
   - **Pitstop (QA)** validates deliverables against criteria.
   - Produces pass/fail matrix + defects.
   - If fail, sends story back to **Mach** with specifics.
   - If pass, Apex progresses to Done.

4) **Review → Done** (Tests Pass):
   - Apex validates QA evidence.
   - Apex updates documentation requirement for future cycles.

---

## Decision Authority

- **Only Apex** may:
  - Move stories between statuses.
  - Push to Done or escalate blockers.

Mach / Pitstop execute only within their active swimlane.

---

## Handoff Artifacts

### Ready → In Progress (Coding Start)
- Story ID, scope, criteria (clear)
- Dependencies noted
- Branch + expected deliverables

### In Progress → Review
- Code delivered
- Test summary report
- Passed acceptance criteria checklist (self-tested by Mach)

### Review → 
- Fail: QA defect log [Pitstop to Mach iter]
- Pass: QA matrix + final ready signal

---

## Tool/Steps Match
ENTRY OUTPUT/LOG: