# STORY-017 — Define Resume Optimizer MVP screen flow and data model

## Status
Done

## Story
As a founder/operator, I want the MVP screen flow and core data model defined, so that implementation can begin without product ambiguity.

## Why this matters
- Turns the MVP concept into a buildable plan.
- Reduces rework during implementation.
- Makes coding tasks easier to scope and sequence.

## Acceptance Criteria
- [X] MVP screens are identified in order.
- [X] Core user flow is documented.
- [X] Main data objects and fields are defined.
- [X] Open questions / future scope are separated from MVP requirements.

## Projected Work
- Estimate: S
- Approach:
  1. Define the minimum screen set.
  2. Document the happy-path flow.
  3. Define the core data model.
  4. Separate MVP from later enhancements.
- Dependencies: STORY-016 MVP definition
- Risks: Overdesigning architecture before implementation starts.

## Deliverable
- Build-ready MVP screen flow and data model for the Resume Optimizer.

## MVP Screen Flow
### 1. Landing / Start Screen
Purpose:
- Explain the single core promise.
- Start a resume tailoring session.

Primary actions:
- Paste/upload existing resume
- Paste target job description
- Start analysis

### 2. Analysis Review Screen
Purpose:
- Show what the system found before the rewrite is accepted.

Primary sections:
- Detected role/title focus
- Key requirements extracted from job description
- Matching experience already found in the resume
- Missing or weak areas

Primary actions:
- Continue to tailored rewrite
- Go back and edit inputs

### 3. Tailored Resume Output Screen
Purpose:
- Present the improved resume draft and structured explanation.

Primary sections:
- Tailored resume output
- Change rationale / explanation panel
- Keyword and bullet improvement suggestions

Primary actions:
- Copy/export result
- Revise inputs and rerun once

## Happy Path User Flow
1. User lands on the start screen.
2. User pastes existing resume.
3. User pastes job description.
4. System analyzes both inputs.
5. User reviews extracted requirements and fit gaps.
6. User proceeds to generated tailored resume.
7. User reviews the rewritten resume plus explanation.
8. User copies/exports the output and leaves.

## Core Data Model
### ResumeSession
- `id`
- `createdAt`
- `updatedAt`
- `sourceResumeText`
- `jobDescriptionText`
- `status` (`draft`, `analyzed`, `generated`)

### JobAnalysis
- `targetRoleTitle`
- `keywordsDetected[]`
- `coreRequirements[]`
- `matchedEvidence[]`
- `gaps[]`
- `warnings[]` (ex: missing measurable achievements, unclear tech stack, unsupported claims)

### TailoredOutput
- `tailoredResumeText`
- `changeSummary[]`
- `keywordSuggestions[]`
- `bulletImprovementSuggestions[]`
- `exportFormat` (initial MVP can just be `text`)

## MVP Boundaries
### In MVP
- Single-session flow
- Paste/upload resume text
- Paste job description
- Analysis + rewrite + explanation
- Copy/export text output

### Not in MVP
- User accounts
- Saved project history
- Resume template marketplace
- PDF layout designer
- Cover letter generation
- LinkedIn profile rewrite
- Multi-job batch tailoring
- Interview coaching

## Open Questions (later, not blockers)
- Should first export be plain text only or also DOCX?
- Should users be allowed more than one rerun in MVP?
- What is the cleanest way to highlight unsupported claims without sounding accusatory?

## Actual Work
- Converted the MVP concept into a concrete screen flow and core object model.
- Kept the data model intentionally lean so implementation can start fast.
- Split MVP requirements from future expansion to reduce build drift.

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

