# Multi-Agent Playbook (Apex-Controlled)

_Last updated: 2026-03-24 (UTC)_

## Status → Agent Mapping

### Backlog
- Owner: **Apex**
- Actions:
  - Clarify objective and value
  - Ensure story has minimum metadata
  - Decide whether **Recon (Research)** is needed

### Ready
- Owner: **Apex (dispatch)**
- Actions:
  - If uncertainty high → **Recon (Research)** first
  - If scope unclear → **Groove (Planning)**
  - If scope clear and accepted → **Mach (Coding)**

### In Progress
- Owner: **Mach (Coding)**
- Actions:
  - Implement scoped work only
  - Update work log + deliverables evidence
  - Hand off to **Pitstop (QA)** with test notes

### Blocked
- Owner: **Apex**
- Actions:
  - Identify blocker type (dependency/decision/access)
  - Resolve or re-plan
  - Return to Ready or In Progress

### Review
- Owner: **Pitstop (QA)**
- Actions:
  - Validate acceptance criteria
  - Produce pass/fail matrix
  - If fail: send to In Progress with defects
  - If pass: send to **Marker (Documentation)**

### Done
- Owner: **Marker (Documentation)** (then Apex)
- Actions:
  - Finalize docs/changelog/release notes
  - Confirm artifacts complete
  - Apex posts final summary

### Shipped / Measured
- Owner: Apex
- Actions:
  - Capture outcomes and metrics
  - Record lessons learned
  - Feed backlog improvements

---

## Dispatch Decision Tree

1. Is problem/market/user signal unclear?
   - Yes → Research
2. Is implementation plan unclear?
   - Yes → Planning
3. Is scope approved + acceptance criteria defined?
   - Yes → Coding
4. Is implementation complete?
   - Yes → QA
5. QA pass?
   - No → Coding
   - Yes → Documentation → Done

---

## Card Movement Authority

- Apex: may move to any status
- Coding: may propose `In Progress -> Review`
- QA: may propose `Review -> Done` or `Review -> In Progress`
- Documentation: may propose `Done -> Shipped/Measured` (Apex final approval)

All proposals are executed by Apex for consistency.

---

## Standard Update Rhythm

For active stories, each stage must append:
- What was done
- What remains
- Risks/blockers
- ETA confidence (High/Med/Low)

---

## Failure Handling

If specialist output is weak:
1. Apex rejects handoff with concrete feedback.
2. Specialist retries once.
3. If still weak, Apex narrows scope or changes execution path.
