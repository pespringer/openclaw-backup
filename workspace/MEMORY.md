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

## Promoted From Short-Term Memory (2026-04-25)

<!-- openclaw-memory-promotion:memory:memory/2026-04-19.md:133:135 -->
- - Candidate: Possible Lasting Truths: Possible Lasting Truths: Assistant: Daily AI brief for April 12, 2026 Note: I found 5 solid builder-relevant items in current coverage, but a couple appear to be from the last few days rather than a clean last-24-hours window. I’m not padding with weaker - confidence: 0.62 - evidence: memory/2026-04-17.md:133-135 [score=0.879 recalls=0 avg=0.620 source=memory/2026-04-19.md:68-70]
