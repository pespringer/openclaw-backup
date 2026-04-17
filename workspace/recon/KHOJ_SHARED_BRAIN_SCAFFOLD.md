# Khoj Shared Brain Starter Scaffold

## Purpose

Provide a concrete starter scaffold for the shared-brain directory that Patrick, OpenClaw, Hermes, and Khoj can all use.

Recommended root:

`/home/claw/shared-brain/`

---

## Folder Layout

```text
/home/claw/shared-brain/
  inbox/
  daily/
  projects/
  research/
  memory/
  decisions/
  videos/
  creators/
  references/
  exports/
  scratch/
```

---

## Suggested Starter Files

```text
/home/claw/shared-brain/
  README.md
  inbox/
    README.md
  daily/
    README.md
  projects/
    README.md
  research/
    README.md
  memory/
    README.md
  decisions/
    README.md
  videos/
    README.md
  creators/
    README.md
  references/
    README.md
  exports/
    README.md
  scratch/
    README.md
```

---

## Root README.md

Suggested content:

### Title
Shared Brain

### Purpose
This directory is the shared note-taking and knowledge layer for Patrick, OpenClaw, Hermes, and Khoj.

### Rules
- plain files are the source of truth
- Khoj indexes this directory but does not replace it
- use meaningful file names
- keep rough notes separate from curated memory
- preserve source links where possible

---

## Folder README Suggestions

## `inbox/README.md`

### Purpose
Raw capture area for quick notes, links, pasted fragments, and unprocessed ideas.

### Put here
- rough notes
- temporary captures
- things to process later

### Do not keep here forever
Move durable items into better folders later.

---

## `daily/README.md`

### Purpose
Chronological daily context.

### Put here
- day logs
- work notes
- temporary operational summaries
- chronological context

### Naming
- `YYYY-MM-DD.md`

---

## `projects/README.md`

### Purpose
Longer-lived project notes.

### Put here
- project plans
- project architecture notes
- implementation ideas
- project decisions that are not global

---

## `research/README.md`

### Purpose
Structured research notes and evaluations.

### Put here
- product reviews
- comparisons
- technical evaluations
- market scans
- summaries of external research

### Best practice
Include sources.

---

## `memory/README.md`

### Purpose
Curated durable memory.

### Put here
- stable preferences
- recurring facts
- lasting project context
- information worth keeping across sessions

### Avoid
Do not use this as a scratch dump.

---

## `decisions/README.md`

### Purpose
Record decisions and why they were made.

### Put here
- architectural choices
- tool choices
- workflow choices
- tradeoff notes

### Naming
- `YYYY-MM-DD-decision-title.md`

---

## `videos/README.md`

### Purpose
Video research notes.

### Put here
- video summaries
- extracted tools and links
- topic rollups from video research
- creator observations related to video content

---

## `creators/README.md`

### Purpose
Profiles of recurring creators or information sources.

### Put here
- creator summaries
- what they cover
- why they are valuable
- best known links or videos

---

## `references/README.md`

### Purpose
Stable resource collection.

### Put here
- important docs
- repos
- APIs
- tools
- reusable links

---

## `exports/README.md`

### Purpose
Polished outputs for review or sharing.

### Put here
- final reports
- polished summaries
- finished briefs
- user-facing exports

---

## `scratch/README.md`

### Purpose
Temporary workspace for experiments and drafts.

### Put here
- disposable drafts
- partial work
- experiments

### Rule
Treat contents as temporary by default.

---

## Example First Notes to Create

### Example daily note
`daily/2026-04-16.md`

Suggested sections:
- What happened
- Open questions
- Follow-ups
- Notes worth promoting later

### Example research note
`research/khoj-review.md`

Suggested sections:
- Summary
- Strengths
- Weaknesses
- Fit for our stack
- Sources

### Example decision note
`decisions/2026-04-16-khoj-as-shared-brain.md`

Suggested sections:
- Decision
- Why
- Alternatives considered
- Consequences

### Example creator note
`creators/alex-finn.md`

Suggested sections:
- Covers
- Why relevant
- Best videos
- Quality notes

### Example reference note
`references/claude-code.md`

Suggested sections:
- URL
- Description
- Why it matters
- Related notes

---

## Suggested Initialization Order

1. Create the directory tree
2. Add root `README.md`
3. Add per-folder `README.md` files
4. Create today's daily note
5. Create first research note, for example Khoj review
6. Point Khoj to the root directory
7. Start writing all new durable knowledge into this structure

---

## Recommendation

Keep the first scaffold simple.

The goal is not to predict every future need. The goal is to start with a structure that is easy for Patrick, OpenClaw, Hermes, and Khoj to all understand.
