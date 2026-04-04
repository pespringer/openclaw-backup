# STORY-013 — Add project grouping metadata to story cards

## Status
Done


## Story
As a user, I want each story card to show its project name, so that work can be grouped clearly across projects, agents, and sub-agents.

## Why this matters
- Improves grouping and scanability.
- Helps separate work across concurrent projects.
- Makes agent/sub-agent execution easier to understand.

## Acceptance Criteria
- [X] Stories support a project field in markdown.
- [X] Project name is visible on story cards in the GUI.
- [X] Project name is editable in the story editor.
- [X] The data model supports future project-level filtering/grouping.

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

## Actual Work
- Verified project metadata flows through markdown parsing, API read/write paths, story editor, and board card rendering.
- Normalized existing story files to include a `Project` section for compatibility and future grouping/filtering.

## Owner
Apex

## Priority
Medium

## Project
Mission Control

## Opened


## Updated


## Closed

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

