# Khoj Shared Brain Draft

## Purpose

Draft a practical architecture for using Khoj as a shared note-taking and second-brain layer for:

- Patrick
- OpenClaw
- Hermes

This assumes Khoj is **not** the main agent runtime. It is the shared knowledge and retrieval layer.

---

## Goal

Create one shared knowledge space where:

- Patrick can store and retrieve notes, ideas, research, and decisions
- OpenClaw can write summaries, research artifacts, and structured findings
- Hermes can read from and write to the same shared corpus
- Khoj can index and query the shared corpus as a second brain

---

## Core Design Principle

Use **plain files as the system of record**.

Khoj should index and help query the shared brain, but the durable source of truth should remain a filesystem-based corpus that Patrick controls.

That keeps the system:
- inspectable
- portable
- backup-friendly
- usable without vendor lock-in

---

## Recommended High-Level Architecture

### Layer 1: Shared corpus
A shared directory on disk that holds all notes and knowledge artifacts.

Example:

`/home/claw/shared-brain/`

### Layer 2: Writers and readers
The systems that create or consume knowledge:
- Patrick
- OpenClaw
- Hermes

### Layer 3: Retrieval layer
Khoj indexes the shared corpus and provides:
- semantic search
- chat over notes
- second-brain retrieval
- multi-client access

### Layer 4: Optional human-facing editor
Optional tools like Obsidian can sit on top for editing, but they should not be required for the architecture to work.

---

## Recommended Folder Structure

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

## Folder Roles

## `inbox/`

### Purpose
Quick capture area for raw or unprocessed notes.

### Typical contents
- rough notes
- pasted links
- quick thoughts
- temporary reminders
- unprocessed agent outputs

### Notes
This is intentionally messy. It is the staging area.

---

## `daily/`

### Purpose
Day-based notes for activity logs, work summaries, and chronological context.

### Typical contents
- daily logs
- what happened today
- task notes
- observations
- follow-ups

### Suggested naming
- `2026-04-15.md`

---

## `projects/`

### Purpose
Longer-lived project notes.

### Typical contents
- architecture ideas
- implementation plans
- project-specific research
- status notes
- open questions

### Suggested structure
- one folder per project or one note per project

---

## `research/`

### Purpose
Structured research notes and syntheses.

### Typical contents
- tool comparisons
- technical evaluations
- product reviews
- market scans
- topic summaries

### Notes
This is where OpenClaw should write most research artifacts.

---

## `memory/`

### Purpose
Curated, durable facts and long-term patterns.

### Typical contents
- stable preferences
- important recurring facts
- core system context
- durable personal or project memory

### Notes
This should be higher signal and lower volume than daily or inbox notes.

---

## `decisions/`

### Purpose
Capture important decisions and why they were made.

### Typical contents
- chosen tools
- rejected options
- tradeoff notes
- architectural decisions

### Suggested file pattern
- `2026-04-15-khoj-shared-brain-decision.md`

---

## `videos/`

### Purpose
Notes and summaries from YouTube or other video research.

### Typical contents
- video summaries
- extracted tools/links
- creator notes
- topic rollups

---

## `creators/`

### Purpose
Profiles for creators, authors, or recurring information sources.

### Typical contents
- why they matter
- themes they cover
- best videos or posts
- quality notes

---

## `references/`

### Purpose
Stable references and resource notes.

### Typical contents
- important URLs
- repos
- docs
- APIs
- tool links

---

## `exports/`

### Purpose
Polished outputs meant for sharing or final review.

### Typical contents
- final summaries
- reports
- compiled briefs
- presentation-ready notes

---

## `scratch/`

### Purpose
Temporary workspace for drafts that do not need to live forever.

### Typical contents
- incomplete drafts
- experiments
- throwaway notes

---

## Suggested Writing Conventions

## Patrick writes
Patrick can write anywhere, but the best default behavior is:
- quick notes to `inbox/`
- daily context to `daily/`
- important project notes to `projects/`
- stable decisions to `decisions/`

---

## OpenClaw writes
OpenClaw should primarily write:
- research outputs to `research/`
- daily operational notes to `daily/`
- durable facts to `memory/`
- extracted video notes to `videos/`
- creator notes to `creators/`
- final reports to `exports/`

### OpenClaw write style
- concise but structured markdown
- preserve provenance where possible
- include source links for research notes
- avoid dumping everything into one giant memory file

---

## Hermes writes
Hermes should ideally follow the same layout:
- transient or session notes to `daily/` or `scratch/`
- durable insights to `memory/`
- project notes to `projects/`
- research to `research/`

### Hermes integration rule
If Hermes uses its own internal memory system, it should still export high-value notes into the shared corpus to avoid knowledge fragmentation.

---

## Shared Rules

### Rule 1: plain markdown first
Prefer markdown as the default format.

### Rule 2: raw versus curated separation
Keep rough notes separate from durable memory.

### Rule 3: preserve provenance
When a note comes from research, include URLs or source labels.

### Rule 4: small focused files beat giant dumps
Prefer many small, named notes over one endlessly growing file.

### Rule 5: write for retrieval
Use meaningful titles, headings, and consistent naming so Khoj can index useful structure.

---

## Suggested File Naming Conventions

### Daily notes
- `daily/YYYY-MM-DD.md`

### Research notes
- `research/topic-name.md`
- `research/YYYY-MM-DD-topic-name.md`

### Decisions
- `decisions/YYYY-MM-DD-decision-title.md`

### Video notes
- `videos/YYYY-MM-DD-video-title.md`
- or `videos/youtube-video-id.md`

### Creator notes
- `creators/creator-name.md`

### Memory notes
- `memory/topic-name.md`
- or a few curated theme-based files instead of one huge catch-all

---

## How Khoj Fits

Khoj should be configured to index the shared-brain directory.

### Khoj's role
- search across the corpus
- chat over stored notes
- surface relevant prior context
- help Patrick, OpenClaw, and Hermes retrieve what matters

### Khoj should not be responsible for
- being the only source of truth
- replacing filesystem organization
- inventing note hygiene automatically

---

## Good Initial Workflow

### Step 1
Create `/home/claw/shared-brain/`

### Step 2
Create the initial folders listed above.

### Step 3
Point Khoj at that directory as one of its main knowledge sources.

### Step 4
Have OpenClaw start writing structured research outputs there.

### Step 5
Have Hermes export important notes into the same structure.

### Step 6
Use Khoj as the shared query interface over that growing corpus.

---

## What Success Looks Like

Patrick can ask things like:
- "What did we decide about shared memory?"
- "What research notes do I have on Claude agents?"
- "What videos did Recon summarize about Claude Code?"
- "What creator notes do I already have on AI systems builders?"

And Khoj can retrieve those answers from a shared, durable corpus.

---

## Recommended Next Step

If this direction feels right, the next thing to do is create:

1. a **read/write convention doc** for OpenClaw and Hermes
2. a **starter shared-brain folder scaffold**
3. a **Khoj ingestion/setup checklist**

That would move this from concept to implementation.
