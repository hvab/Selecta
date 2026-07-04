# Progress

This file is the working context, active feature plan, progress summary, and
next-step checklist for continuing Selecta with an AI assistant. Keep it current
after every implementation slice. `SPEC.md` remains the product source of truth.

## Current state

Selecta is a Vite + Vue + JavaScript app for generating Aegea child themes
based on `plain`.

The app currently has:

- Aegea-based preview surface with fixed demo content.
- Editable metadata, color, typography, and layout controls.
- Metadata validation and guarded ZIP download.
- Non-blocking contrast warnings.
- Field locks for Random.
- Session restore in localStorage and Reset.
- Aegea theme presets.
- URL state and JSON export/import.
- Google Fonts support through the CSS API with a curated Cyrillic catalog.
- English/Russian app UI and localized preview content; the selected language is
  stored separately from theme/session state.
- Generated `styles/main.css` and `theme-info.php` from one theme state model.

Current prepared release: `0.7.0`.

## Source of truth

- `SPEC.md` — product specification and future-feature backlog.
- `UI-ARCHITECTURE.md` — preview layer vs generator shell boundaries.
- `PREVIEW-BASELINE.md` — Aegea preview baseline and maintenance notes.
- `CHANGELOG.md` — public release history.
- `AGENTS.md` — repository-specific agent rules.
- `AGENTS.local.md` — local Aegea paths; keep machine-local paths there only.

If preview markup, theme inheritance, or CSS variables are in question, inspect
the current Aegea checkout before changing preview or export behavior.

## Important decisions

- Use Vite, Vue, and plain JavaScript.
- Do not add TypeScript or a backend.
- Generate only child themes based on `plain`.
- Export a ZIP archive with the theme folder inside it.
- User-facing app UI supports English and Russian; the selected language is an
  app preference, not theme/export/share state.
- Preview should stay close to real Aegea markup and CSS-variable contracts.
- Generator-shell styles stay separate from preview/theme styles.
- Google Fonts load through Google Fonts CSS API; font files are not bundled.
- Google Fonts catalog is a curated Cyrillic metadata snapshot.
- Font picker uses a flat select with category groups; no separate `Google Fonts`
  group and no Cyrillic-only toggle.
- Code font is still controlled by Aegea `plain`; Selecta edits interface and
  note text font slots.

## Completed tracks

- Project scaffold and tooling.
- Initial serializable theme state.
- CSS and `theme-info.php` generation outside the UI layer.
- Aegea preview baseline and expanded preview states.
- Main theme controls.
- Theme metadata fields and validation.
- Client-side ZIP export.
- Manual install verification in a live Aegea blog.
- MVP polish and browser QA.
- Random button.
- Aegea 11.5 target audit.
- Contrast warnings and field locks.
- Session restore and Reset.
- Aegea theme presets.
- URL state and JSON export/import.
- Google Fonts, including curated Cyrillic catalog cleanup.
- English/Russian localization, including the language switcher, review fixes,
  verification, and the `0.7.0` release.

Historical setup notes live in `.project/SETUP-PLAN.md`.

## Active track

Dark palette / dark mode support is planned.

This slice should let the user enable Aegea dark mode support, edit light and
dark palettes separately, preview both modes in Selecta, and export a child
theme that follows Aegea's real dark-mode contract.
The Selecta generator shell should also have its own light/dark appearance
mode, separate from the generated theme palettes and preview mode, so the
controls pane remains comfortable while editing either palette.

### Feature plan

- [x] Audit current Aegea dark contract:
  - checked current Aegea checkout at commit `deb13007`;
  - `system/themes/plain/theme-info.php` has `supports_dark_mode` set to `true`;
  - `system/themes/plain/src/styles/variables.scss` defines light values in
    `:root` and dark values in
    `@media (prefers-color-scheme: dark) { :root .e2-responds-to-dark-mode { ... } }`;
  - `system/theme/templates/main.tmpl.php` adds `e2-responds-to-dark-mode` to
    `<body>` only when the current theme supports dark mode and the blog setting
    `respond_to_dark_mode` is enabled;
  - `system/theme/templates/form-preferences.tmpl.php` shows the Aegea
    "Support Dark Mode" switch only for themes that support it;
  - `system/theme/templates/note.tmpl.php` uses `use_likely_light` for sharing
    widgets; Selecta does not preview sharing widgets yet, so keep generating
    this metadata but do not block the dark palette slice on it;
  - current Selecta preview uses `.aegea-preview` with inline light variables
    and has no dark-mode preview class or preview-mode state;
  - expected files/areas: `.project/PROGRESS.md` only;
  - verification: read-only source audit; no app behavior changed.
- [x] Extend the theme model for a separate dark palette:
  - keep the existing `palette` section as the light palette for minimal diff;
  - add a parallel `darkPalette` section with the same user-editable color keys;
  - keep `meta.supportsDarkMode` as the exported Aegea capability flag;
  - use Aegea `plain` dark values as the initial dark palette;
  - expected files/areas: `src/theme/model.js`, `src/theme/serialize.js`,
    `src/storage.js`, `src/theme/fieldLocks.js`, focused theme tests;
  - changed: added `darkPalette` to the initial theme state, field locks, theme
    JSON serialization, URL sharing payloads, and session validation;
  - changed: bumped theme JSON serialization and session storage versions to `2`;
  - verification: targeted model/serialization/storage/CSS/theme-info tests,
    `npm test`, and `npm run build`.
- [x] Generate dark CSS and dark-capable theme metadata:
  - refactor color-variable derivation so the same helper can produce variables
    from either `palette` or `darkPalette`;
  - keep base `:root` output for light values;
  - when `meta.supportsDarkMode` is true, add the Aegea-compatible
    `@media (prefers-color-scheme: dark) { :root .e2-responds-to-dark-mode { ... } }`
    block;
  - keep `theme-info.php` `colors` based on the light palette because Aegea uses
    it for theme-list preview swatches;
  - expected files/areas: `src/theme/css.js`, `src/theme/themeInfo.js`,
    `src/theme/zip.js`, CSS/theme-info tests;
  - changed: `generateThemeCss()` now emits the Aegea-compatible dark media
    block only when `meta.supportsDarkMode` is true;
  - changed: `theme-info.php` keeps theme-list `colors` tied to the light
    palette and reflects `supports_dark_mode` from theme state;
  - verification: targeted CSS/theme-info/ZIP tests, `npm test`, and
    `npm run build`.
- [x] Add UI controls for enabling and editing dark mode:
  - add a native checkbox/toggle for "supports dark mode";
  - add a compact mode control for editing the light or dark palette;
  - reuse the existing color controls for whichever palette is active;
  - keep typography, layout, metadata, presets, and language controls outside the
    theme palette mode;
  - expected files/areas: `src/components/ThemeControls.vue`, `src/App.vue`,
    locale files, shell CSS only if needed;
  - changed: added localized controls for `supportsDarkMode` and the edited
    light/dark palette;
  - changed: palette color controls and palette locks now target the active
    light or dark palette;
  - changed: active edited palette is persisted as UI state only;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, `npm run build`, and browser check at
    `http://localhost:5174/Selecta/`.
- [x] Add preview mode support:
  - add a preview mode state for light/dark preview independent from the app UI
    language;
  - emulate Aegea's dark class in preview while keeping exported CSS selector
    faithful to Aegea;
  - ensure preview mode is app UI state, not exported theme metadata;
  - expected files/areas: `src/App.vue`, `src/preview/AegeaPreview.vue`,
    `src/preview/style.css`, `src/storage.js`;
  - changed: added a separate light/dark preview mode persisted as UI state
    only;
  - changed: `AegeaPreview` can render variables from `darkPalette` while the
    exported CSS selector stays tied to the real Aegea contract;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, `npm run build`, and browser check at
    `http://localhost:5174/Selecta/`.
- [x] Add generator-shell appearance mode:
  - add a separate Selecta UI appearance state for the controls pane and app
    chrome;
  - do not derive shell colors from the generated theme palette;
  - keep shell appearance independent from the light/dark palette being edited
    and from the preview mode;
  - persist it as app UI state only, not in theme JSON, share URLs, ZIP output,
    or exported Aegea theme metadata;
  - expected files/areas: `src/App.vue`, `src/style.css`, `src/storage.js`,
    locale files if the control needs new labels;
  - changed: added a localized light/dark interface appearance control for
    Selecta shell chrome;
  - changed: shell appearance is saved in session UI state and kept out of theme
    JSON, share URLs, ZIP output, and Aegea theme metadata;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, `npm run build`, and browser check at
    `http://localhost:5174/Selecta/`.
- [ ] Update Random, locks, and contrast warnings for two palettes:
  - decide whether palette locks are per light/dark palette or shared before
    coding; prefer per-palette locks if the UI remains understandable;
  - make Random update the dark palette only when dark mode is enabled or when
    the active edited palette is dark;
  - show contrast warnings for the currently edited palette;
  - expected files/areas: `src/theme/random.js`, `src/theme/fieldLocks.js`,
    `src/theme/contrast.js`, `src/App.vue`, tests;
  - verification: targeted Random/locks/contrast tests and manual spot check.
- [ ] Update sharing/import/export state contracts:
  - bump the theme serialization version if the JSON shape changes;
  - make URL share and JSON export include the dark palette and dark-mode flag;
  - keep UI language out of theme JSON, share URLs, ZIP output, and theme state;
  - expected files/areas: `src/theme/serialize.js`, `src/storage.js`,
    `src/App.vue`, serialization/storage tests;
  - verification: exported JSON round-trips with dark mode enabled and disabled.
- [ ] Update project docs and release notes:
  - update `PREVIEW-BASELINE.md` only if the preview/export contract changes;
  - add an `Unreleased` note in `CHANGELOG.md`;
  - update this file after each completed implementation slice;
  - expected files/areas: `.project/PROGRESS.md`, `PREVIEW-BASELINE.md`,
    `CHANGELOG.md`;
  - verification: documentation matches the implemented behavior.
- [ ] Final verification:
  - `npm test`;
  - `npm run lint`;
  - `npm run lint:styles`;
  - `npm run format:check`;
  - `npm run build`;
  - manual browser check for light preview, dark preview, disabled dark export,
    enabled dark export, Reset, Random, JSON import/export, URL share, and ZIP
    contents.

### Implementation notes

- The previous English/Russian localization track is reviewed, verified,
  released, and complete in `0.7.0`.
- Current Selecta has only one exported palette. Dark mode work must not be
  treated as just a preview toggle; it changes model, CSS generation,
  serialization, Random/locks, contrast warnings, and ZIP output.
- Selecta shell appearance is separate app UI state. It should protect the
  controls pane from becoming unreadable while previewing a dark theme, but it
  must not change exported theme files.
- Aegea activates dark variables through the `e2-responds-to-dark-mode` class and
  `prefers-color-scheme: dark`, not through a Selecta-specific selector.
- The dark preview can emulate the Aegea class locally, but exported CSS should
  use the real Aegea selector.
- `theme-info.php` `colors` should stay tied to the light palette unless current
  Aegea behavior proves otherwise.
- `npm audit` reports 3 high severity warnings through
  `vite` / `@vitejs/plugin-vue` / `esbuild`; the suggested
  `npm audit fix --force` upgrades to Vite 8 and is a breaking dependency
  change, so it is left as a separate decision.

## Next steps

- [x] Implement the model and serialization slice for `darkPalette`.
- [x] Implement dark CSS generation and `theme-info.php` behavior.
- [x] Add UI controls for enabling and editing dark mode.
- [x] Add preview mode support.
- [x] Add generator-shell appearance mode.
- [ ] Update Random, locks, and contrast warnings for two palettes.
- [ ] Keep author-credit placement, full-width layout, `vue-i18n` optimization,
      and Vite/esbuild audit decisions as separate future work.
- [ ] Update this file after the chosen slice has a concrete next checklist.

## Ideas and backlog

Use `.project/IDEAS.md` for raw feature ideas and parked future work. Move only
the selected next slice from `IDEAS.md` into `Active track` / `Next steps`.

## Verification

Common checks:

```bash
npm test
npm run lint
npm run lint:styles
npm run format:check
npm run build
```

Use targeted checks for small documentation-only changes.

For preview and export-contract changes, prefer a concise manual verification
path in a real local Aegea instance.

## Notes for next AI

- Read `AGENTS.md` and `AGENTS.local.md` before implementation work.
- Read `SPEC.md` before changing product behavior.
- Do not revive old Google Fonts search/filter UI ideas. The current direction
  is a flat select with direct category groups.
- Do not store language in theme JSON, share URLs, or ZIP output.
- Do not stage, commit, switch branches, or push unless the user explicitly asks.
- Keep diffs scoped; avoid reformatting unrelated files.
