# Khoj Setup and Ingestion Checklist

## Purpose

Provide a concrete checklist for setting up Khoj as the shared second-brain layer on top of the shared-brain corpus.

This checklist assumes:
- Khoj is not replacing OpenClaw or Hermes
- the shared-brain directory is the source of truth
- Khoj is the retrieval and second-brain interface on top of that source

---

## Phase 1: Shared-Brain Preparation

### Directory setup
- [ ] Create the shared-brain root directory
- [ ] Create the initial folder structure
- [ ] Add root and per-folder README files
- [ ] Create today's daily note
- [ ] Create at least one initial research note
- [ ] Create at least one initial decision note

### Convention setup
- [ ] Review and accept the read/write conventions
- [ ] Decide default write destinations for Patrick
- [ ] Decide default write destinations for OpenClaw
- [ ] Decide default write destinations for Hermes
- [ ] Decide what counts as curated memory versus raw notes

---

## Phase 2: Khoj Installation

### Deployment choice
- [ ] Decide whether to run Khoj with Docker or pip
- [ ] Prefer Docker if easy isolation and reproducibility matter more
- [ ] Prefer pip only if a lighter local install is more convenient

### Installation prep
- [ ] Create a dedicated Khoj config or working directory if desired
- [ ] Choose admin email, password, and secret values
- [ ] Decide whether to use commercial or local models

### Model setup decision
- [ ] Decide whether Khoj will use OpenAI
- [ ] Decide whether Khoj will use Anthropic
- [ ] Decide whether Khoj will use Gemini
- [ ] Decide whether Khoj will use a local OpenAI-compatible backend such as Ollama or LMStudio

---

## Phase 3: Khoj Server Setup

### Base server setup
- [ ] Install and launch Khoj
- [ ] Confirm server becomes reachable locally
- [ ] Open the web app successfully
- [ ] Login to the admin panel
- [ ] Set or verify model configuration

### Basic validation
- [ ] Confirm chat works
- [ ] Confirm search works
- [ ] Confirm the chosen model is responding correctly

---

## Phase 4: Shared-Brain Ingestion

### Initial content ingestion
- [ ] Point Khoj to the shared-brain directory or sync source
- [ ] Confirm markdown notes are being indexed
- [ ] Confirm daily notes appear in search
- [ ] Confirm research notes appear in search
- [ ] Confirm decision notes appear in search
- [ ] Confirm memory notes appear in search

### Validation queries
Run a few test queries such as:
- [ ] "What do I know about Khoj?"
- [ ] "What did we decide about shared memory?"
- [ ] "Show my notes on Claude Code"
- [ ] "What research do I have about shared brain architecture?"

### Retrieval quality check
- [ ] Search results are relevant
- [ ] Chat over notes returns grounded answers
- [ ] Important notes are findable without exact wording

---

## Phase 5: OpenClaw Integration

### Writing behavior
- [ ] Decide where OpenClaw should write daily summaries
- [ ] Decide where OpenClaw should write research notes
- [ ] Decide where OpenClaw should write video summaries
- [ ] Decide where OpenClaw should write curated durable memory

### Validation
- [ ] Confirm OpenClaw can write notes into the shared-brain structure
- [ ] Confirm newly written notes appear in Khoj retrieval after sync/indexing
- [ ] Confirm research notes preserve source links

---

## Phase 6: Hermes Integration

### Writing behavior
- [ ] Decide where Hermes should export useful notes
- [ ] Decide how Hermes promotes durable information into the shared corpus
- [ ] Decide where Hermes keeps scratch output versus durable output

### Validation
- [ ] Confirm Hermes can write or export into the shared-brain structure
- [ ] Confirm Hermes-origin notes become searchable in Khoj
- [ ] Confirm shared notes do not become duplicated or overly noisy

---

## Phase 7: Retrieval Workflow Validation

### Patrick-facing checks
- [ ] Patrick can ask Khoj about prior notes and get useful answers
- [ ] Patrick can find research, decisions, and creator/video notes quickly
- [ ] Patrick can retrieve both rough and curated notes when appropriate

### Cross-agent checks
- [ ] OpenClaw can rely on the shared corpus for durable knowledge storage
- [ ] Hermes can read or reuse the same shared knowledge layer
- [ ] Khoj improves retrieval without becoming the only storage layer

---

## Phase 8: Hygiene and Maintenance

### Ongoing maintenance
- [ ] Periodically move useful items from `inbox/` into better folders
- [ ] Promote stable facts from `daily/` or `research/` into `memory/` when appropriate
- [ ] Record important tool or architecture choices in `decisions/`
- [ ] Keep `references/` updated with high-value docs and repos
- [ ] Clean out `scratch/` regularly

### Noise control
- [ ] Avoid duplicate notes for the same fact unless there is a reason
- [ ] Avoid bloating `memory/` with short-lived context
- [ ] Prefer concise, focused notes to giant mixed documents

---

## Recommended Initial Test Pack

Create and validate these first:
- [ ] `daily/YYYY-MM-DD.md`
- [ ] `research/khoj-review.md`
- [ ] `decisions/YYYY-MM-DD-khoj-as-shared-brain.md`
- [ ] `references/claude-code.md`
- [ ] `videos/seed-video-summaries.md`

Then test whether Khoj can answer:
- [ ] What is Khoj being used for in this setup?
- [ ] What did we decide about shared memory?
- [ ] What videos were summarized about Claude Code?
- [ ] What are the key tools mentioned in our AI research notes?

---

## Success Criteria

The setup is working when:
- [ ] Patrick has one shared corpus he can trust
- [ ] OpenClaw can write durable notes into it
- [ ] Hermes can participate without fragmenting knowledge
- [ ] Khoj can retrieve useful answers across the corpus
- [ ] the filesystem remains the source of truth

---

## Recommendation

Keep the first implementation small and boring.

A successful setup is not the one with the most features. It is the one that:
- stays understandable
- captures useful knowledge consistently
- is easy to retrieve from later
