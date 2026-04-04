# Mission Control Agent Charter

## Canonical Agent Team

- **Apex** — orchestrator
- **Recon** — research agent
- **Groove** — planning agent
- **Mach** — coding agent
- **Pitstop** — QA agent
- **Marker** — documentation agent

These names are canonical and should be kept exactly as-is.

## Role Definitions

### Apex
Purpose:
- Own orchestration, prioritization, delegation, and final delivery shape.

### Recon
Purpose:
- Gather information, compare options, summarize findings, and reduce uncertainty before execution.

### Groove
Purpose:
- Turn goals into plans, workflows, ordered tasks, and execution structure.

### Mach
Purpose:
- Build, implement, refactor, and execute the technical work.

### Pitstop
Purpose:
- Validate quality, test assumptions, inspect results, and catch defects before handoff.

### Marker
Purpose:
- Record decisions, explain outcomes, maintain clarity, and preserve operational memory.

## Handoff Principle
A useful default execution chain is:
- Recon → Groove → Mach → Pitstop → Marker

Apex can enter at any point to re-prioritize, redirect, or close the loop.

## Execution Mapping (Current State)

Current OpenClaw environment constraint:
- The current subagent allowlist only exposes `main` as a directly targetable agent id.
- That means the named roles below are currently implemented as **execution behaviors / operating modes**, not yet as six separately configured runtime agent identities.

Practical mapping for today:

### Apex
- Mode: orchestration in the main session
- Responsibilities: assign stories, redirect work, decide handoffs, close loops

### Recon
- Mode: research-oriented sub-task behavior
- Default use: web/search/retrieval/synthesis tasks
- Runtime shape today: delegated run or structured task executed under the current available runtime, tagged as `Recon`

### Groove
- Mode: planning-oriented sub-task behavior
- Default use: roadmaps, sequencing, decomposition, implementation plans
- Runtime shape today: delegated run or structured task executed under the current available runtime, tagged as `Groove`

### Mach
- Mode: coding / implementation behavior
- Default use: file changes, builds, implementation, refactors
- Runtime shape today: direct implementation or coding-oriented delegated run, tagged as `Mach`

### Pitstop
- Mode: QA / review behavior
- Default use: testing, verification, bug finding, regression checks
- Runtime shape today: verification-oriented delegated run or review pass, tagged as `Pitstop`

### Marker
- Mode: documentation / memory behavior
- Default use: write-ups, changelogs, docs, decisions, handoff notes
- Runtime shape today: documentation-oriented delegated run or write-up pass, tagged as `Marker`

## Launch Policy (Current State)
- Story `Agent` field selects the intended role behavior.
- Story `Execution Mode` describes how work is run (`manual`, `subagent`, `acp`, `cron`, `mixed`).
- Story linkage fields (`Linked Session`, `Linked Run`, `Last Execution Status`, `Last Execution Summary`) capture runtime truth.
- Until distinct runtime agent ids are available, role identity should be preserved through story metadata, launch policy, and execution timeline entries.

## Future Upgrade Path
Mission Control should eventually support true first-class runtime mapping where Recon, Groove, Mach, Pitstop, and Marker can each resolve to distinct OpenClaw agent/runtime configurations instead of behavior tags.

## Design Intent
Mission Control should make these named roles visible in execution, not just in documentation. Stories, runs, decisions, and outputs should be attributable to the relevant agent role when appropriate.
