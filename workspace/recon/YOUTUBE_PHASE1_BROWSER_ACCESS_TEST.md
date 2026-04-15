# YouTube Phase 1 Browser Access Test

## Purpose

Validate whether Recon can access Patrick's signed-in YouTube history through OpenClaw browser attach in a reliable enough way to support later analysis.

This is the narrowest proof-of-access step. The goal is not to build the whole system yet. The goal is to prove whether browser-based access is viable.

---

## Primary Objective

Confirm that Recon can:

1. Attach to Patrick's real signed-in browser session
2. Reach YouTube while logged in
3. Navigate to watch history
4. Read usable history metadata
5. Open watched videos from history for deeper inspection

---

## Preconditions

Before testing, the following should be true:

- Patrick is signed into YouTube in a local Chromium-based browser
- The browser profile used for YouTube is known
- The browser is running locally on the host where OpenClaw can attach
- Browser-side remote debugging / attach support is enabled if required
- Patrick is available to approve any attach prompt if the browser asks for it

---

## Test Scope

This phase should answer these questions:

- Can OpenClaw attach to the correct browser profile?
- Can Recon see the logged-in YouTube session?
- Can Recon reach the watch history page?
- Can Recon read the list of watched videos?
- Are date/time and creator details visible enough to support filtering?
- Can Recon open individual videos from history and capture useful metadata?
- Is this stable enough to use repeatedly?

---

## Test Steps

## Step 1: Browser Attach Verification

### Goal
Confirm that OpenClaw can attach to Patrick's live local browser session.

### Checklist
- [ ] Identify whether the built-in `user` browser profile should be used
- [ ] If needed, define a custom browser profile for the actual user data directory
- [ ] Confirm the browser is open locally
- [ ] Confirm remote debugging / browser attach prerequisites are enabled
- [ ] Attempt OpenClaw browser attach
- [ ] Confirm attached session reports the expected browser tabs
- [ ] Confirm attach uses the intended signed-in browser profile

### Success criteria
- [ ] OpenClaw reports a live attached browser session
- [ ] Existing tabs are visible
- [ ] The session appears to be Patrick's real signed-in browser context

### Failure notes to capture
- attach refused
- browser not visible
- wrong browser profile
- no existing tabs detected
- remote debugging not enabled

---

## Step 2: Logged-in YouTube Access

### Goal
Confirm that Recon can access YouTube through the attached signed-in browser session.

### Checklist
- [ ] Open or focus a YouTube tab
- [ ] Confirm YouTube is accessible without a login wall
- [ ] Confirm account-level UI appears signed in
- [ ] Confirm session behavior matches Patrick's real account context

### Success criteria
- [ ] Recon can access YouTube while signed in
- [ ] The page reflects Patrick's logged-in account state

### Failure notes to capture
- redirected to sign-in
- partial session state only
- consent prompt blocks access
- browser attach is present but account state is missing

---

## Step 3: Watch History Navigation

### Goal
Reach the YouTube watch history page and confirm it is readable.

### Checklist
- [ ] Navigate to YouTube history
- [ ] Confirm the history page loads correctly
- [ ] Confirm history entries are visible
- [ ] Confirm scrolling or pagination works
- [ ] Confirm enough entries can be loaded for a recent test window

### Success criteria
- [ ] History page is reachable
- [ ] Watched video entries are visible in the UI
- [ ] Recon can traverse enough history to support a small date-range query

### Failure notes to capture
- history page blocked
- empty history
- login/session mismatch
- page structure too unstable to read
- scrolling fails or only partially loads entries

---

## Step 4: Metadata Readability Test

### Goal
Confirm that history entries expose enough metadata for later analysis.

### Metadata to look for
- video title
- creator/channel name
- video URL
- watched date or grouping label
- thumbnail or visible identifying context

### Checklist
- [ ] Read multiple video titles from history
- [ ] Read creator/channel names
- [ ] Extract video URLs or navigate to them reliably
- [ ] Determine whether watched dates or date groupings are visible
- [ ] Confirm whether a time window can be approximated from the visible UI

### Success criteria
- [ ] Titles are readable
- [ ] creators are readable
- [ ] URLs are retrievable or videos are directly openable
- [ ] enough date context exists to support rough time filtering

### Failure notes to capture
- titles not stable
- links inaccessible
- creator names not visible
- no usable date grouping shown

---

## Step 5: Individual Video Open Test

### Goal
Confirm that Recon can open selected watched videos from history and inspect them.

### Checklist
- [ ] Open at least three watched videos from history
- [ ] Confirm the correct destination video pages load
- [ ] Capture title and creator from the video page
- [ ] Capture the video URL directly
- [ ] Inspect visible description area when relevant
- [ ] Determine whether transcript or transcript-adjacent access looks possible

### Success criteria
- [ ] Recon can open watched videos directly from history
- [ ] metadata remains consistent between history and video page
- [ ] video pages expose enough detail for later enrichment

### Failure notes to capture
- click/open actions unreliable
- wrong page loads
- video unavailable
- age/restriction/login issues
- insufficient metadata on the loaded video page

---

## Step 6: Stability and Repeatability Check

### Goal
Determine whether the browser route is strong enough for repeated use.

### Checklist
- [ ] Repeat key actions more than once
- [ ] Confirm history page can be revisited without losing context
- [ ] Confirm multiple video opens work in sequence
- [ ] Confirm the attach session survives the workflow long enough to be useful
- [ ] Assess whether manual oversight is needed every time

### Success criteria
- [ ] The workflow is repeatable
- [ ] The browser session is stable enough for real queries
- [ ] The amount of manual intervention is acceptable

### Failure notes to capture
- browser detaches often
- page actions work only intermittently
- session expires quickly
- workflow is too fragile for practical use

---

## Decision Criteria

At the end of Phase 1, choose one of these outcomes:

### Outcome A: Browser access is viable
Use browser attach as the Phase 2 path and proceed to the first real query.

### Outcome B: Browser access is partially viable
Use browser attach for proof of concept, but plan a local capture layer quickly.

### Outcome C: Browser access is not viable
Do not continue browser-first. Move to alternative strategies such as:

- exported history ingestion
- a local sync pipeline
- a custom API or browser-assisted extractor

---

## Evidence to Save From the Test

If the test succeeds, capture:

- which browser profile worked
- whether `user` was enough or a custom profile was needed
- which YouTube pages were reachable
- what metadata was visible
- what was missing
- whether date filtering appears practical
- whether individual video analysis seems realistic
- whether the browser path feels stable enough for repeated use

---

## Phase 1 Exit Conditions

Phase 1 is complete when the following are true:

- [ ] Browser attach works against Patrick's signed-in session
- [ ] YouTube history is reachable
- [ ] Recon can read history entries
- [ ] Recon can open watched videos from history
- [ ] Metadata quality is good enough for Phase 2 analysis
- [ ] A decision is made on whether browser access is strong enough to continue

---

## Recommended Next Step After Success

If Phase 1 succeeds:

- move immediately to one real test query using a 7-day or 14-day window
- pick a focused topic such as MCP, AI agents, memory, or automation
- evaluate whether the output is useful enough to justify building the local research store

If Phase 1 fails:

- document exactly what broke
- switch to alternative access-path research instead of forcing the browser route
