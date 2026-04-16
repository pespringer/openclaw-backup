# YouTube History Workflow Technical Build Spec

## Purpose

Define the technical architecture for a system that lets Recon analyze Patrick's YouTube watch history, summarize watched content, extract useful references, and recommend follow-up videos.

This spec is intentionally practical. It is designed for a local-first setup on the same host where OpenClaw runs.

---

## Goal

Support a workflow where Patrick can ask for:

- watched videos on a topic within a time range
- concise summaries of what those videos discussed
- extracted tools, links, products, repos, APIs, and creators
- follow-up recommendations from the same or similar creators
- watch, skim, or skip guidance

---

## System Overview

The system should be built in layers:

1. **Access layer**
   - obtains YouTube history and video-page access
2. **Capture layer**
   - stores raw history entries locally
3. **Enrichment layer**
   - adds metadata, summaries, extracted references, and tags
4. **Query layer**
   - filters by topic, date range, creator, and references
5. **Recommendation layer**
   - proposes related videos and ranks likely value
6. **Memory layer, optional**
   - persists durable creator/topic insights into OpenClaw memory or wiki structures

---

## Architecture

## 1. Access Layer

### Primary path
Use OpenClaw browser attach against Patrick's signed-in Chromium session.

### Responsibilities
- connect to the correct browser profile
- access YouTube while authenticated
- open watch-history pages
- open individual watched video pages
- extract visible metadata

### Design notes
- treat browser attach as the initial access mechanism, not the final source of truth
- do not rely on live UI access for all future queries
- prefer using browser access to capture data into local storage as early as possible

### Fallback access paths
If browser access is unstable, support later alternatives such as:
- exported history ingestion
- manually supplied history snapshots
- a custom local extraction pipeline

---

## 2. Capture Layer

### Purpose
Convert live YouTube history visibility into a durable local dataset.

### Responsibilities
- collect history entries from chosen date windows
- normalize captured entries into a stable local record format
- prevent duplicate capture when the same videos are encountered again
- preserve provenance from the original history source

### Raw capture record should include
- source type, browser-history capture
- capture timestamp
- visible watched date or grouping label
- title
- creator/channel
- URL
- thumbnail URL if easy to capture
- source notes about missing or partial fields

### Design notes
- raw capture should be append-friendly
- do not mix raw capture and enriched analysis in the same file
- preserve the original observed state before later enrichment modifies interpretation

---

## 3. Enrichment Layer

### Purpose
Turn raw watched videos into useful research objects.

### Responsibilities
- fetch additional page metadata from the video page
- extract descriptions where useful
- extract transcript where available
- summarize the content
- extract tools, links, products, repos, APIs, creators, and people
- assign topics and tags
- judge novelty and value

### Enrichment stages

#### Stage A: metadata enrichment
- canonical video URL
- title normalization
- creator normalization
- video identifiers
- description text

#### Stage B: content enrichment
- transcript or transcript-adjacent text
- concise summary
- bullet key points
- extracted references

#### Stage C: analytic enrichment
- topic tags
- creator tags
- novelty score or note
- usefulness note
- related creators

### Design notes
- enrichment should be idempotent where possible
- missing transcript should not block summary generation
- extraction confidence should be recorded when the signal is weak

---

## 4. Query Layer

### Purpose
Answer history-based research questions quickly and consistently.

### Required filters
- date range
- topic
- creator/channel
- extracted tools or references
- watched versus recommended distinction

### Query inputs
- natural-language prompt from Patrick
- structured filters derived from that prompt

### Query outputs
- relevant watched videos
- per-video summaries
- cross-video synthesis
- extracted references
- creator patterns

### Design notes
- query results should prioritize high-signal matches over broad inclusion
- date filtering should use exact watched date when available, else grouping approximation

---

## 5. Recommendation Layer

### Purpose
Recommend the best next videos based on prior watched material and extracted themes.

### Responsibilities
- identify more videos from watched creators
- identify similar creators
- identify likely high-signal videos on the requested topic
- reduce repetitive or redundant recommendations
- attach watch, skim, or skip guidance

### Recommendation factors
- creator similarity
- topic overlap
- freshness or continued relevance
- likely novelty compared to already watched videos
- popularity only as a secondary signal

### Design notes
- recommendations should not be a generic search dump
- each recommendation needs a reason for inclusion

---

## 6. Optional Memory Layer

### Purpose
Persist durable insights that should outlive a single research query.

### Candidate durable memory items
- creators Patrick consistently finds useful
- recurring topic clusters
- repeated tool references across many videos
- stable opinions about which creator styles are high-signal or low-signal

### Storage targets
- OpenClaw memory files for lightweight persistence
- optional wiki or structured knowledge layer for creator/topic synthesis

### Design notes
- do not dump every video summary into durable memory
- only persist patterns and long-lived insights

---

## Data Flow

1. Browser attach opens YouTube history
2. Raw history entries are captured into local files
3. Candidate videos are selected for enrichment
4. Enrichment writes normalized per-video records
5. Topic and creator rollups are updated
6. Query engine reads stored records
7. Recommendation engine proposes next videos
8. Optional durable insights are written into memory/wiki layers

---

## Storage Strategy

The system should use a local filesystem-first layout, with separate layers for:

- raw history capture
- normalized video records
- creator summaries
- topic rollups
- exports and reports
- enrichment cache

Detailed folder schema should live in a dedicated data model document.

---

## Record Types

The system should support at least these record categories:

1. **Raw history entry**
2. **Normalized watched video record**
3. **Creator profile**
4. **Topic rollup**
5. **Query report**
6. **Recommendation set**

---

## Operational Requirements

### Reliability
- browser attach can fail without corrupting stored data
- enrichment can be retried safely
- repeated capture should avoid uncontrolled duplication

### Transparency
- source URLs and provenance should be preserved
- missing data should be labeled clearly
- transcript-based and metadata-based conclusions should not be conflated silently

### Performance
- once captured locally, repeated analysis should avoid reopening the same pages unnecessarily
- enrichment should be incremental

### Safety and privacy
- account-level browser access should be treated as sensitive
- no external sharing should happen without approval
- local files should keep a clear distinction between raw account-derived data and derived summaries

---

## Initial Implementation Sequence

### Build order
1. browser access validation
2. raw history capture
3. normalized video record format
4. metadata enrichment
5. first query workflow
6. recommendation workflow
7. optional memory integration

### MVP boundary
An MVP is complete when Patrick can ask for a topic-plus-time-range history query and receive:
- matched watched videos
- specific summaries
- extracted tools and references
- follow-up video recommendations with watch guidance

---

## Non-Goals for the First Iteration

- full autonomous continuous YouTube monitoring
- complete historical backfill of all prior watch history
- perfect transcript extraction for every video
- overly complex scoring systems before usefulness is proven
- heavy external infrastructure like databases or vector stores before file-based workflow is validated

---

## Open Questions

- How much watched-date precision is available from the history page?
- Is transcript access good enough to rely on, or should summary quality assume metadata-first analysis?
- Should recommendations be captured into local records, or generated on demand only?
- Which parts of the output deserve durable memory promotion?

---

## Recommendation

Build this as a local-first, file-backed workflow with browser attach only as the ingestion path.

That gives the best balance of speed, control, privacy, and practical reliability.
