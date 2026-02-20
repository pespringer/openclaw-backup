# WORKFLOW_AUTO.md

This file exists to satisfy OpenClaw's post-compaction audit checks.

## Default operating workflow

- Follow the workspace rules in `AGENTS.md`.
- Follow identity/behavior guidance in `SOUL.md`.
- Follow user-specific preferences in `USER.md`.
- Use `MEMORY.md` + daily `memory/YYYY-MM-DD.md` for continuity.

## Mission Control board workflow (summary)

- Source of truth for the project board is the Mission Control Postgres DB (Docker).
- When no tasks are in progress: pick the next task from **Backlog**.
- Once a task is moved to **In Progress**: start implementation immediately.
- When ready: commit changes, rebuild containers (`docker compose down && docker compose up -d --build`), perform UI validation (headless browser), then move task to **Review**.
- Move tasks to **Done** only when Patrick instructs.

## External actions

- Ask before sending messages/emails/posts outside of this chat unless explicitly requested.

