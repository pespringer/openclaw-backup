# Khoj Install and Config Plan

## Purpose

Provide a practical first-pass plan to install and configure Khoj for the shared-brain setup.

This plan assumes:
- the shared corpus lives at `/home/claw/shared-brain/`
- Khoj is the retrieval and second-brain layer
- OpenClaw and Hermes remain separate runtimes

---

## Recommended First Deployment Path

### Recommendation
Start with **Docker** unless there is a strong reason to prefer pip.

### Why Docker first
- cleaner isolation
- easier repeatability
- easier rollback
- lower chance of Python dependency conflicts on the host

### When pip is reasonable
- if you already prefer local Python service installs
- if you want a simpler local process and are comfortable managing dependencies

---

## Proposed First Configuration Decisions

## 1. Data source
Primary shared knowledge source:

`/home/claw/shared-brain/`

## 2. Access model
Start local-only first.
Do not optimize remote access until local retrieval works well.

## 3. Model backend
Choose the easiest already-available backend first.

### Good first options
- Anthropic, if already in regular use
- OpenAI, if already available
- Gemini, if already available
- local OpenAI-compatible backend like Ollama, if you want local-first operation

### Recommendation
Start with whichever model backend is already easiest to authenticate and maintain.

---

## Step-by-Step Plan

## Step 1: Prepare working directory
Suggested location:

`~/.khoj/`

Example:

```bash
mkdir -p ~/.khoj
cd ~/.khoj
```

---

## Step 2: Fetch the Docker Compose file
According to Khoj docs, use their published docker-compose file.

Example pattern from docs:

```bash
wget https://raw.githubusercontent.com/khoj-ai/khoj/master/docker-compose.yml
```

Note: review the file before running it.

---

## Step 3: Configure required environment values
At minimum, set:
- `KHOJ_ADMIN_PASSWORD`
- `KHOJ_DJANGO_SECRET_KEY`
- optionally `KHOJ_ADMIN_EMAIL`

Then set one model provider path, for example:
- `OPENAI_API_KEY`
- or `ANTHROPIC_API_KEY`
- or `GEMINI_API_KEY`

If using a local OpenAI-compatible backend, set the base URL accordingly.

---

## Step 4: Start Khoj
From the Khoj working directory:

```bash
docker-compose up
```

Expected result:
- Khoj server starts locally
- web app becomes reachable
- logs indicate readiness

Docs indicate the default local app URL is:

- `http://localhost:42110`

---

## Step 5: Open the web UI and admin panel
Web app:
- `http://localhost:42110`

Admin panel:
- `http://localhost:42110/server/admin`

### Validation goals
- login works
- model settings can be configured
- basic chat/search are reachable

---

## Step 6: Configure model settings
Inside the admin panel:
- add the chosen model API configuration
- add or select a chat model
- set a default model if required

Recommendation:
Start with one reliable model first. Do not optimize multiple model choices yet.

---

## Step 7: Ingest or sync the shared brain
Point Khoj at the shared-brain corpus.

Primary target:
- `/home/claw/shared-brain/`

Initial goals:
- get markdown notes indexed
- verify that research, daily, decisions, memory, and video notes are all discoverable

---

## Step 8: Run first validation queries
Suggested test questions:
- What do I know about Khoj in this setup?
- What did we decide about using Khoj as a shared brain?
- Show notes about Claude Code.
- What videos have been summarized so far?

Success means:
- retrieval is relevant
- notes are discoverable without exact-match wording
- grounded answers reflect the shared-brain files

---

## Phase 2 Improvements, Later

Only after the first local version works well, consider:
- remote access
- more clients, desktop, mobile, etc.
- additional data sources beyond the shared-brain folder
- model tuning or multiple model backends
- automation workflows

---

## Recommended First-Day Scope

Keep day one small.

### Do this first
1. install Khoj with Docker
2. configure one model backend
3. point it at `/home/claw/shared-brain/`
4. verify retrieval on the seed notes

### Do not overcomplicate yet
- no remote exposure
- no extra data sources
- no premature automation
- no broad restructuring of all notes before validating retrieval

---

## Risks to Watch

### Dependency/setup issues
Docker reduces these, but still inspect the compose file and expected ports.

### Retrieval quality issues
If results are weak, the likely problem is note quality or insufficient seed corpus rather than a fundamental platform failure.

### Noise inflation
If too many low-value notes are added too early, retrieval quality will feel worse.

---

## Concrete Next Commands to Prepare

These are the likely first commands to run when you want to proceed:

```bash
mkdir -p ~/.khoj
cd ~/.khoj
wget https://raw.githubusercontent.com/khoj-ai/khoj/master/docker-compose.yml
# edit docker-compose.yml with admin credentials and model settings
docker-compose up
```

Then open:

- `http://localhost:42110`
- `http://localhost:42110/server/admin`

---

## Recommendation

Start with a boring, local-only Docker deployment and point it at the shared-brain directory.

If that works well, then iterate outward.
