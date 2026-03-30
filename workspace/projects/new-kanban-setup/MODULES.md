# Mission Control Modules

## Purpose
This document defines the next expansion layers for Mission Control beyond the current markdown-backed Kanban board.

## Module 1 — Execution Board
**Status:** Implemented baseline

Purpose:
- Track stories, priorities, ownership, and delivery state.

Current capabilities:
- Board rendering
- Story editing
- Quick move controls
- Drag and drop
- Markdown persistence

## Module 2 — Agent Operations
**Status:** Planned

Purpose:
- Show active agents, queued tasks, recent completions, failures, and execution history.

Initial scope:
- Active agent list
- Current task / last task
- Status badges (idle/running/blocked/failed)
- Links back to related story cards

## Module 3 — Research Desk
**Status:** Planned

Purpose:
- Track research threads, findings, source links, and open questions.

Initial scope:
- Research cards
- Source capture
- Summary notes
- Decision support links into project stories

## Module 4 — Documentation Hub
**Status:** Planned

Purpose:
- Provide a structured view of important docs, runbooks, decisions, and architecture notes.

Initial scope:
- Key docs list
- Decision log viewer
- Runbook shortcuts
- Cross-links to stories/modules

## Module 5 — Project Portfolio
**Status:** Planned

Purpose:
- Track multiple projects/products, not just a single kanban lane.

Initial scope:
- Project switcher
- Per-project board summaries
- Health/status overview
- Milestone rollups

## Module 6 — System Health / Environment
**Status:** Planned

Purpose:
- Surface operational issues affecting Mission Control or agent execution.

Initial scope:
- Port/service checks
- Recent failures
- Cron/heartbeat status
- Environment notes and recovery actions

## Recommended rollout order
1. Stabilize Execution Board
2. Polish UX and error handling
3. Add Agent Operations
4. Add Documentation Hub
5. Add Research Desk
6. Add Project Portfolio
7. Add System Health dashboard

## Design principle
Mission Control should become the single practical surface for:
- what is happening
- what is blocked
- what needs attention next
- what the agents are doing
- what decisions have already been made
