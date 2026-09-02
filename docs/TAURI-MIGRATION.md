# Tauri / Svelte migration

## Architecture decision

The frontend uses Svelte 5 with Vite, preserving hash routing and GitHub Pages
compatibility. SvelteKit and SSR are unnecessary for these local tools.
The native wrapper follows Tauri's `src-tauri/` layout and shares its entry
point in `src/lib.rs` between desktop and mobile builds.

All fourteen ready tools have Svelte page components. The imperative renderers,
HTML-string page generation and global Lucide CDN script have been removed.
Shared UI is composed from Svelte components; tool modules load on navigation.
Pure game calculations and versioned JSON data retain their existing semantics.
JavaScript modules are retained where rewriting them would add no functional
benefit; TypeScript is available for services, configuration and new development.

## Compatibility

- Existing route IDs, stock keys, planner preferences and tracked heroes are retained.
- Existing images and data are bundled and available without remote requests.
- Unready tools stay hidden from navigation and the dashboard.
- French remains the default; English remains complete at the application-key level.
- The existing research source labels and hero source data are retained verbatim.
- A language or clock change updates the mounted page without clearing its form drafts.
- Dataset and page loading failures have an explicit error state.
- Native external links use Tauri's opener with an HTTPS-only capability.

## Time behavior corrected during migration

Timer date inputs and reminder end dates now follow the Server/Local switch.
Changing the mode preserves the absolute selected instant. Survival windows in
the weekly guide also follow the selected mode; the previous detailed windows
were always formatted in local time. Game phase weekdays still identify the
server's event days, while actual window dates/times are converted.

Svelte owns component lifecycle cleanup. Async hero/research/event results are
scoped to their component, and page timers and subscriptions are cleaned up on
navigation.

## Native delivery follow-up

Android background notification scheduling and browser-to-native export/import
are separate future features. The current reminder service checks while the app
is open. Publishing will also require a final application identifier, signing
configuration and an actual Android device/emulator validation.

Use the Android commands and platform prerequisites in the root README. The
presence of a successful web build alone does not prove that an APK can be built.

## Validation on the migration branch

- Svelte/TypeScript check: zero errors and warnings.
- Nine module, translation, calculation, persistence and timezone tests passed.
- Five browser scenarios passed, covering all fourteen ready tools and mobile navigation.
- Dataset validator passed: 41 regular datasets, two research trees, 31 heroes.
- All 45 dataset/schema files were preserved byte for byte.
- Production Vite build passed, with bundled Lucide icons and lazy page chunks.
- Windows `cargo check` passed with Rust 1.95.0.
- The user confirmed that both the web version and the Windows desktop application run successfully on 2026-09-03.
- Production routes, profile data and artwork also passed under a `/dist/` subdirectory, matching the GitHub Pages path constraint.

Android APK compilation has not been verified: the available Windows SDK does
not contain the NDK, and only the Windows Rust target is currently installed.
The repository is prepared for `tauri android init` once those prerequisites
are installed. No deployment or push is part of this migration.
