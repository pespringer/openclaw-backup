# STORY-013 — Add project grouping metadata to story cards

## Status
Backlog

## Story
As a user, I want each story card to show its project name, so that work can be grouped clearly across projects, agents, and sub-agents.

## Why this matters
- Improves grouping and scanability.
- Helps separate work across concurrent projects.
- Makes agent/sub-agent execution easier to understand.

## Acceptance Criteria
- [ ] Stories support a project field in markdown.
- [ ] Project name is visible on story cards in the GUI.
- [ ] Project name is editable in the story editor.
- [ ] The data model supports future project-level filtering/grouping.

## Projected Work
- Estimate: M
- Approach:
  1. Add project metadata field to stories.
  2. Surface project badge on cards.
  3. Add project editing support.
  4. Preserve compatibility with existing stories.
- Dependencies: current story metadata model
- Risks: inconsistent project naming without conventions.

## Deliverable
- Project grouping metadata integrated into story model and UI.

## Owner
Apex

## Priority
Medium
