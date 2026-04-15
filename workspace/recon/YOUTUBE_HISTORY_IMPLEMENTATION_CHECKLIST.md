# YouTube History Implementation Checklist

## Purpose

Turn the YouTube history research plan into an actionable implementation checklist for phased execution.

---

## Phase 1: Access Validation

### Browser access setup
- [ ] Confirm which local browser profile holds Patrick's signed-in YouTube session
- [ ] Confirm the browser is Chromium-based and compatible with OpenClaw browser attach
- [ ] Enable browser-side remote debugging / attach support if needed
- [ ] Verify OpenClaw can attach to the `user` browser profile or a custom existing-session profile
- [ ] Confirm the browser attach path is stable enough for repeated use

### YouTube history access test
- [ ] Open YouTube while attached to Patrick's signed-in browser session
- [ ] Navigate to YouTube watch history
- [ ] Confirm access to watched video titles
- [ ] Confirm access to creator/channel names
- [ ] Confirm access to video URLs
- [ ] Confirm whether watched dates/times are visible
- [ ] Test opening several videos directly from history
- [ ] Confirm enough page metadata is available to support later analysis

### Phase 1 success gate
- [ ] Recon can reliably retrieve history entries for a recent time window
- [ ] Recon can open selected watched videos from history
- [ ] Recon can collect enough metadata to summarize videos meaningfully

---

## Phase 2: First Real Query

### Query setup
- [ ] Define one real test query with a topic and time range
- [ ] Choose an initial time window, such as 7 or 14 days
- [ ] Choose one or two focused topics, such as MCP, AI agents, or memory systems

### Query execution
- [ ] Gather watched videos from the selected time range
- [ ] Filter videos by topic relevance
- [ ] Capture title, creator, URL, and watched date if available
- [ ] Open the strongest matches for deeper inspection
- [ ] Produce concise per-video summaries
- [ ] Extract tools, products, repos, APIs, people, and links mentioned
- [ ] Note overlap, duplication, and novelty across matched videos

### Query output
- [ ] Produce a history matches section
- [ ] Produce a cross-video synthesis section
- [ ] Produce a combined tools and links section
- [ ] Produce a creator list section
- [ ] Produce a recommended follow-up videos section
- [ ] Add watch, skim, or skip guidance for each recommendation

### Phase 2 success gate
- [ ] Output is useful enough that Patrick would ask for it again
- [ ] Tools and references extracted are actionable
- [ ] Recommendations are relevant and not generic

---

## Phase 3: Local Research Store

### Storage design
- [ ] Create a root directory for YouTube research storage
- [ ] Define the folder structure for history, videos, creators, topics, exports, and cache
- [ ] Decide on the file format for stored video records, markdown, JSON, or hybrid
- [ ] Define naming conventions for per-video files
- [ ] Define naming conventions for creator and topic rollups

### Initial storage setup
- [ ] Create the local directory structure
- [ ] Store an initial snapshot of history entries
- [ ] Create an initial record format for analyzed videos
- [ ] Create an export format for user-facing summaries

### Phase 3 success gate
- [ ] Stored history is readable and searchable
- [ ] Recon can reuse prior captures without reopening every history page
- [ ] The local store is clean enough to extend later

---

## Phase 4: Video Enrichment Pipeline

### Metadata capture
- [ ] Capture title for each stored video
- [ ] Capture URL for each stored video
- [ ] Capture creator/channel for each stored video
- [ ] Capture watch date/time when available
- [ ] Capture description text when useful

### Content enrichment
- [ ] Add transcript extraction where possible
- [ ] Add concise summary generation for each video
- [ ] Extract tools mentioned in each video
- [ ] Extract products, repos, APIs, libraries, and links
- [ ] Extract people or creators referenced in the video
- [ ] Assign topic tags
- [ ] Add a value judgment or usefulness note

### Quality controls
- [ ] Handle videos with missing transcript gracefully
- [ ] Avoid duplicate enrichment work for already processed videos
- [ ] Preserve source URLs and provenance in stored records

### Phase 4 success gate
- [ ] A stored video record is rich enough to answer research questions later
- [ ] Summary and extraction quality is good enough for practical use

---

## Phase 5: Query Layer

### Query capability
- [ ] Support filtering by date range
- [ ] Support filtering by topic
- [ ] Support filtering by creator/channel
- [ ] Support filtering by extracted tools or references
- [ ] Support combined filters, such as topic plus date range

### Output capability
- [ ] Return matching watched videos
- [ ] Return per-video summaries
- [ ] Return cross-video synthesis
- [ ] Return combined tools and links
- [ ] Return creator patterns and recurring themes

### Phase 5 success gate
- [ ] Patrick can ask natural-language history questions and get useful answers
- [ ] Results can be generated from the local store quickly and consistently

---

## Phase 6: Recommendation Layer

### Recommendation sources
- [ ] Find more videos from creators already watched
- [ ] Find similar creators based on topic overlap
- [ ] Find popular or relevant videos matching extracted topics
- [ ] Check whether recommended videos appear novel or redundant

### Recommendation output
- [ ] Add a short summary for each recommended video
- [ ] Add a reason it was selected
- [ ] Add a watch, skim, or skip label
- [ ] Prefer high-signal recommendations over large noisy lists

### Phase 6 success gate
- [ ] Follow-up recommendations save Patrick time
- [ ] Recommendations feel aligned with actual watched interests

---

## Optional Phase 7: Durable Memory Integration

### Shared recall integration
- [ ] Decide whether outputs should be written into OpenClaw memory files
- [ ] Decide whether creator and topic rollups belong in a wiki-style knowledge layer
- [ ] Decide which insights should become durable long-term memory versus temporary research cache

### Optional tooling
- [ ] Evaluate whether memory-wiki should be used for creator/topic syntheses
- [ ] Evaluate whether Obsidian should be used only as a human-facing UI
- [ ] Evaluate whether Hermes should read from the same research store later

### Phase 7 success gate
- [ ] Useful recurring insights persist beyond one-off queries
- [ ] The system remains organized and low-noise

---

## Technical Decision Checklist

### Access path
- [ ] Browser attach is confirmed as the first access method
- [ ] Alternative path defined if browser attach is unreliable

### Storage path
- [ ] Local research root path selected
- [ ] File format selected
- [ ] Provenance strategy selected

### Enrichment path
- [ ] Transcript strategy selected
- [ ] Link/tool extraction strategy selected
- [ ] Recommendation strategy selected

### Privacy and control
- [ ] Scope of account access is clearly understood
- [ ] Sensitive browsing/account context is handled carefully
- [ ] Human approval is required before any broader external integration is added

---

## Immediate Next Actions

- [ ] Confirm the browser profile to use for YouTube access
- [ ] Test browser attach with the signed-in local browser session
- [ ] Validate access to YouTube watch history
- [ ] Run one real topic-plus-time-range query
- [ ] Review whether the results are useful enough to justify the local index

---

## Recommended Execution Order

1. [ ] Browser attach
2. [ ] History access validation
3. [ ] One real query
4. [ ] Local storage design
5. [ ] Local capture and indexing
6. [ ] Video enrichment
7. [ ] Query layer
8. [ ] Recommendation layer
9. [ ] Optional memory/wiki integration
