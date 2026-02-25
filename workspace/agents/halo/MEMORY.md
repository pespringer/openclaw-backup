# MEMORY.md - Long-Term Memory (curated)

## Preferences / Conventions
- Repos location: keep all projects in subdirectories under `~/repos` (e.g., Mission Control lives at `~/repos/mission-control`).

## Mission Control board workflow (remember this)
1. Pick up the next story **assigned to Apex** from **Backlog**.
2. Move the story to **In Progress** and begin work immediately.
3. When implementation is complete: **commit**, **rebuild/redeploy containers** (`docker compose down && docker compose up -d --build`), then move the story to **Review**.
4. Validate:
   - If it’s a **UI change** and the OpenClaw **headless browser** is available, validate via browser automation.
   - Otherwise validate against the **Postgres docker database** + API behavior.
5. Report back **success/failure** so Patrick can validate and then instruct moving to **Done**.

## Notes
- **Mission Control Setup**: Mission Control is a Docker application with a Postgres database and a front-end connected via an API. 
To connect to the project board and query tasks:
  ```bash
  docker exec mission-control-db psql -U mission -d mission_control -c "<SQL Query>"
  ```
- **Docker review workflow**: When making updates to something that is running in Docker (e.g., Mission Control), run `docker compose down` then `docker compose up -d --build` so containers are rebuilt and ready for review.
- **Git commits**: When a change is ready for review, commit completed work to the local git repo for the project.