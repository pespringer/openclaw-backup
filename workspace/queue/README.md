# Delegation queue (persistent specialists without Telegram threads)

Telegram can’t keep thread-bound subagent sessions. This queue lets `main` delegate to static specialists (coder/researcher/doc) in a durable, inspectable way.

## Folders
- `coder/`, `researcher/`, `doc/`: inbound jobs
- `done/`: completed jobs (result JSON)
- `failed/`: failed jobs (result JSON)

## Job JSON schema (v1)

```json
{
  "id": "2026-03-02T13:00:00Z__short-title",
  "createdAt": "2026-03-02T13:00:00Z",
  "from": "main",
  "to": "coder",
  "title": "Short title",
  "task": "Full instructions",
  "context": {
    "repo": "~/repos/mission-control"
  },
  "replyTo": {
    "channel": "telegram",
    "target": "telegram:8445509532"
  }
}
```

## Processing rules
- A worker claims a job by atomic rename/move.
- Exactly-once best-effort: claimed jobs are moved to done/failed.
- Results should include a short summary plus any artifacts/paths.
