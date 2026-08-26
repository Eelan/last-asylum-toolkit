# Last Asylum Toolkit — Agent Guide

## Project overview

This repository is a static, bilingual single-page application for **Last Asylum: Plague**.
It is deployed directly to GitHub Pages and has no package manager, bundler, framework, or build step.

Preserve that simplicity unless the user explicitly requests a tooling change.

## Architecture

```text
index.html
assets/
├── css/app.css
├── data/               # Versioned JSON game datasets and their schemas
└── js/
    ├── app.js          # Bootstrap, navigation and hash routing
    ├── data.js         # Async adapter exposing JSON datasets to the application
    ├── i18n.js         # French and English translations
    ├── config/         # Tool catalogue and application configuration
    ├── core/           # Shared DOM, i18n, storage and UI helpers
    ├── domain/         # Pure game calculations without DOM access
    └── pages/          # One module per tool page
```

- Use native ES modules with relative `.js` imports.
- Keep `app.js` limited to application-level navigation and routing.
- Put page markup, event listeners and page-specific persistence in `assets/js/pages/<page>.js`.
- Put game rules and reusable calculations in pure functions under `assets/js/domain/`.
- Put reusable behavior in `assets/js/core/` only after it is shared by multiple pages.
- Register visible and planned tools in `assets/js/config/tools.js`.
- Tools with `ready: false` must remain hidden from navigation and the home dashboard.

## Data and game rules

- Keep static game values as JSON sources of truth under `assets/data/`, not inside page renderers or JavaScript modules.
- Give each regular dataset a versioned envelope containing `schemaVersion`, `id`, `source`, `semantics`, and `data`. Specialized datasets may use a dedicated schema but must retain equivalent version and source metadata.
- Validate regular datasets against `assets/data/game-dataset.schema.json`; add a specialized schema when a domain needs a stronger contract.
- Keep `assets/js/data.js` as the compatibility adapter for shared datasets and use `loadDataset` for page-specific lazy loading.
- Use stable English kebab-case dataset and entity IDs. Keep user-facing French and English text in `assets/js/i18n.js` or the existing locale modules.
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
All user-facing text must come from `assets/js/i18n.js`; avoid hard-coded French or English strings in page modules.

## Stocks and local storage

- Account-wide stocks are shared across pages through `assets/js/core/storage.js`.
- Use `bindPersistentStocks`, `getStoredStock`, and `setStoredStock`; do not access stock keys directly in page modules.
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
- Render the common tool heading with `renderPageHeader` from `assets/js/core/ui.js`.
- Use Lucide icons through the shared `icon()` helper.
- Preserve mobile behavior and horizontal scrolling for wide tables.
- A calculator must handle an invalid or reversed range without displaying misleading totals.

## Verification

Before handing off a change:

1. Run `git diff --check`.
2. Verify that every relative ES-module import resolves to an existing file.
3. Verify that every `translate('key')` used by the application exists in both French and English.
4. Parse every JSON dataset and validate every regular dataset against `assets/data/game-dataset.schema.json` or its specialized schema.
5. Confirm that new stock fields use the shared storage service and the intended resource key.
6. Inspect `git status --short` and preserve unrelated user changes.
7. For calculation changes, test at least one normal range, one boundary value and one invalid/reversed range.

Do not commit unless the user asks for a commit. When asked, use a concise conventional commit message and keep unrelated changes out of the commit.
