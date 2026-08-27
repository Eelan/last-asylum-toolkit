# Last Asylum Toolkit — Roadmap

This roadmap favors small, deployable increments and keeps the application static, bilingual and build-free.

## Product direction

The toolkit should progressively become a personal planning companion rather than only a collection of isolated calculators. Shared stocks, heroes and research progress should feed several tools without silently changing saved account data.

## Phase 0 — Stabilize the data foundation

Status: in progress

- Make versioned JSON the source of truth for factual game data.
- Keep source, verification status and value semantics beside every dataset.
- Validate all datasets and cross-file identifiers with `scripts/validate_data.py`.
- Add graceful application-level feedback when a required JSON file cannot be loaded.
- Add a small checked-in calculation test suite without introducing a build step.
- Add data coverage notes for missing costs, durations and prerequisites.

Exit condition: malformed or incomplete data is detected before deployment and loading failures do not leave a blank application.

## Phase 1 — Research explorer

Priority: next

- Add a hidden `research` tool entry while development is underway.
- Load the Development and Economy trees through `loadJsonDocument`.
- Provide branch switching, node navigation and research search/filtering.
- Show every level's total effect and power without implying that replacement values are additive.
- Clearly label unknown costs, durations and prerequisites as unconfirmed.
- Add complete French and English interface translations.
- Preserve wide-tree usability on mobile with horizontal scrolling and a compact list alternative.

Exit condition: users can reliably browse all currently transcribed research data, but cannot yet create a plan.

## Phase 2 — Research planner

- Let users record the current and target level of each research.
- Persist research progress under dedicated `lat-research-*` preference keys.
- Calculate power gained as `target power - current power`.
- Aggregate compatible effects by target while keeping separate research families traceable.
- Reject reversed ranges and visibly flag plans blocked by unknown prerequisites.
- Never deduct shared stocks automatically; require an explicit apply action once research resources are known.

Exit condition: complete plans can be saved and totals remain honest when some game values are unknown.

## Phase 3 — Complete research acquisition data

- Record costs and duration for every target level directly from the game.
- Record typed research and building prerequisites with stable identifiers.
- Add screenshots or source notes for disputed or atypical values.
- Visualize prerequisite paths only after the connections are verified.
- Add a coverage indicator per branch and prevent unsupported totals from being presented as complete.

Exit condition: the planner can calculate verified resources, time and blocking prerequisites for at least one complete branch.

## Phase 4 — Connected account planning

- Add a unified dashboard for saved heroes, stocks and research progress.
- Reuse saved stocks across research, heroes, Corbeau and Sanctuary plans.
- Add optional plan snapshots so users can compare priorities without overwriting their current state.
- Add import/export of local data as a human-readable JSON backup.

## Phase 5 — Existing planned tools

- Equipment planner: define and verify the equipment dataset before enabling the route.
- Team builder: start with saved-hero selection and role/faction balance; avoid unsupported combat-score claims.
- Weekly Duel improvements: connect planned upgrades while keeping event multipliers explicit and editable.

## Continuous improvements

- Accessibility: keyboard navigation, visible focus, table captions and status announcements.
- Reliability: loading/error states, dataset validation and boundary tests.
- Performance: lazy-load page-specific data and cache repeated JSON requests.
- Offline resilience: eventually vendor Lucide instead of depending on a CDN.
- Documentation: keep `README.md`, schemas, sources and verification dates synchronized.

## Recommended next deliverable

Build Phase 1 as a read-only Research Explorer. It immediately makes the Development and Economy transcription useful while costs and prerequisite data are still incomplete, and it establishes the UI structure that the planner can extend later.
