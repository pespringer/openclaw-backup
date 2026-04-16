# YouTube Phase 2 Real Query Execution Template

## Purpose

Provide a repeatable template for Recon to run the first real YouTube-history research query once Phase 1 browser access is proven.

This document defines how to choose a query, gather matching history items, analyze them, and return a useful result to Patrick.

---

## Objective

Take a user request with:

- a topic or set of topics
- a time range

and convert it into:

- matched watched videos
- concise summaries of what was discussed
- extracted tools, links, repos, products, APIs, creators, and people
- a cross-video synthesis
- recommended follow-up videos with watch, skim, or skip guidance

---

## When to Use This Template

Use this template after:

- browser access to YouTube history has been validated, or
- another reliable watch-history source has been established

Do not use this template until Phase 1 has confirmed that history access is viable enough to support a real query.

---

## Input Template

### Required user inputs

- **Topic:** what Patrick wants to focus on
- **Time range:** such as last 7 days, last 14 days, last month, or a specific date range

### Optional user inputs

- preferred creators to prioritize
- creators to exclude
- whether recommendations should favor depth, novelty, or popularity
- whether output should be brief or detailed

### Example requests

- "Find videos from the last 14 days about MCP and AI agents."
- "Look at my YouTube history from the last month and summarize everything about local AI and memory systems."
- "Find what I watched recently about automation, then suggest the best follow-up videos from similar creators."

---

## Query Preparation

### Step 1: Normalize the request
- [ ] Rewrite the user request into a clear internal query statement
- [ ] Define the effective time window
- [ ] Define the core topic keywords and adjacent concepts
- [ ] Define any exclusions or preferences

### Output of query preparation
Create a short internal query profile containing:

- target date range
- topic keywords
- adjacent keywords
- any creator preferences
- recommendation preference, if specified

---

## History Collection

### Step 2: Gather candidate history entries
- [ ] Open the relevant history range
- [ ] Collect candidate watched videos from that range
- [ ] Capture title, creator, URL, and visible watched date or grouping label
- [ ] Store candidates in a working set for filtering

### Candidate fields
For each history candidate, try to capture:

- title
- creator/channel
- URL
- watched date or grouping label
- visible description cues, if any

### Collection notes
- Prefer over-collection at first, then filter down
- If date visibility is weak, use visible page grouping or order as an approximation
- Capture enough entries to identify real patterns, not just one-off matches

---

## Topic Filtering

### Step 3: Filter by relevance
- [ ] Identify titles clearly matching the requested topic
- [ ] Flag titles that may be relevant based on creator familiarity or adjacent keywords
- [ ] Exclude obviously irrelevant videos
- [ ] Prioritize the strongest matches for deeper inspection

### Relevance tiers

#### Tier 1: direct match
- title or creator clearly aligns with requested topic

#### Tier 2: probable match
- likely relevant based on adjacent language, creator specialization, or visible context

#### Tier 3: weak match
- only loosely related, should usually be omitted unless needed for context

### Filtering output
Produce a shortlist of matched watched videos with:

- relevance tier
- brief reason for inclusion

---

## Deep Inspection

### Step 4: Inspect the strongest matches
For each prioritized video:

- [ ] Open the video page
- [ ] confirm title and creator
- [ ] inspect visible description or metadata
- [ ] inspect transcript if available and useful
- [ ] capture the main ideas discussed
- [ ] capture tools, links, repos, APIs, products, or people mentioned
- [ ] identify whether the video contributes something new or mostly repeats other videos

### Per-video capture template
For each matched video, record:

- title
- creator/channel
- URL
- watched date, if known
- why it matched the query
- concise summary
- notable tools or references mentioned
- novelty or overlap note

---

## Cross-Video Synthesis

### Step 5: Synthesize what Patrick actually learned from the set
- [ ] Identify recurring themes across the matched videos
- [ ] Identify disagreements or alternative approaches
- [ ] Identify which videos were high-signal versus repetitive
- [ ] Group extracted tools and references by theme
- [ ] Identify which creators appear most useful for the topic

### Synthesis output should cover
- main ideas that came up repeatedly
- notable differences in approach
- tools or resources that appeared multiple times
- creators worth following further
- gaps where more research is needed

---

## Recommendation Generation

### Step 6: Find follow-up videos worth Patrick's time
- [ ] Identify additional videos from the same creators
- [ ] Identify similar creators covering the same topic
- [ ] Prefer videos likely to add novelty rather than repeat the same surface-level points
- [ ] Summarize each candidate briefly
- [ ] Assign watch, skim, or skip guidance

### Recommendation selection criteria
Prefer videos that are:

- high-signal
- recent or still relevant
- additive rather than repetitive
- clearly aligned with Patrick's topic request

### Recommendation record template
For each recommendation, include:

- title
- creator
- link
- why it is relevant
- short summary
- watch, skim, or skip rating

---

## Output Format Template

Use this structure when returning results.

## 1. Query Summary

- topic
- time range
- number of matched watched videos

## 2. History Matches

For each matched watched video:
- title
- creator
- watched date if known
- why it matched
- concise summary
- tools or references mentioned
- novelty or overlap note

## 3. What Was Discussed Across the Videos

- recurring ideas
- notable disagreements or differences
- what seems most important

## 4. Tools, Links, and References Mentioned

Group by type when possible:
- tools
- products
- repos
- APIs
- people/creators
- other links

## 5. Best Creators to Follow Up On

- creator
- why they seem valuable
- what angle they cover

## 6. Recommended Next Videos

For each recommendation:
- title
- creator
- why it is relevant
- short summary
- watch, skim, or skip

## 7. Bottom Line

A short judgment answering:
- what Patrick watched that mattered most
- what is worth following up on next

---

## Quality Checklist

Before finalizing an output:

- [ ] Time range was respected as closely as possible
- [ ] Only relevant history matches were included
- [ ] Summaries are concise and specific
- [ ] Extracted tools and references are clearly listed
- [ ] Recommendations are relevant and not filler
- [ ] Watch, skim, or skip guidance is justified
- [ ] The output saves Patrick time instead of creating more reading overhead

---

## Failure and Fallback Handling

### If history visibility is incomplete
- note the limitation clearly
- continue with the best visible subset

### If dates are weak or missing
- use visible order and grouping labels as an approximation
- mention the limitation

### If transcript access is unavailable
- rely on title, description, metadata, and selective page inspection
- avoid pretending to know details not actually visible

### If recommendations are too noisy
- reduce the list size
- favor quality over coverage

---

## Phase 2 Success Criteria

Phase 2 succeeds if Patrick receives a result that:

- accurately reflects what was watched in the chosen time window
- distills the main ideas without unnecessary fluff
- extracts useful tools and references
- surfaces worthwhile follow-up videos
- feels good enough to repeat as an ongoing workflow

---

## Recommended First Query

Suggested first test query:

**Topic:** MCP, AI agents, and memory systems  
**Time range:** last 14 days

Why this is a good first query:

- it is focused enough to filter effectively
- it is likely to connect to Patrick's recent interests
- it should reveal whether the workflow produces meaningful summaries and recommendations
