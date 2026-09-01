## Problem Statement
- **What problem are we solving?** Obsidian users cannot easily find content matching text patterns, so they stop using Obsidian, because Obsidian doesn't have a pattern search option, but instead they only have exact match text search

### Why is this a problem?
- **Identified first principle** Obsidian users cannot easily find content matching text patterns, so they stop using Obsidian, because Obsidian's core search architecture is built for exact-token matching, not pattern matching.
---
- **New First Principle:** A pattern/regex search capability can be added on top of Obsidian without touching its core index or architecture — a plugin can maintain its own lightweight, independent search layer that runs pattern queries with sub-100ms latency for typical vault sizes.
---
- **Solution Constraints:**
1. Must be built as an Obsidian plugin.
2. Must be free to run — no ongoing cost to the developer.
---
### Idea 1: Regex-Augmented Search Matching
- **"What if ...?"** What if we took the user's search input within the currently open note as input, ran it through a regex-compatible matching engine instead of literal exact-match comparison as the operation, and returned matches within that note as output — so that the same search action a user already performs also catches pattern-based matches, without needing a separate tool or workflow?
- **Regex-Augmented Search:** "How might we make the search action itself understand patterns, instead of bolting on an entirely separate way to search?"
- **Imagine this:** A user can find text in their vault by matching a regex pattern, not just an exact phrase — they describe the shape of what they're looking for, and Obsidian finds it.
---
## Recommended Solution:
- **Recommended Solution:** Regex-Augmented Search Matching
- **Hypothesis Fit:** No formal Hypothesis is captured in `./1-pager-output.md` (Step 11 was skipped), so fit cannot be argued against a stated Hypothesis. Grounding instead in the confirmed New First Principle — this is the only captured option that directly operationalizes "pattern search can be added without touching Obsidian's core" into a concrete search mechanic, rather than a standing query or a separate index-building feature.
- **Evidence Anchor:** No quantitative evidence exists in this 1-pager (Steps 4–7 were all skipped, and no Combined Synthesis was produced) — this is a gap. The only supporting signal is qualitative: the Check for Known Solutions research (Step 13) found multiple existing community regex-search plugins for Obsidian, confirming the mechanic is technically proven and already validated by other builders in this exact ecosystem.
- **Key Assumption:** That users' failed searches are specifically failing because the query needed pattern/approximate matching — not because of some other cause (e.g. poor vault organization, forgotten note titles). Cheapest test: ship a minimal version and instrument how often users reformulate a query immediately after a zero-result exact-match search, before and after the plugin is installed.
- **Why Not the Alternatives:**
   - Start a Movement ideas (Describe-It-Don't-Write-It Search, Community Pattern Library, Always-Watching Pattern Alerts): all were skipped before selection, so none exist as a captured alternative to weigh against.
   - Agentic Solution: this step was skipped entirely, so no agentic alternative exists to weigh against.
- **Kill Condition:** No Success Metrics exist in `./1-pager-output.md` (Step 16 was skipped) — this is a gap. A Kill Condition cannot be anchored to a specific metric/threshold until Success Metrics are defined.
---
## Recommended Solution Mechanic:
- **Input(s):**
    - The user's search query, as typed.
    - The raw text content of the currently open note.
- **Operation:**
    - Receive the user's search query as typed.
    - Compile the query into a pattern (treating it as a regular expression, with a literal-text fallback if the query isn't valid regex syntax).
    - Scan the currently open note's raw text against the compiled pattern.
    - Collect every match, along with its location(s) within the note.
    - Order the matches for presentation as results.
- **Output(s):**
    - The set of matches within the currently open note — how this output solves the Problem: lets users find content within a note that only matches a pattern, not an exact phrase, without leaving Obsidian.
    - The specific matched span(s) within the note — how this output solves the Problem: shows the user exactly what matched, building confidence in the result and reducing repeated, reformulated searches.
---
## User Flow:

### Outputs (Working Backwards from JTBD):
- Output 1: A confirmed search mode (regex or exact match). Establishes how the typed query will be interpreted before any matching happens.
- Output 2: A live-updating set of matches within the note, refreshed on every keystroke. Shows results immediately as the query is refined, with no submit step.
- Output 3: Visually distinguished match locations within the note. Lets the user see every occurrence of the pattern at once, not just the first.
- Output 4: The single, currently focused match. Lets the user step through matches one at a time, confirming each occurrence before acting on it.
- Output 5: All matches selected simultaneously. Lets the user edit every occurrence of the pattern in one simultaneous edit instead of one at a time.

### Inputs:
- Input 1: The user's choice of search mode (regex or exact match). Determines whether the query is parsed as a pattern or treated as literal text.
- Input 2: The user's search query, typed incrementally. Supplies the pattern or literal text checked against the note on every keystroke.
- Input 3: The raw text of the currently open note. Supplies the content the query is checked against as the user types.
- Input 4: The user's request to move focus to the next or previous match. Tells the system which single match to focus next, relative to the current one.
- Input 5: The user's request to select all current matches at once. Tells the system to convert every match location into an editable selection.

### Happy Path:
#### Choose Search Mode:
- Input: The user selects whether the query should be interpreted as regex or as an exact match.
- Output: The system sets the interpretation mode for the query about to be typed.

#### Type Query Live:
- Input: The user types a query into the note, one character at a time.
- Output: The system re-evaluates matches within the open note after every keystroke.

#### View Live Matches:
- Input: The system compares the in-progress query against the note's text using the chosen mode.
- Output: The system visually marks every matching location within the note as the query updates.

#### Navigate Between Matches:
- Input: The user requests to move focus to the next or previous match.
- Output: The system moves the single active selection to that match location.

#### Select All Matches:
- Input: The user requests that all current matches be selected at once, as an alternative to navigating one at a time.
- Output: The system converts every match location into a simultaneous, independently editable selection.
---
## User Stories:

### User Stories for Users:
#### Search Mode Selection:
- [Phase 1] **Toggle Search Mode:** As a User I want to switch between regex and exact-match modes so that I can search using whichever approach fits what I'm looking for.

#### Live Pattern Matching:
- [Phase 1] **Type Query Live:** As a User I want to type my search query directly into the note so that I don't have to open a separate tool to look for a pattern.
- [Phase 1] **See Live Match Results:** As a User I want to see matches update as I type so that I can tell right away whether my pattern is finding what I expect.
- [Phase 1] **Fall Back on Bad Regex:** As the system I want to fall back to literal-text matching when the typed query isn't valid regex so that a User doesn't hit an error just because their pattern has a syntax mistake.

#### Match Navigation:
- [Phase 1] **Jump to Next Match:** As a User I want to jump to the next match with a single action so that I can review each occurrence one at a time without scrolling manually.
- [Phase 1] **Jump to Previous Match:** As a User I want to jump back to the previous match so that I can revisit an occurrence I already passed without restarting my search.

#### Bulk Match Editing:
- [Phase 1] **Select All Matches:** As a User I want to select every match at once so that I can act on all occurrences of the pattern in a single simultaneous action.
- [Phase 1] **Edit All Selections Together:** As a User I want my edits to apply to every selected match at the same time so that I don't have to repeat the same edit one occurrence at a time.
---
## Project Phases:
#### Phase 1: Full Regex Search & Edit
- **Goal**: A user can search a note in regex or exact mode, see live highlighted matches, step through them one at a time, and select all matches to edit simultaneously.
---
## Design Paradigms:

### Paradigm 1: Find Bar Overlay
- **MentalModel**: Search is a temporary tool you invoke, use, then dismiss — the same mental model as Cmd+F in any text editor.
- **InteractionModel**: User opens a find bar via a shortcut, types into it, and sees live highlights appear inline in the note behind it.
- **InterfacePatterns**: find/replace toolbar, inline highlight decorations, keyboard shortcut overlay
- **InformationArchitecture**: All controls (mode toggle, next/prev, select-all) live in one persistent bar above the note; results live inline in the document.
- **InteractionFlow**: Invoke find bar → type query → review live highlights inline → navigate or select all → dismiss bar.
- **ParadigmType**: Existing
- **Tradeoffs**: Familiar to anyone who's used Cmd+F elsewhere, but the bar competes for vertical space in a narrow note pane and can feel cramped on small windows.

