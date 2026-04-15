# YouTube History Research Plan

## Objective

Build a workflow that lets Recon use Patrick's YouTube watch history to:

1. Find watched videos by topic and time range
2. Summarize what those videos discussed
3. Extract tools, links, products, repos, creators, and notable references
4. Recommend related videos from the same or similar creators
5. Provide a quick watch, skim, or skip judgment for follow-up videos

---

## Executive Summary

This is feasible, but the key dependency is access to Patrick's actual YouTube account history.

The most practical first path is to attach OpenClaw to Patrick's signed-in browser session and test whether Recon can read YouTube History directly from the logged-in UI. If that works, the next step is to prove value by running a real topic-and-time-range query over recent watched videos.

Long term, the strongest setup is not browser-only. The best durable design is a hybrid system:

- browser access for initial capture when needed
- a local indexed store of watched videos and analysis
- optional transcript and metadata enrichment
- optional shared memory/wiki integration for durable research recall

Obsidian is optional. It may be useful later as a human-facing interface, but it is not required for the core workflow.

---

## Desired End State

Patrick can ask things like:

- "What did I watch in the last 14 days about MCP and AI agents?"
- "What tools were mentioned in videos about agent memory?"
- "Which creators have had the most useful ideas on local AI workflows?"
- "Find follow-up videos from similar creators and tell me which ones are worth watching."

Recon returns:

- matching watched videos
- concise per-video summaries
- cross-video synthesis
- extracted tools, products, links, repos, and creators
- recommended follow-up videos with ranked watch value

---

## Recommended Rollout

## Phase 1: Prove Access

### Goal
Confirm that Recon can access Patrick's YouTube history in a real, usable way.

### Preferred path
Use OpenClaw browser attach with Patrick's signed-in local browser session.

### What to test

- open YouTube History while logged in
- read watched video titles, channels, links, and visible dates
- open selected videos from history
- capture enough metadata to support summarization

### Success criteria

- Recon can list watched videos from a chosen recent period
- Recon can open several history entries reliably
- Recon can capture enough metadata for analysis

### Risks

- browser-only extraction may be brittle
- UI changes may break selectors or page structure
- long history windows may require scrolling and pagination
- some useful details may not be visible without deeper page traversal

---

## Phase 2: Prove Usefulness

### Goal
Validate that the output is actually useful to Patrick before building more infrastructure.

### Example user query

"Find videos from the last 14 days about MCP, AI agents, and memory systems. Summarize what they discussed, list tools and links mentioned, and recommend the best follow-up videos."

### Expected output

For each matching watched video:

- title
- creator/channel
- watched date, if visible
- why it matched the requested topic
- concise summary
- tools, links, products, repos, APIs, and people mentioned
- overlap or novelty relative to other matched videos

Then provide:

- a cross-video synthesis
- a combined tool/resource list
- a creator list
- recommended next watches
- watch, skim, or skip suggestions

### Success criteria

- Patrick finds the summaries useful
- extracted tools and references are actionable
- recommendations feel relevant and non-random
- the workflow saves Patrick time versus manually reviewing watch history

---

## Phase 3: Build a Local Research Store

### Goal
Move from live browser-only work to a durable local analysis workflow.

### Proposed directory

`/home/claw/youtube-research/`

Suggested structure:

- `history/` — captured watch-history snapshots
- `videos/` — one file per analyzed video
- `creators/` — creator summaries and profiles
- `topics/` — topic rollups and recurring themes
- `exports/` — user-facing reports
- `cache/` — transcript and metadata caches

### Why this matters

A local store makes the workflow:

- faster to query
- more reliable across repeated requests
- less dependent on YouTube UI changes
- better at building cumulative knowledge over time

---

## Phase 4: Enrich Watched Videos

### Goal
Turn history entries into useful research objects.

### Per-video fields to capture

- title
- URL
- creator/channel
- watch date/time, if available
- transcript, if obtainable
- description text
- extracted tools, links, repos, products, APIs, and people
- concise summary
- topic tags
- value judgment
- related creators or adjacent topics

### Possible enrichment sources

- YouTube page metadata
- transcript extraction
- description links
- limited external web research on mentioned tools or repos

### Notes

The system does not need perfect transcript access to be useful. Good metadata plus selective transcript extraction is enough for an effective first version.

---

## Phase 5: Query and Recommendation Workflow

### Goal
Let Patrick query history naturally and get high-signal recommendations.

### Example queries

- "What did I watch in the last month about AI coding agents?"
- "What videos mentioned MCP servers or memory architectures?"
- "Which creators are most relevant to local-first AI workflows?"
- "Find the best next videos based on the most useful creators I watched recently."

### Recommendation outputs

For new or follow-up videos, return:

- title
- creator
- why it is relevant
- short summary
- whether it appears novel or redundant
- watch, skim, or skip rating

---

## Implementation Options

## Option 1: Browser-only MVP

### Description
Use browser attach to inspect YouTube history live and perform manual analysis on demand.

### Pros

- fastest to test
- minimal setup
- proves whether account access is possible

### Cons

- brittle
- slower for repeated use
- not ideal for larger history windows
- little persistent value without separate storage

### Recommendation
Use this first to validate feasibility.

---

## Option 2: Browser capture plus local index

### Description
Use browser access to gather history entries, then store and enrich them locally for repeatable analysis.

### Pros

- much more reliable
- cumulative value over time
- good balance of speed and durability
- supports repeated natural-language queries

### Cons

- requires some build work
- ingestion and normalization logic must be designed

### Recommendation
This is the recommended target architecture.

---

## Option 3: Full YouTube research pipeline

### Description
Create an end-to-end pipeline with automated ingestion, transcript enrichment, entity extraction, creator modeling, and durable search/recommendation.

### Pros

- most powerful
- best long-term recall
- strongest recommendation quality

### Cons

- highest complexity
- more engineering than needed for the first iteration

### Recommendation
Only pursue after the MVP proves useful.

---

## Recommended Technical Direction

1. Use browser attach as the initial access layer.
2. Validate with one real topic-plus-time-range query.
3. Build a local folder-based index of watched videos.
4. Add transcript and metadata enrichment.
5. Add creator similarity and recommendation logic.
6. Optionally integrate outputs into shared memory or a wiki layer later.

---

## Data Access Notes

### Likely viable access methods

1. Signed-in browser session via OpenClaw browser attach
2. Exported or synced history data, if Patrick wants a more durable source
3. Hybrid browser plus local storage workflow

### Less likely to fully solve the problem alone

- YouTube Data API, because official APIs may not expose the full personal watch-history experience needed here
- Zapier alone, because it is strong for automation but weaker for private account browsing and exploratory research
- MCP alone, unless a dedicated custom YouTube MCP server is built or adopted

---

## Risks and Constraints

- YouTube UI changes may break browser-driven extraction
- Watch history may require pagination or infinite scroll handling
- Not all watched videos will have easy transcript access
- Some creator recommendations may be noisy without enough enrichment and ranking logic
- Privacy and account-scope access should remain tightly controlled

---

## Suggested Milestones

### Milestone 1
Access test completed successfully against Patrick's live YouTube history.

### Milestone 2
One real history query completed with useful summaries and follow-up recommendations.

### Milestone 3
Local research store created and populated with initial history entries.

### Milestone 4
Per-video enrichment pipeline working for summaries, tools, and links.

### Milestone 5
Natural-language query workflow working across stored history.

### Milestone 6
Recommendation workflow returns high-signal watch, skim, or skip outputs.

---

## Immediate Next Step

The next action should be:

**Set up and test browser attach to Patrick's signed-in YouTube session.**

That gives the fastest answer to the most important question: whether Recon can actually see enough of Patrick's history to make this workflow useful.

If that succeeds, run one real query from the last 7 to 14 days before building anything heavier.

---

## Recommendation Summary

Start small and prove value first.

Recommended order:

1. browser attach
2. one real history query
3. local storage/indexing
4. transcript and metadata enrichment
5. recommendation layer
6. optional shared memory/wiki integration

This keeps the project grounded, practical, and easy to evaluate before investing in heavier infrastructure.
