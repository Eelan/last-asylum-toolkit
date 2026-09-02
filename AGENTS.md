# Last Asylum Toolkit — Agent Guide

## Project overview

This repository is a bilingual Svelte 5 application for **Last Asylum: Plague**.
Vite builds the web application for GitHub Pages. Tauri 2 wraps the same frontend
for desktop and future Android builds. Use npm and the committed lockfile.

## Architecture

```text
src/
├── main.ts                  # Svelte bootstrap
├── App.svelte               # Application shell, hash routing and global timers
├── pages/                   # One Svelte component per tool
├── styles/                  # Existing design tokens and responsive CSS
└── lib/
    ├── components/          # Shared Svelte controls
    ├── config/              # Tool catalogue, lazy pages and icon registry
    ├── domain/              # Pure calculations, independent of DOM and Tauri
    ├── core/                # Data, time, stock and account services
    ├── state/               # Shared reactive preferences
    ├── platform/            # Persistence and native/browser boundaries
    ├── i18n/                # French and English translations
    └── data.js              # Shared dataset compatibility adapter
public/
├── data/                    # Versioned JSON and schemas
└── assets/images/           # Bundled game artwork
src-tauri/
├── src/lib.rs               # Shared native and mobile entry point
├── src/main.rs              # Desktop entry point
├── capabilities/            # Explicit native permissions
└── tauri.conf.json
```

- Use Svelte 5 components for page markup and events; do not restore imperative HTML renderers.
- Keep application navigation in `App.svelte`; preserve existing hash routes for GitHub Pages.
- Use relative module imports with explicit extensions. TypeScript is configured for new typed services; retained JavaScript domain modules remain supported.
- Put reusable game calculations in `src/lib/domain/`, without DOM or native APIs.
- Put page-specific behavior in `src/pages/`; extract shared controls into `src/lib/components/`.
- Keep native calls behind `src/lib/platform/`. Web builds must work without Tauri.
- Register tools in `src/lib/config/tools.js` and lazy page components in `src/lib/config/pages.ts`.
- Tools with `ready: false` must remain hidden from navigation and the home dashboard.
- Follow the official Tauri layout: native setup in `src-tauri/src/lib.rs`, desktop entry in `main.rs`.
- Keep frontend and native lockfiles. Do not introduce a server or SSR without an explicit request.

## Data and game rules

- Keep static game values as JSON sources of truth under `public/data/`, not inside page renderers or JavaScript modules.
- Give each regular dataset a versioned envelope containing `schemaVersion`, `id`, `source`, `semantics`, and `data`. Specialized datasets may use a dedicated schema but must retain equivalent version and source metadata.
- Validate regular datasets against `public/data/game-dataset.schema.json`; add a specialized schema when a domain needs a stronger contract.
- Keep `src/lib/data.js` as the compatibility adapter for shared datasets and use `loadDataset` for page-specific lazy loading.
- Use stable English kebab-case dataset and entity IDs. Keep user-facing French and English text in `src/lib/i18n/translations.js` or the existing locale modules.
- Add a short comment when a compact data format is not self-explanatory.
- Preserve the source meaning: distinguish per-level cost from cumulative cost and current-level cost from next-level cost.
- Declare those meanings in the dataset `semantics` object. Prefer explicit names such as `effectAtLevel`, `powerAtLevel`, and `upgradeCost` for newly structured records.
- Store numeric values as numbers without display symbols. Formatting such as `+`, `-` and `%` belongs in the UI.
- Use `null` for an unknown cost, duration, prerequisite, or value. Use `0` only when the verified game value is actually zero.
- Put the cost and duration of reaching a level on that target level. Put total effects and power on the level reached; do not add replacement values across levels.
- Represent prerequisites as typed references with a stable `id` and `minimumLevel`; keep them `null` until verified rather than guessing tree connections.
- For new or changed game data, verify values against current public sources and report the source used.
- Do not silently extrapolate missing game values. Mark them as unconfirmed or leave the feature unavailable.

## French terminology

French is the primary product language. Keep English translations complete.

Use these established terms consistently:

- Raven → **Corbeau**
- Raven Fruit → **Fruit du corbeau**
- Raven Essence → **Essence du corbeau**
- Shard → **Fragment**
- Skill Badge → **Badge de Compétence**
- Hero-specific Shard → **Fragment spécifique**
- Omni Shard → **Fragment Omni**

Do not translate internal route names, DOM IDs, storage keys, or JavaScript identifiers solely for display purposes.
All user-facing text must come from `src/lib/i18n/translations.js`; avoid hard-coded French or English strings in page modules.

## Stocks and local storage

- Account-wide stocks are shared across pages through `src/lib/core/storage.js`.
- Use `StockField.svelte`, `getStoredStock`, and `setStoredStock`; do not access stock keys directly in page components. All storage I/O goes through `src/lib/platform/storage.ts`.
- Stock keys use the `lat-stock-<resource>` namespace.
- Planner preferences that are not stocks may use their own `lat-<feature>-<setting>` namespace.
- Preserve existing local data when renaming a key by adding a migration in `LEGACY_STOCKS`.
- Simulations must not deduct stock unless the UI presents an explicit user action to apply the result.

## Code style and documentation

- Prefer descriptive names such as `current`, `target`, `resource`, and `availablePoints` over single-letter variables.
- Use semicolons and the formatting style already present in the surrounding module.
- Add JSDoc to exported functions and helpers with non-obvious contracts.
- Comment business rules, data encodings, migrations and algorithms—not straightforward assignments.
- Use `// #region Name` and `// #endregion` when a file contains multiple substantial concerns.
- Avoid regions in very small modules where the filename and functions already provide sufficient structure.
- Keep functions focused. Extract a helper when a calculation or persistence rule can be named and tested independently.

## UI conventions

- Reuse the existing panels, form grids, result cards and responsive table styles before adding new CSS.
- Render the common tool heading with `PageHeader.svelte` (owned by the application shell).
- Use Lucide icons through `Icon.svelte` and its explicit import registry. Keep icons bundled for offline use.
- Every displayed clock time, date or weekday whose value depends on timezone must follow the application-wide Server/Local switch. Read the current mode with `getClockMode()` and use the helpers in `src/lib/core/time.js`; switching modes must rerender all affected values consistently.
- Preserve mobile behavior and horizontal scrolling for wide tables.
- A calculator must handle an invalid or reversed range without displaying misleading totals.

## Verification

Before handing off a change, run `npm run verify` (install the Playwright Chromium browser first) and inspect the results:

1. Run `git diff --check`.
2. Verify that every relative ES-module import resolves to an existing file.
3. Verify that every `translate('key')` / `$t('key')` exists in both French and English.
4. Parse every JSON dataset and validate every regular dataset against `public/data/game-dataset.schema.json` or its specialized schema.
5. Confirm that new stock fields use the shared storage service and the intended resource key.
6. Inspect `git status --short` and preserve unrelated user changes.
7. For calculation changes, test at least one normal range, one boundary value and one invalid/reversed range.
8. Run `npm run check` and `npm run build`; run a Rust check when the native toolchain is available.
9. For pages displaying timezone-dependent values, verify both Server and Local modes, including any date or weekday rollover caused by conversion.

Do not commit unless the user asks for a commit. When asked, use a concise conventional commit message and keep unrelated changes out of the commit.
