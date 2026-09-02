# Last Asylum Toolkit

Bilingual community toolkit for **Last Asylum: Plague**, built with Svelte 5,
Vite and Tauri 2. The same frontend runs on GitHub Pages and in the native shell.
Game data, artwork and icons are bundled; the native application does not need a
network connection for its calculators, heroes, research trees or calendars.

## Web development

Use Node.js 22.12+ (Node 24 recommended) and npm:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:1420`. Existing links such as `#/antitoxin` and
`#/heroes/arthur` continue to work. `npm run build` produces `dist/`;
`npm run preview` serves the production build locally.

## Desktop and Android

Follow the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
for the OS where you run the commands. Rust/Cargo and the platform's native
build tools are required in addition to Node.js.

```sh
npm run tauri -- dev
npm run tauri -- build
```

For Android, install Android Studio, SDK, NDK and the required Rust Android
targets, and configure `JAVA_HOME`, `ANDROID_HOME` and `NDK_HOME` as described
in the official prerequisites. Then:

```sh
npm run tauri -- android init
npm run tauri -- android dev
npm run tauri -- android build
```

Use a consistent environment. With Android Studio installed on Windows, run
npm, Rust and Android commands from Windows PowerShell. Do not reuse a Linux
`node_modules` installation on Windows; run `npm ci` in the chosen environment.
`TAURI_DEV_HOST` is supported for device development. Generated Android
projects live in `src-tauri/gen/android/`; schemas and build outputs are ignored.
Choose the final application identifier before publishing to an app store.
The current development identifier is `com.eelan.lastasylumtoolkit`.

The native entry points and Vite configuration follow the official
[Tauri project layout](https://v2.tauri.app/start/project-structure/) and
[Vite integration](https://v2.tauri.app/start/frontend/vite/).

## Verification

```sh
python3 -m pip install jsonschema
npx playwright install chromium
npm run verify
```

This runs Svelte/TypeScript diagnostics, module and translation contracts,
calculation and timezone tests, JSON schema validation, the production build,
and browser tests. Linux CI may also require Playwright system dependencies
(`npx playwright install --with-deps chromium`). To check the native shell:

```sh
cargo check --manifest-path src-tauri/Cargo.toml
```

## GitHub Pages

Select **GitHub Actions** as the Pages source in repository settings.
`.github/workflows/pages.yml` validates and builds the web app, then publishes
`dist/` on pushes to `main` or a manual run. Refactor branches are checked by
`.github/workflows/check.yml` without publishing. Relative assets and hash
routes support both root domains and repository subdirectories.

## Architecture

- `src/App.svelte`: shared shell, navigation and global reminder checks.
- `src/pages/`: lazily loaded Svelte tool components.
- `src/lib/components/`: common headers, icons, stock and level fields.
- `src/lib/domain/`: existing game calculations, independent of Svelte/Tauri.
- `src/lib/core/`: account, dataset and time services.
- `src/lib/state/`: reactive language and clock preferences.
- `src/lib/platform/`: storage, foreground notifications and native link handling.
- `src/lib/i18n/translations.js`: French and English text.
- `public/data/`: unchanged versioned datasets and their schemas.
- `src/styles/`: design tokens and responsive CSS.
- `src-tauri/`: native Rust project, capabilities and application icons.

The retained JavaScript domain modules coexist with TypeScript services and
configuration. There is no backend server or SSR.

## Local data and reminders

Existing `lat-*` storage keys and legacy stock migrations are retained.
Web users keep their data when the site stays on the same origin. Native
WebViews have separate storage: browser data is not automatically transferred
to the Android app. Cross-device export/import is future work.

The Server/Local switch updates the clock, event windows and reminder dates,
including date rollover. Timer drafts retain their absolute instant when the
mode changes. Reminders currently run while the application is open; Android
background notifications require a separate native scheduling integration.

See [the migration notes](docs/TAURI-MIGRATION.md) and [the roadmap](docs/ROADMAP.md).
