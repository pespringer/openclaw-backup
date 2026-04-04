# STORY-016 — Define Resume Optimizer MVP

## Status
Done

## Story
As a founder/operator, I want a sharply defined MVP for the Resume Optimizer, so that build work starts from a narrow, sellable scope instead of a vague product idea.

## Why this matters
- Prevents scope creep before coding starts.
- Makes the first build milestone concrete.
- Increases the chance of shipping something people will actually pay for.

## Acceptance Criteria
- [X] Target user is clearly defined.
- [X] Core workflow is documented end to end.
- [X] MVP feature set is limited to the smallest paid version.
- [X] Clear differentiation from a plain ChatGPT prompt is identified.

## Projected Work
- Estimate: S
- Approach:
  1. Define the buyer and user.
  2. Document the core resume optimization workflow.
  3. Cut scope to the smallest paid MVP.
  4. Identify the one feature that creates real product value.
- Dependencies: STORY-003 decision
- Risks: Accidental drift into a full career platform or generic AI wrapper.

## Deliverable
- Resume Optimizer MVP definition with user, workflow, scope, and differentiator.

## Target User
- Primary user: mid-career technical professionals applying for infrastructure, platform, DevOps, cloud, security, and engineering-adjacent roles.
- Initial buyer wedge: job seekers who already have a resume but need it tailored faster and more credibly for a specific role.

## Core Workflow
1. User uploads/pastes an existing resume.
2. User pastes a target job description.
3. Product analyzes resume-vs-job gaps.
4. Product produces:
   - an ATS-friendly tailored resume rewrite
   - a short gap/rationale report showing what changed and why
   - a focused list of suggested keyword/achievement upgrades
5. User exports the improved version and optionally iterates once.

## MVP Scope
### Include
- Resume input (paste/upload text)
- Job description input
- Tailored resume rewrite
- Match/gap summary
- Suggested keyword and bullet improvements
- Export/copy output

### Exclude (for now)
- Cover letters
- LinkedIn rewrite
- Full job search tracker
- Multi-resume library
- Interview prep workflows
- Team/collaboration features
- Deep template/design tooling

## Product Differentiator
The MVP must do one thing better than a plain ChatGPT prompt:

**Show structured, job-specific reasoning for the rewrite instead of only generating new text.**

That means the product should not just output a rewritten resume — it should also explain:
- what requirements from the job description were detected
- what relevant evidence was already present in the resume
- what was strengthened, clarified, or reordered
- what is still missing and should not be fabricated

This creates trust, makes the product feel less like a thin wrapper, and helps the user learn from each pass.

## Recommendation
Build the MVP around a single promise:

**"Paste your resume and the job posting, get back a stronger tailored version plus a clear explanation of why it fits better."**

## Next Build Step
- Define the MVP screen flow and data model for:
  - resume input
  - job description input
  - analysis output
  - rewritten resume output
  - export action

## Actual Work
- Defined the first paid MVP around a narrow resume tailoring workflow.
- Cut obvious scope creep before build start.
- Chose explainable job-specific rewrite reasoning as the key differentiator over a generic LLM prompt.

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

