# Mission Control / New Kanban Setup

## Purpose
This directory contains the markdown-backed Mission Control prototype:
- Frontend UI on port `4310`
- Backend API on port `4311`
- Markdown files as the source of truth

## Ports
- Frontend: `http://192.168.5.51:4310`
- API: `http://192.168.5.51:4311/api/kanban`

## Runbook
### Supervised runtime (current production model)
Mission Control now runs under **user-level systemd** so it survives process exits and user-session boot with linger enabled.

Installed units:
- `mission-control-api.service`
- `mission-control-ui.service`
- `mission-control.target`

Useful commands:
```bash
systemctl --user status mission-control-api.service mission-control-ui.service mission-control.target
systemctl --user restart mission-control.target
systemctl --user restart mission-control-api.service
systemctl --user restart mission-control-ui.service
```

### One-command startup
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
bash ./start-mission-control.sh
```

### One-command stop
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
bash ./stop-mission-control.sh
```

### Health/status check
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
bash ./status-mission-control.sh
```

### Backend (manual)
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
node server.js
```

### Frontend (production, manual)
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup/board-frontend
npm install
npm run build
npm run start
```

## Source of truth
- Board columns: `KANBAN.md`
- Story details: `stories/STORY-###.md`

## Implemented
- Dark mode UI
- Story editor drawer
- Quick move controls
- Drag and drop column movement
- Save back to markdown
- Runtime start/stop/status scripts
- System Health panel
- Agent Operations panel
- Documentation Hub panel
- Auto-refresh + freshness indicator
- User-level systemd supervision for API + UI

## Notification rule
For Telegram cron notifications, use:
- cron `agentTurn`
- explicit `message.send` inside the run
- `delivery.mode = none`

Avoid relying on cron `announce` for Telegram-visible updates until that behavior is fixed.

## Next tracked work
- STORY-011 — restart/reboot reliability hardening
- STORY-012 — board freshness automation
