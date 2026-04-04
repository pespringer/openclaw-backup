# STORY-019 — Add dependency and blocker mapping to stories

## Status
Backlog

## Story
As a user, I want stories to declare blockers and dependencies, so that Mission Control can show what is blocked, what unlocks progress, and what should happen next.

## Why this matters
- Prevents hidden sequencing problems.
- Makes execution order clearer.
- Improves prioritization beyond raw column status.

## Acceptance Criteria
- [ ] Stories support blocker/dependency metadata.
- [ ] Blocked cards are visually identifiable.
- [ ] Dependencies are visible in story detail view.
- [ ] Board can surface unblock-first candidates.

## Projected Work
- Estimate: M
- Approach:
  1. Add dependency fields to story storage.
  2. Render dependency status on cards and in drawer.
  3. Surface blocked/unblocked signals.
  4. Keep syntax simple in markdown.
- Dependencies: current story metadata model
- Risks: dependency graphs becoming noisy without strong conventions.

## Deliverable
- Dependency/blocker-aware story model and board cues.

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

## Execution Timeline

