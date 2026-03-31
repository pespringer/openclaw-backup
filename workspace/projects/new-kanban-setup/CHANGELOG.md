# Change Log

## 2026-03-30
- Stabilized Mission Control into a production-style deployment model:
  - Frontend on port `4310`
  - API on port `4311`
- Added a Next.js frontend with dark mode.
- Added story detail drawer with markdown-backed editing.
- Added quick move controls and drag-and-drop between columns.
- Fixed board parsing to support current markdown structure.
- Created missing story files for backlog items.
- Added `README.md` runbook.
- Added `MODULES.md` to define broader Mission Control roadmap.
- Confirmed Telegram cron announce delivery is unreliable for visible updates.
- Documented the working cron notification pattern: cron agent turn → explicit Telegram `message.send`.
- Committed working baseline as:
  - `ef8d760 feat: stabilize and expand mission control kanban`
