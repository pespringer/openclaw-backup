# YouTube Local Data Model and Folder Schema

## Purpose

Define the filesystem structure and logical record model for the YouTube history research workflow.

The design should support:

- raw history capture
- normalized watched-video records
- creator and topic rollups
- query outputs
- recommendation outputs
- cacheable enrichment work

This model is intentionally local-first and human-inspectable.

---

## Root Directory

Recommended root path:

`/home/claw/youtube-research/`

---

## Folder Schema

```text
/home/claw/youtube-research/
  history/
    raw/
    normalized/
  videos/
    by-id/
    by-date/
  creators/
  topics/
  queries/
  recommendations/
  exports/
  cache/
    transcripts/
    descriptions/
    pages/
  state/
  schemas/
```

---

## Folder Purposes

## `history/raw/`

Stores minimally processed capture snapshots from YouTube watch history.

### Contents
- append-only capture batches
- exact observed fields from the history page
- partial records allowed

### Use
- source-of-truth for what was seen in the UI during capture
- replay and debugging of normalization logic

---

## `history/normalized/`

Stores normalized history-entry records derived from raw capture.

### Contents
- cleaned watched-entry records
- canonical URL mapping
- normalized creator names
- watched-date interpretation where available

### Use
- faster query filtering
- dedupe-friendly layer between raw capture and full video analysis

---

## `videos/by-id/`

Stores one enriched record per canonical video.

### Naming
Prefer stable identifiers when possible, such as YouTube video ID.

Example:
- `videos/by-id/abc123def45.md`
- `videos/by-id/abc123def45.json`

### Use
- primary record for per-video enrichment
- summary, references, topics, and provenance live here

---

## `videos/by-date/`

Stores date-grouped indexes that map watched dates to video IDs.

### Example
- `videos/by-date/2026-04-15.json`
- `videos/by-date/2026-04-14.json`

### Use
- fast date-range lookup
- easy reconstruction of what was watched on or around a date

---

## `creators/`

Stores creator/channel rollups.

### Contents
- creator profile file
- related watched videos
- recurring topics
- usefulness notes
- recommendation notes

### Naming
Slugified creator/channel names or stable channel identifiers when available.

Example:
- `creators/ai-lab-notes.md`
- `creators/channel-UCxxxxx.json`

---

## `topics/`

Stores topic rollups and synthesized patterns.

### Contents
- topic summary
- related watched videos
- extracted tools and references
- useful creators for the topic
- recurring claims or themes

### Naming
Slugified topic names.

Example:
- `topics/mcp.md`
- `topics/ai-agents.md`
- `topics/memory-systems.md`

---

## `queries/`

Stores structured records of completed user queries.

### Contents
- original query request
- normalized query parameters
- matched watched videos
- generated synthesis
- links to recommendations and exports

### Use
- traceability
- reuse of prior work
- comparison across repeated queries over time

---

## `recommendations/`

Stores recommendation sets created from a specific query or topic.

### Contents
- recommended videos
- creator rationale
- novelty notes
- watch, skim, or skip guidance

### Use
- compare recommendation quality over time
- avoid regenerating the same follow-up set repeatedly

---

## `exports/`

Stores user-facing reports or polished outputs.

### Contents
- markdown reports
- shareable summaries
- topic reports
- time-range query outputs

### Use
- final deliverables
- polished human-facing artifacts

---

## `cache/`

Stores temporary or reusable enrichment artifacts.

### Subfolders
- `transcripts/` — transcript text when available
- `descriptions/` — cached video descriptions
- `pages/` — cached page snapshots or extracted metadata

### Use
- reduce repeated fetch/extraction work
- preserve inputs used for summarization

---

## `state/`

Stores workflow state and operational metadata.

### Contents
- last processed history checkpoint
- dedupe maps
- ingestion cursors
- retry state

### Use
- make ingestion incremental
- keep repeated runs efficient

---

## `schemas/`

Stores record schemas, examples, and conventions.

### Contents
- JSON schema definitions
- field dictionaries
- file naming conventions
- normalization rules

### Use
- keep the system consistent
- support future automation and validation

---

## Core Record Types

## 1. Raw History Entry

### Purpose
Record exactly what was observed in YouTube history.

### Suggested fields
- `captureId`
- `capturedAt`
- `source`
- `historyLabel`
- `titleObserved`
- `creatorObserved`
- `urlObserved`
- `thumbnailObserved`
- `notes`

### Storage
- `history/raw/*.jsonl` or batch JSON files

---

## 2. Normalized History Entry

### Purpose
Clean and standardize raw history records for filtering.

### Suggested fields
- `historyEntryId`
- `videoId`
- `canonicalUrl`
- `title`
- `creator`
- `watchedDate`
- `watchedDatePrecision`
- `sourceCaptureIds`
- `normalizationNotes`

### Storage
- `history/normalized/*.jsonl` or per-day files

---

## 3. Enriched Video Record

### Purpose
Serve as the primary research object for one watched video.

### Suggested fields
- `videoId`
- `canonicalUrl`
- `title`
- `creator`
- `channelId`
- `watchedDates[]`
- `description`
- `transcriptStatus`
- `transcriptPath`
- `summaryShort`
- `summaryDetailed`
- `keyPoints[]`
- `toolsMentioned[]`
- `linksMentioned[]`
- `reposMentioned[]`
- `productsMentioned[]`
- `apisMentioned[]`
- `peopleMentioned[]`
- `topicTags[]`
- `noveltyNote`
- `usefulnessNote`
- `provenance[]`
- `updatedAt`

### Storage
- `videos/by-id/<videoId>.json`
- optional companion markdown summary file

---

## 4. Creator Profile

### Purpose
Track patterns and usefulness of a creator across watched videos.

### Suggested fields
- `creatorId`
- `creatorName`
- `channelUrl`
- `videoIds[]`
- `commonTopics[]`
- `recurringTools[]`
- `styleNotes`
- `valueAssessment`
- `recommendedFollowUps[]`
- `updatedAt`

### Storage
- `creators/<slug>.json`
- optional markdown profile

---

## 5. Topic Rollup

### Purpose
Capture synthesized knowledge for a topic across multiple videos.

### Suggested fields
- `topicId`
- `topicName`
- `videoIds[]`
- `creatorIds[]`
- `mainThemes[]`
- `toolClusters[]`
- `openQuestions[]`
- `recommendedCreators[]`
- `updatedAt`

### Storage
- `topics/<slug>.json`
- optional markdown topic report

---

## 6. Query Record

### Purpose
Preserve what was asked, what matched, and what was returned.

### Suggested fields
- `queryId`
- `requestedAt`
- `rawPrompt`
- `normalizedTopic`
- `dateRange`
- `matchedVideoIds[]`
- `outputPath`
- `recommendationSetId`
- `notes`

### Storage
- `queries/<timestamp>-<slug>.json`

---

## 7. Recommendation Set

### Purpose
Store ranked follow-up video suggestions for a query or topic.

### Suggested fields
- `recommendationSetId`
- `sourceQueryId`
- `topic`
- `recommendedVideos[]`
- `selectionNotes`
- `generatedAt`

Each recommended video may include:
- title
- creator
- url
- reason
- summary
- rating, watch/skim/skip

### Storage
- `recommendations/<timestamp>-<slug>.json`

---

## File Format Recommendations

### Raw and structured records
Use JSON or JSONL for:
- raw capture
- normalized records
- machine-readable indexes
- workflow state

### Human-facing outputs
Use Markdown for:
- creator rollups
- topic summaries
- exported reports
- polished query results

### Hybrid approach
Use both when helpful:
- JSON for structure
- Markdown for readability

This is probably the best fit.

---

## Indexing and Lookup Strategy

### Primary keys
- `videoId` for videos
- `queryId` for query runs
- `recommendationSetId` for follow-up sets
- creator slug or stable channel ID for creators
- topic slug for topics

### Fast lookup paths
- date to watched videos via `videos/by-date/`
- topic to videos via topic rollups
- creator to videos via creator profiles
- query to output via query records

---

## Dedupe Rules

- the same video watched multiple times should map to one canonical video record
- watched-date arrays should preserve multiple watch events when visible
- the same raw history capture should not create duplicate normalized entries
- creator name variants should normalize to one creator record when confidence is high

---

## Provenance Rules

Each enriched record should preserve where its data came from, such as:
- history capture
- video page metadata
- description text
- transcript text
- external follow-up research

This matters because later summaries should remain auditable.

---

## Recommendation

Use a hybrid JSON-plus-Markdown local store rooted at `/home/claw/youtube-research/`.

That gives structure for automation and enough readability for manual inspection.
