# Kanban UI (File-backed)

Local GUI for `projects/ai-product` Kanban that reads/writes markdown files directly.

## Run

```bash
cd projects/ai-product/kanban-ui
node server.js
# open http://127.0.0.1:4310
```

## v0.2 Features

- Kanban board with drag/drop status moves
- Full story markdown editor + save
- Create new card from GUI
- Archive card (moves file to `../archive` and removes from board)
- Card filter/search
- Export board data:
  - `GET /api/export?format=json`
  - `GET /api/export?format=csv`
- Activity panel + log (`../activity.log`)

## Source of truth

- `../KANBAN.md` for board state
- `../stories/*.md` for card details
- `../archive/*.md` for archived cards

No hidden database state.

## Current limits

- Assumes story IDs are `STORY-###`
- Single-writer workflow (no optimistic locking yet)
- Basic markdown parsing against current board format
