# Kanban Operations (Backup, Recovery, Migration)

## Persistence Model

All board data is plain text in this folder:

- `KANBAN.md` (board state)
- `stories/*.md` (card details, logs, deliverables)
- `ROADMAP.md` (high-level plan)
- `templates/` (reusable formats)
- `archive/` (completed snapshots)
- `exports/` (migration exports)

## Backup Strategy (recommended)

1. Put workspace in git (private repo).
2. Commit daily (or after meaningful progress).
3. Push to remote for off-device backup.
4. Optional: nightly filesystem backup/snapshot.

## Recovery

- Restore from git clone or filesystem backup.
- `KANBAN.md` + `stories/` reconstruct full history.
- No proprietary DB required.

## Migration

Because data is markdown, migration to Trello/Notion/Jira is straightforward.

### Minimum fields to preserve per card

- ID
- Title
- Status
- Acceptance criteria
- Projected work
- Deliverables
- Work/decision logs

### Export plan (later)

- Generate CSV/JSON into `exports/`.
- Map statuses to destination board columns.
- Keep original `STORY-###` IDs as external reference.

## Change Control

- Never rename story IDs.
- Move cards by editing status in both `KANBAN.md` and story file.
- Log meaningful decisions in each story’s Decision Log.
