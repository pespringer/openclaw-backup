# YouTube Phase 3 Ingestion Plan

## Purpose

Define how to move from browser-only YouTube history access to a durable local ingestion workflow.

Phase 3 begins after:

- Phase 1 has shown that history access is viable, and
- Phase 2 has shown that the resulting summaries are useful enough to justify building local storage

---

## Objective

Create a repeatable ingestion process that:

1. captures watched-history entries from YouTube
2. normalizes them into stable local records
3. enriches selected videos with metadata and summaries
4. supports future topic and creator queries without repeating all browser work

---

## Scope

This phase is about ingestion and local persistence.

It is not yet about:
- full autonomous recommendation quality optimization
- complete all-history backfill from day one
- perfect transcript extraction for every video

The main goal is to create a reliable local foundation.

---

## Ingestion Strategy

Build ingestion as a staged pipeline.

### Stage 1: history capture
Capture what is visible from the YouTube history UI into raw local records.

### Stage 2: normalization
Convert raw capture into canonical watched-entry records.

### Stage 3: selection
Pick which videos need deeper enrichment now versus later.

### Stage 4: enrichment
Open selected video pages and store detailed metadata and summaries.

### Stage 5: indexing
Update date, creator, topic, and query-friendly lookup structures.

---

## Stage 1: History Capture

### Goal
Record YouTube history entries exactly as observed.

### Inputs
- attached browser session
- visible history page entries
- selected date window or scrolling range

### Outputs
- raw capture files under `history/raw/`

### Capture tasks
- [ ] choose a date window to ingest
- [ ] open the history page
- [ ] scroll enough to load entries in the selected range
- [ ] capture visible title, creator, URL, and date-grouping context
- [ ] write batch capture records to raw storage
- [ ] record ingestion notes for partial or missing fields

### Suggested capture cadence
For the first version:
- ingest recent windows first, such as last 7 or 14 days
- only backfill older history after the workflow proves useful

### Risks
- scrolling may not expose all desired entries
- date precision may be coarse
- page structure may change

---

## Stage 2: Normalization

### Goal
Turn raw UI observations into stable normalized history entries.

### Outputs
- normalized records under `history/normalized/`

### Normalization tasks
- [ ] resolve canonical video URL
- [ ] extract or infer video ID when possible
- [ ] normalize creator names
- [ ] interpret watched date or grouping label
- [ ] assign watched-date precision
- [ ] dedupe repeated observations of the same entry
- [ ] record normalization notes where data is ambiguous

### Key rules
- do not discard ambiguous source data silently
- preserve links back to raw capture IDs
- keep normalization reversible enough for debugging

---

## Stage 3: Selection for Enrichment

### Goal
Decide which videos need full analysis.

### Selection priorities
Prioritize videos that are:
- in the active user query window
- clearly relevant to requested topics
- from repeatedly useful creators
- likely to contain high-signal technical content

### Lower priority candidates
Defer videos that are:
- obviously unrelated to current topics
- repetitive entertainment or low-signal content
- duplicates already enriched earlier

### Outputs
- a selected set of videos queued for enrichment

---

## Stage 4: Enrichment

### Goal
Create useful per-video research objects.

### Enrichment tasks
- [ ] open the selected video page
- [ ] capture canonical metadata
- [ ] capture description text when useful
- [ ] capture transcript if available
- [ ] generate a concise summary
- [ ] extract key tools, links, repos, APIs, products, and people
- [ ] assign topic tags
- [ ] record novelty or usefulness notes
- [ ] write the enriched video record to `videos/by-id/`

### Enrichment policy
- enrichment should be incremental
- failure to get transcript should not block the rest
- summary quality should reflect visible evidence only

---

## Stage 5: Indexing and Rollups

### Goal
Make stored data queryable and reusable.

### Tasks
- [ ] update date-based indexes
- [ ] update creator profiles
- [ ] update topic rollups
- [ ] update cache and state markers
- [ ] create query-ready lookup paths

### Outputs
- `videos/by-date/`
- `creators/`
- `topics/`
- `state/`

---

## Ingestion Modes

## Mode A: Manual assisted ingestion

### Description
Recon runs ingestion on request for a specific topic or date range.

### Pros
- lower complexity
- highly controlled
- ideal for the first working version

### Cons
- not comprehensive unless run regularly

### Recommendation
Use this first.

---

## Mode B: Periodic recent-history ingestion

### Description
Recon periodically captures recent watch history and updates the local store.

### Pros
- reduces repeated browser work
- keeps recent history available for later queries

### Cons
- requires careful scheduling and state tracking
- increases maintenance complexity

### Recommendation
Add later if the manual flow proves valuable.

---

## Mode C: Historical backfill

### Description
Recon walks older history windows to populate a larger local archive.

### Pros
- stronger long-term recall
- better creator and topic pattern detection

### Cons
- time-consuming
- likely brittle if browser history navigation is slow

### Recommendation
Delay until the recent-history workflow is proven.

---

## Operational Checklist

### Before ingestion
- [ ] confirm browser attach is working
- [ ] confirm signed-in YouTube access is active
- [ ] confirm the target date window
- [ ] confirm output directories exist

### During ingestion
- [ ] capture raw entries first
- [ ] normalize after capture
- [ ] select only priority videos for deep enrichment
- [ ] log partial failures instead of stopping the whole run

### After ingestion
- [ ] verify files were written correctly
- [ ] verify dedupe behavior
- [ ] verify indexes were updated
- [ ] review whether the captured output is useful enough for later queries

---

## Suggested First Ingestion Run

### Recommended scope
- date range: last 7 to 14 days
- topic focus: MCP, AI agents, memory systems, or automation

### Why this is the right first run
- it matches Patrick's current interests
- it keeps the ingestion scope manageable
- it provides a realistic test of whether local storage improves the workflow

---

## Success Criteria

Phase 3 succeeds if:

- recent history can be captured and stored locally
- normalized entries are queryable by date and topic
- selected videos can be enriched into reusable research records
- repeated queries no longer require fully redoing browser discovery work

---

## Risks and Mitigations

### Risk: browser UI fragility
Mitigation:
- capture raw observations early
- keep ingestion windows small
- avoid over-automation too early

### Risk: incomplete date visibility
Mitigation:
- store watched-date precision explicitly
- use grouping labels or order as fallback

### Risk: duplicate records
Mitigation:
- canonicalize by video ID or canonical URL
- separate raw capture from normalized records

### Risk: enrichment backlog becomes too large
Mitigation:
- enrich only query-relevant or high-signal videos first
- defer lower-value candidates

---

## Recommendation

Implement Phase 3 as a manual assisted ingestion workflow first.

That is the best balance of speed, reliability, and control. Once it proves valuable, add periodic recent-history ingestion and only later consider broader historical backfill.
