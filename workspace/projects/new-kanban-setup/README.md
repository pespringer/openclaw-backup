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
### Backend
```bash
cd /home/claw/.openclaw/workspace/projects/new-kanban-setup
node server.js
```

### Frontend (production)
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

## Next tracked work
- STORY-005 — Stabilize Mission Control deployment
- STORY-006 — Polish Mission Control UX
- STORY-007 — Define broader Mission Control modules
