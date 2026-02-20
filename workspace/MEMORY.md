# MEMORY.md - Long-Term Memory (curated)

## Preferences / Conventions
- Repos location: keep all projects in subdirectories under `~/repos` (e.g., Mission Control lives at `~/repos/mission-control`).
- Workflow: For coding tasks, use the Mission Control Project board: create a card, move it to **In Progress** when work begins, move it to **Review** when implementation is ready for the other person to validate, then move it to **Done** after validation. Patrick manually validates work and provides the instructions to move tasks to Done. The details in the story are the definitive instructions for any work done through the board.
- When no tasks are in progress, look in the **Backlog** for stories to start as the next task.
- Once a story is picked up from Backlog, start work immediately (no need to confirm before beginning).
- **Connecting to the Project Board (Mission Control)**: Use the database running in a Docker container (Postgres). The database URL is specified in the `.env` file. Example command:
  ```bash
  docker exec mission-control-db psql -U mission -d mission_control -c "<SQL Query>"
  ```
  This allows querying the project board tasks directly from the `Task` table.
- **Browser Environment**: The browser environment is not currently set up, so direct browser-based interactions or automation are unavailable.
- **Docker review workflow**: When making updates to something that is running in Docker (e.g., Mission Control), run `docker compose down` then `docker compose up -d --build` so containers are rebuilt and ready for review.
- **Git commits**: When a change is ready for review, commit completed work to the local git repo for the project.