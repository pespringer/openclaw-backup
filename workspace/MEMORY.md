### 2026-04-10 — Multi-Agent Setup Notes

- Successfully added the `Coding` and `QA` agents.
- Observed Issues:
  - Agents were added, but routing bindings were not automatically created.
  - Tasks must be explicitly routed to new agents after creation.
- Resolution:
  - Future agent creation needs manual binding to integrate into the task dispatch system.
- Actionable Knowledge:
  - Commands for new agent setup:
    ```bash
    openclaw agents add <agent-name>
    openclaw agents bind <binding-rule>
    ```
  - Validate bindings post-setup using:
    ```bash
    openclaw agents bindings
    ```
  - Common troubleshooting step: ensure agents appear in the list after binding.
