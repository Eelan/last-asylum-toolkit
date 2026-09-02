# CSS organization

Stylesheets are loaded explicitly by `index.html`. No bundler or build step is required.

## Load order

1. `tokens.css`: shared defaults (colors, surfaces, radii, shadows) and the fallback palette.
2. `themes.css`: section-specific custom properties, selected by `body[data-section]`.
3. `base.css`: document defaults, typography and shared animations.
4. `layout.css`: application shell, sidebar, topbar, section navigation and mobile controls.
5. `components.css`: reusable panels, page headings, forms, buttons and tables.
6. `pages/*.css`: styles specific to a page or closely related pages.

`pages/duel.css` also covers the weekly survival guide. `pages/heroes.css` covers the catalogue, profiles and personal hero tracker. The research experience overrides are kept at the end of `pages/researches.css` to preserve their precedence.

## Editing styles

- Keep responsive rules in the same file as the component or page they affect.
- Keep rule order intact when changing an existing override: repeated selectors and media queries were deliberately retained during the initial split.
- Themes only define custom properties; components must not branch on the active section.
- Use the section accent for decorative emphasis. Status and game-specific colors are separate concerns; do not replace them as part of a theme change.
- Image URLs in page stylesheets are relative to `pages/`, for example `../../images/heroes/frames/bg-ssr.webp`.
- Add a new stylesheet to `index.html` when introducing a new page-specific file.

This split does not redesign components or remove legacy overrides. Such cleanup should be verified separately.
