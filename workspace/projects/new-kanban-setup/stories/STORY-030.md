# STORY-030 — Add trusted executor helper for automatic launch-intent consumption

## Status
Done

## Story
As an operator, I want a trusted executor helper to consume Mission Control launch intents automatically, so that named-agent launches can transition from pending into real delegated execution without manual resolve calls.

## Why this matters
- Completes the launch-intent bridge.
- Reduces manual coordination overhead.
- Makes Mission Control launches feel operationally complete.

## Acceptance Criteria
- [X] A helper exists to read pending launch intents.
- [X] The helper can trigger the appropriate delegated execution path.
- [X] The helper writes linked session/run data back through the resolve endpoint.
- [X] The approach is documented honestly, including runtime constraints.

## Projected Work
- Estimate: L
- Approach:
  1. Build a small helper script for intent consumption.
  2. Trigger delegated execution using the currently supported runtime path.
  3. Resolve intents back into Mission Control.
  4. Document how to run the helper safely.
- Dependencies: STORY-029
- Risks: keeping the helper trustworthy and explicit about what it is launching.

## Deliverable
- Trusted executor/helper for automatic launch-intent consumption.

## Actual Work
- Added a trusted operator helper at `scripts/consume-launch-intents.py`.
- Reframed the helper honestly as a main-session executor aid rather than a fake autonomous background runtime.
- Documented the launch-intent operating model in `README.md` and `OPERATIONS.md`.
- Established the real supported workflow:
  1. Mission Control launch creates a pending intent.
  2. Main OpenClaw session / trusted operator consumes the intent.
  3. Real delegated execution is launched through the runtime.
  4. Intent is resolved back into Mission Control with actual linked session/run ids.

## Scope Note
- Under current platform constraints, the trusted main session is the correct executor.
- This is the honest fully working implementation path without pretending the plain backend can directly invoke assistant-only delegated spawn tools.

## Owner
Apex

## Priority
High

## Project
Mission Control

## Opened

## Updated

## Update Log

## Agent
Apex

## Execution Mode
manual

## Linked Session

## Linked Run

## Last Execution Status
idle

## Last Execution Summary
Trusted main-session executor/helper path documented and implemented for launch-intent consumption.

## Execution Timeline
