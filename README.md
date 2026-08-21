# Last Asylum Toolkit SPA

Static SPA for GitHub Pages. No build step required.

## Features
- Hash-based SPA routing (`#/antitoxin`, `#/shards`, etc.)
- Home dashboard with one card per tool
- Lucide icons
- French / English flag switcher
- Mobile responsive sidebar
- Antitoxin calculator
- Shard calculator
- Skill Badge calculator
- Alliance Duel hero-day estimator
- Weekly Alliance Duel planner
- Placeholder routes ready for Sanctuary, Gear, Raven and Team Builder

## Deploy on GitHub Pages
Upload all files to the repository root, then:
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Translation
Translations are in `assets/js/i18n.js`.
Add a new language object and a new language button in `index.html`.

## Icons
Lucide is loaded from unpkg CDN. If you want a fully offline version later, vendor the Lucide JS file into `assets/vendor/`.
