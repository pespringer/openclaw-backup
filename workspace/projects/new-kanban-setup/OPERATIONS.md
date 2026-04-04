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

## Runtime Supervision

Mission Control now uses **user-level systemd** instead of relying only on `nohup` background processes.

Installed units:
- `mission-control-api.service`
- `mission-control-ui.service`
- `mission-control.target`

Expected behavior:
- API and UI auto-restart on process failure (`Restart=always`)
- Services come back with the user service manager after reboot because linger is enabled for the `claw` user
- `mission-control.target` can restart both components together

Useful commands:
```bash
systemctl --user daemon-reload
systemctl --user status mission-control-api.service mission-control-ui.service mission-control.target
systemctl --user restart mission-control.target
systemctl --user restart mission-control-api.service
systemctl --user restart mission-control-ui.service
```

Validation notes:
- Confirm ports `4310` and `4311` are listening after restart
- Confirm `/api/health` reports listening + supervised state
- Confirm the UI loads without manual process recovery

## Launch Intent Operations

Mission Control now supports durable named-agent launch intents.

### Intent source of truth
- `launch-intents/*.json`
- API endpoints:
  - `POST /api/stories/STORY-###/launch`
  - `GET /api/launch-intents`
  - `POST /api/launch-intents/<intent-id>/resolve`

### Operating model (current honest version)
- Story launch creates a pending intent.
- A trusted operator/helper in the main OpenClaw session performs the real delegated launch.
- After the real delegated run/session exists, the intent is resolved back into Mission Control with the true linked session/run identifiers.

### Helper aid
A local operator helper exists at:
- `scripts/consume-launch-intents.py`

Usage:
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
python3 scripts/consume-launch-intents.py
```

Purpose:
- list pending intents
- show the exact resolve endpoint/payload shape needed after a real delegated launch

Important:
- This helper is intentionally honest and operator-driven.
- It does not pretend the plain Node backend can directly invoke assistant-only delegated spawn tools.
- The main OpenClaw session remains the trusted runtime executor under current platform constraints.

## Change Control

- Never rename story IDs.
- Move cards by editing status in both `KANBAN.md` and story file.
- Log meaningful decisions in each story’s Decision Log.
