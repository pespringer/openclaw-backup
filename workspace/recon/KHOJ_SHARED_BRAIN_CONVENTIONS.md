# Khoj Shared Brain Read/Write Conventions

## Purpose

Define how Patrick, OpenClaw, and Hermes should write to and read from the shared brain.

The goal is to keep the shared corpus:
- understandable
- low-noise
- easy to index with Khoj
- usable by both humans and agents

---

## Core Principle

The shared brain is a **shared knowledge layer**, not a dump folder.

Everyone should write in a way that makes future retrieval easier.

That means:
- notes should be scoped
- titles should be meaningful
- durable knowledge should be separated from raw capture
- provenance should be preserved when possible

---

## Actors

### Patrick
Human author, reviewer, and primary owner of the corpus.

### OpenClaw
Research and operational assistant that writes structured findings, summaries, and extracted notes.

### Hermes
Additional agent/system participant that may generate notes, memory artifacts, or project-specific knowledge.

---

## Shared Corpus Roles

### Inbox
For quick capture and unprocessed material.

### Daily
For chronological context and short-term operational logging.

### Research
For structured external research, comparisons, evaluations, and syntheses.

### Projects
For longer-lived work organized by initiative.

### Memory
For curated durable facts and long-term context.

### Decisions
For architectural and workflow decisions with rationale.

### Videos
For video summaries, creator notes, and extracted references.

### Creators
For recurring source profiles.

### References
For stable resources, repos, docs, APIs, and tool links.

### Exports
For polished user-facing outputs.

### Scratch
For disposable drafts and experiments.

---

## What Patrick Should Write

### Good destinations
- `inbox/` for quick notes and raw thoughts
- `daily/` for day logs and ongoing context
- `projects/` for project-specific notes
- `decisions/` for important choices
- `memory/` for durable personal/system facts

### Suggested style
- use meaningful titles
- keep one note focused on one topic when possible
- write naturally, no special machine format required

### Best practices
- if something matters long term, move it out of `inbox/`
- if something is a decision, put it in `decisions/`
- if something is research, prefer `research/` over `daily/`

---

## What OpenClaw Should Write

### Primary write targets
- `research/`
- `videos/`
- `creators/`
- `references/`
- `daily/`
- `memory/`
- `exports/`

### What OpenClaw should write there

#### `research/`
- product reviews
- tool comparisons
- architecture evaluations
- web research syntheses
- technical notes

#### `videos/`
- summaries of videos
- extracted tools and links
- creator-related observations
- topic rollups connected to video research

#### `creators/`
- creator profiles
- subject areas they cover
- quality judgments
- recommended next sources

#### `references/`
- docs links
- repos
- APIs
- tools worth remembering

#### `daily/`
- notable daily work log entries
- compact session summaries when useful

#### `memory/`
- durable preferences
- recurring facts
- stable project context
- only high-signal information

#### `exports/`
- polished reports
- user-facing briefs
- finished summaries

### OpenClaw writing rules
- prefer markdown
- include source links when doing research
- preserve provenance where practical
- avoid writing giant undifferentiated notes
- avoid placing transient notes into `memory/`

---

## What Hermes Should Write

### Primary write targets
- `projects/`
- `daily/`
- `memory/`
- `research/`
- `scratch/`

### Hermes writing goals
- export important outputs into the shared corpus
- avoid keeping all useful knowledge trapped in its own internal memory
- follow the same folder semantics as OpenClaw whenever possible

### Hermes writing rules
- raw or experimental material can go to `scratch/`
- durable insights should be promoted into `memory/`
- project-specific outputs belong in `projects/`
- research belongs in `research/`

---

## Universal Writing Rules

## Rule 1: One note, one purpose

Prefer one focused note per topic over giant mixed notes.

### Good
- `research/khoj-review.md`
- `decisions/2026-04-15-khoj-shared-brain.md`

### Less good
- `random-thoughts-and-research.md`

---

## Rule 2: Use meaningful titles

Titles should help a human and Khoj understand what the note is about.

### Good
- `Claude Code agent memory tradeoffs`
- `Khoj as shared second brain`

### Less good
- `notes`
- `stuff`
- `ideas`

---

## Rule 3: Preserve provenance

If a note is based on a source, include:
- URL
- repo link
- doc link
- creator/video link
- quote source when helpful

This matters for trust and later verification.

---

## Rule 4: Separate raw from curated

### Raw or temporary material
- `inbox/`
- `scratch/`
- sometimes `daily/`

### Curated durable material
- `memory/`
- `decisions/`
- well-maintained `research/`
- stable `references/`

Do not mix these casually.

---

## Rule 5: Avoid memory inflation

Not every note belongs in `memory/`.

Only promote something to `memory/` if it is:
- likely to matter later
- stable enough to keep
- useful across sessions or tools

---

## Rule 6: Prefer small updates over giant rewrites

Incremental notes are easier to maintain and index.

---

## Rule 7: Write for retrieval

Use headings, bullets, and labels naturally.

Good structure helps Khoj retrieve meaningful context later.

---

## Suggested Metadata Pattern

Formal frontmatter is optional. Use simple headings unless strict metadata becomes necessary.

When useful, include lightweight sections like:
- Summary
- Key points
- Sources
- Open questions
- Decision
- Next steps

That is usually enough.

---

## Promotion Guidance

### Promote from `inbox/` or `daily/` into `memory/` when
- it is repeatedly useful
- it is a stable preference or fact
- it affects future decisions or workflows

### Promote from `research/` into `decisions/` when
- a choice has been made
- a tradeoff has been resolved

### Promote from `videos/` into `creators/` or `references/` when
- a creator or resource repeatedly proves valuable

---

## Reading Conventions

## Patrick reading priorities
- `exports/` for finished outputs
- `decisions/` for important choices
- `memory/` for durable context
- `research/` for deeper technical notes

## OpenClaw reading priorities
- `memory/`
- recent `daily/`
- relevant `projects/`
- relevant `research/`
- `decisions/`

## Hermes reading priorities
- `memory/`
- `projects/`
- `decisions/`
- relevant `research/`

---

## Anti-Patterns to Avoid

- dumping everything into one giant memory file
- mixing polished reports with scratch notes
- saving research without source links
- using vague file names
- writing duplicate notes in multiple places without purpose
- treating Khoj as the source of truth instead of the files themselves

---

## Recommendation

Use these conventions lightly but consistently.

The system does not need to be perfect. It just needs enough structure that:
- Patrick can find things
- OpenClaw can write useful notes
- Hermes can participate without fragmenting knowledge
- Khoj can index the corpus cleanly
