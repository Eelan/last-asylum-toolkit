# Last Asylum Toolkit SPA

Static SPA for GitHub Pages. No build step required.

## Features
- Hash-based SPA routing (`#/antitoxin`, `#/shards`, etc.)
- Home dashboard with one card per tool
- Lucide icons
- French / English flag switcher
- Mobile responsive sidebar
- Centralized stocks persisted in local storage
- Antitoxin calculator
- Hero Fragment calculator with specific and Omni stocks
- Badge de Compétence calculator
- Corbeau calculator (levels 1–250)
- Sanctuary planner (levels 1–30)
- Alliance Duel resource planner
- Weekly Alliance Duel planner
- In-app data provenance and verification dates
- Hidden placeholder routes ready for Gear and Team Builder

## Run locally

Native ES modules must be served over HTTP. From the repository root, run for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly with `file://` is not supported.

## Deploy on GitHub Pages
Upload all files to the repository root, then:
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Translation
Translations are in `assets/js/i18n.js`.
Add a new language object and a new language button in `index.html`.

## JavaScript organization

- `assets/js/app.js`: application bootstrap and routing
- `assets/js/config/`: tool catalogue and application configuration
- `assets/js/core/`: shared DOM, translation and storage helpers
- `assets/js/domain/`: pure game calculations without DOM access
- `assets/js/pages/`: one renderer and its business logic per tool page
- `assets/data/`: versioned JSON game datasets and schemas
- `assets/js/data.js`: compatibility adapter loading shared JSON datasets

The application uses native ES modules and still requires no build step.

## Data validation

Run the repository validator after changing a dataset:

```bash
python3 scripts/validate_data.py
```

The validator parses every JSON file, checks the regular and research schemas, verifies research-tree references and confirms that every hero has a catalogue entry, profile and skill dataset.

The product roadmap is maintained in [`docs/ROADMAP.md`](docs/ROADMAP.md).

### Code documentation conventions

- Each tool page owns its markup, event bindings and persistence wiring.
- Pure calculations and game rules live in `assets/js/domain/`.
- JSDoc comments describe exported functions and non-obvious business rules.
- `// #region` blocks separate large concerns such as calculation, events and datasets.
- Straightforward statements are left uncommented to avoid duplicating what the code already says.

## Icons
Lucide is loaded from unpkg CDN. If you want a fully offline version later, vendor the Lucide JS file into `assets/vendor/`.
