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
- Dark-mode theme support with separate light/dark palettes, preview theme mode,
  independent generator-shell appearance, and Aegea-compatible dark CSS output.
- Generated `styles/main.css` and `theme-info.php` from one theme state model.
- Shell UI block adoption is complete: the generator shell now uses local Vue
  adapters over `hvab-blocks` CSS blocks, without a shell redesign.

Current prepared release: `0.8.0`.

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
- Dark palette / dark mode support, including built-in dark-capable Aegea
  preset palettes, prepared for the `0.8.0` release.

Historical setup notes live in `.project/SETUP-PLAN.md`.

## Completed dark-mode track (historical)

Dark palette / dark mode support is implemented and prepared for the `0.8.0`
release.

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
- [x] Update Random, locks, and contrast warnings for two palettes:
  - decide whether palette locks are per light/dark palette or shared before
    coding; prefer per-palette locks if the UI remains understandable;
  - make Random update the dark palette only when dark mode is enabled or when
    the active edited palette is dark;
  - show contrast warnings for the currently edited palette;
  - expected files/areas: `src/theme/random.js`, `src/theme/fieldLocks.js`,
    `src/theme/contrast.js`, `src/App.vue`, tests;
  - changed: `getRandomThemeState()` now generates a contrast-checked
    `darkPalette` and respects `fieldLocks.darkPalette`;
  - changed: the app applies randomized dark colors only when dark mode support
    is enabled;
  - changed: contrast warnings continue to follow the currently edited palette,
    using the existing active-palette warning path;
  - verification: targeted Random/locks/contrast tests, `npm test`,
    `npm run lint`, `npm run lint:styles`, `npm run format:check`, and
    `npm run build`;
  - manual check: pending in user browser because the in-app browser bridge
    blocked `http://localhost:5174/Selecta/` by URL policy during this slice.
- [x] Update sharing/import/export state contracts:
  - bump the theme serialization version if the JSON shape changes;
  - make URL share and JSON export include the dark palette and dark-mode flag;
  - keep UI language out of theme JSON, share URLs, ZIP output, and theme state;
  - expected files/areas: `src/theme/serialize.js`, `src/storage.js`,
    `src/App.vue`, serialization/storage tests;
  - changed: confirmed `THEME_SERIALIZATION_VERSION = 2` already covers the
    current dark-mode shape;
  - changed: added serialization tests for dark mode enabled, dark mode
    disabled, URL sharing, and excluding UI-only state from theme JSON;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, and `npm run build`.
- [x] Update project docs and release notes:
  - update `PREVIEW-BASELINE.md` only if the preview/export contract changes;
  - add an `Unreleased` note in `CHANGELOG.md`;
  - update this file after each completed implementation slice;
  - expected files/areas: `.project/PROGRESS.md`, `PREVIEW-BASELINE.md`,
    `CHANGELOG.md`;
  - changed: documented the dark-mode preview/export contract in
    `PREVIEW-BASELINE.md`;
  - changed: added an `Unreleased` changelog entry for dark-mode theme support;
  - verification: documentation matches the implemented behavior.
- [x] Simplify theme and interface mode controls:
  - replace separate palette and preview controls with one preview-side theme
    mode control;
  - keep `supportsDarkMode` as the exported Aegea capability flag, enabling it
    automatically when the user switches to dark theme mode;
  - move Selecta interface appearance into the app header and add
    system/light/dark choices;
  - keep interface appearance as UI state only, separate from generated themes;
  - changed: `themeMode` now drives both the edited palette and preview mode;
  - changed: `shellAppearance` now supports `system`, using
    `prefers-color-scheme` for the effective app chrome mode;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, and `npm run build`.
- [x] Verify Aegea built-in preset dark-mode support:
  - checked user-available Aegea themes `plain`, `acute`, `chancery`,
    `douglas`, `fiesta`, `gal`, `holm`, `kolomna`, `vox`, and `vulcano`;
  - dark-mode capable in Aegea: `plain`, `acute`, `fiesta`, and `gal`;
  - no dark-mode support in Aegea: `chancery`, `douglas`, `holm`, `kolomna`,
    `vox`, and `vulcano`;
  - changed: Selecta presets now store `supportsDarkMode` and dark palettes for
    the dark-capable built-ins;
  - changed: applying a dark-capable preset updates both light and dark palettes,
    so the right-side theme mode control previews the preset's dark colors;
  - changed: applying a preset without Aegea dark support disables dark theme
    mode and returns the preview to light mode;
  - expected files/areas: `src/theme/presets.js`, `src/theme/presets.test.js`,
    `src/App.vue`, `PREVIEW-BASELINE.md`, `CHANGELOG.md`;
  - verification: `npm test`, `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, and `npm run build`.
- [x] Final verification:
  - `npm test`;
  - `npm run lint`;
  - `npm run lint:styles`;
  - `npm run format:check`;
  - `npm run build`;
  - manual browser review accepted by the user for the final dark-mode concept
    and built-in preset behavior.

### Implementation notes

- The previous English/Russian localization track is reviewed, verified,
  released, and complete in `0.7.0`.
- Dark mode work is not just a preview toggle; it changes model, CSS
  generation, serialization, Random/locks, contrast warnings, and ZIP output.
- Selecta shell appearance is separate app UI state. It should protect the
  controls pane from becoming unreadable while previewing a dark theme, but it
  must not change exported theme files.
- Aegea activates dark variables through the `e2-responds-to-dark-mode` class and
  `prefers-color-scheme: dark`, not through a Selecta-specific selector.
- The dark preview can emulate the Aegea class locally, but exported CSS should
  use the real Aegea selector.
- `theme-info.php` `colors` should stay tied to the light palette unless current
  Aegea behavior proves otherwise.

## Historical dark-mode checklist

- [x] Implement the model and serialization slice for `darkPalette`.
- [x] Implement dark CSS generation and `theme-info.php` behavior.
- [x] Add UI controls for enabling and editing dark mode.
- [x] Add preview mode support.
- [x] Add generator-shell appearance mode.
- [x] Update Random, locks, and contrast warnings for two palettes.
- [x] Update sharing/import/export state contracts.
- [x] Update project docs and release notes.
- [x] Simplify theme and interface mode controls.
- [x] Verify Aegea built-in preset dark-mode support.
- [x] Run final verification.
- [ ] Keep author-credit placement and full-width layout as separate future work.

## Completed shell UI block-adoption track (historical)

Shell UI block adoption with `hvab-blocks` is the next planned track. Its goal
is to add the library from GitHub as a pinned npm dependency, add local Vue
adapter components around its documented CSS blocks, and move the existing
generator-shell controls onto that contract. This is not a visual-design track:
retain the current information architecture, control behaviour, responsive
layout, copy, and Aegea preview unchanged.

`hvab-blocks` is CSS-only. Selecta's `src/ui/` Vue components own the stable
component API, slots, attribute/event forwarding, accessibility wiring, and
class/modifier mapping. The application continues to own state, file import,
persistence, and responsive page layout.

### Blocks selected from the current shell audit

Required in this track:

- `field` for the existing label/control/addon/message rows in
  `ThemeControls.vue` and `PresetSelector.vue`;
- `text-input` for display and folder names;
- `select` for preset, font, language, shell-appearance, and theme-mode
  selectors;
- `range-input` for typography and layout sliders;
- `color-input` for palette colors;
- `checkbox` for the per-field Random locks;
- `switch` for the `supportsDarkMode` boolean;
- `button` for Random, Unlock all, Reset, copy-link, JSON import/export, and
  ZIP download actions.

The hidden JSON file input has no matching library block and remains a native
file input behind its visible trigger button. The drag pane resizer also stays
consumer-owned because `hvab-blocks` deliberately provides no layout or resize
primitive.

Explicitly out of scope until a requested design slice: `card`, `tabs`,
`dialog`, `toast`, `alert`, `link`, `text`, `label`, and all overlay/navigation
blocks. Status copy may keep its current semantic markup in this track; do not
introduce a toast or alert design implicitly. The Aegea preview uses its own
real markup/CSS contract and must not receive `hb-*` classes or tokens.

### Feature plan

- [x] Add the GitHub dependency and establish the integration entry point:
  - use the current immutable release tag:
    `"hvab-blocks": "github:hvab/hvab-blocks#0.1.0"`;
  - upgrade deliberately by changing this Git ref to a reviewed newer tag and
    updating the lockfile; do not depend on a moving branch;
  - consume selectively rather than importing `hvab-blocks/index.css`, so the
    shell loads only the required blocks and all token files they require;
  - expected files/areas: `package.json`, `package-lock.json`, a new local
    shell entry stylesheet, `src/main.js`;
  - changed: installed `hvab-blocks` from GitHub tag `0.1.0`; added
    `src/ui/hvab.css` with tokens first and the eight selected block styles
    second; imported it before Selecta's local shell stylesheet;
  - verification: `npm install github:hvab/hvab-blocks#0.1.0` resolved the
    pinned GitHub commit in `package-lock.json`; `npm run build` passed with all
    selected CSS exports loaded by Vite.
- [x] Create the local Selecta UI adapter layer before changing consumers:
  - [x] add `src/ui/Button/Button.vue` as a native button adapter with
        `view`, `size`, and `type` props; native attributes, events, and consumer
        classes fall through to its single root button;
  - [x] add `Field/Field.vue` with label, default control, addons, and message
        slots; `layout="inline"` and `messageView` map to the documented
        modifiers while validation semantics remain with the caller;
  - [x] add `TextInput/TextInput.vue` as a native input adapter with `type`
        and `size` props; value, input events, invalid/disabled states, and
        other native attributes fall through to the input;
  - [x] add `Select/Select.vue` as a native select adapter with a `size` prop;
        option and optgroup markup, values, change events, and native states
        remain with the caller;
  - [x] add `RangeInput/RangeInput.vue` with its documented wrapper/input
        structure; class/style stay on the wrapper, while range attributes and
        events are forwarded to the native input;
  - [x] add `ColorInput/ColorInput.vue` as a native color-input adapter with a
        `size` prop; color values, picker behavior, events, and native states
        remain with the caller;
  - [x] add `Checkbox/Checkbox.vue` with its documented label/input/box
        structure; visible content is an optional default slot, and native
        checkbox attributes/events are forwarded to the input;
  - [x] add `Switch/Switch.vue` with the documented label/input/track
        structure; the checkbox remains the state and accessibility host;
  - each component renders the documented native host and `hb-*` class names;
    it exposes only the props/slots needed by Selecta and forwards native
    attributes and events without reimplementing library CSS;
  - keep field label, control, addon, and message composition as slots so
    validation/warning semantics remain at the caller;
  - expected files/areas: `src/ui/**`, new shell integration stylesheet;
  - verification: component markup follows the corresponding current
    `hvab-blocks` README and no wrapper creates custom popup behaviour;
    completed Button, Field, TextInput, Select, RangeInput, ColorInput, Checkbox, and Switch adapters pass `npm run lint`,
    `npm run lint:styles`, and `npm run format:check`.
- [x] Establish the Selecta-to-hvab token bridge without selecting a new visual
      design:
  - [x] import `ref`, `color`, `typography`, `radius`, `spacing`, `motion`, `size`,
        and `focus` before block CSS, in the documented order;
  - [x] import only `field`, `text-input`, `select`, `range-input`, `color-input`,
        `checkbox`, `switch`, and `button` CSS;
  - [x] bind the effective existing shell appearance to
        `data-color-scheme="light|dark"` alongside its current state attribute;
        changed: the `.app` root now receives both attributes, so all future
        `hb-*` descendants inherit the matching library color scheme;
  - [x] keep the library's public `--hb-*` token values unchanged after the
        import; do not override block selectors, private `--_*` tokens, or use
        `!important`;
        changed: removed the temporary Selecta token mapping so the shell uses
        the library's own light/dark visual contract until a design slice calls
        for deliberate overrides;
        changed: removed the legacy `--shell-*` aliases and changed the
        remaining shell composition/status rules to read the matching public
        library tokens directly;
  - expected files/areas: new shell integration stylesheet, `src/main.js`,
    `src/App.vue`, `src/style.css` only where old control styling becomes dead;
  - verification: `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, and `npm run build` pass; browser verification
    confirms the restored library default
    `--hb-color-base-generic: rgb(0 0 0 / 5%)` in the light scheme.
- [x] Replace the theme-editor form controls with the selected documented
      blocks:
  - convert each row to `hb-field`, using `hb-field_layout_inline` where the
    current three-column arrangement applies;
  - map metadata errors to `aria-invalid="true"` plus
    `hb-field__message_view_error`, and contrast warnings to
    `hb-field__message_view_warning`, preserving `aria-describedby`;
  - put control classes on the documented native host/wrapper for text, select,
    range, and color controls;
  - preserve all event handling, numeric conversions, font `optgroup`s, locks,
    and localization;
  - expected files/areas: `src/components/ThemeControls.vue`,
    `src/components/PresetSelector.vue`, shell CSS;
  - changed: migrated preset, metadata, font, slider, palette, warning, and
    Random-lock markup to Field plus the matching native adapter; retained the
    prior ids, event handlers, values, option groups, `aria-invalid`, and
    `aria-describedby` relationships;
  - verification: browser DOM check exposes native textboxes, sliders, color
    controls, checkboxes, and the dark-mode switch with their previous labels.
- [x] Replace shell-header, preview-toolbar, and export action controls:
  - apply `hb-select` to language, shell-appearance, and theme-mode controls;
  - use `hb-switch` for dark-mode support and `hb-checkbox` for field locks
    with visible/accessible labels following the block contract;
  - assign button priority only from the existing action hierarchy; no new
    labels, icons, grouping, or layout are part of this step;
  - preserve native `disabled` attributes, hidden JSON file input flow, live
    status text, and pane-resizer keyboard/pointer behaviour;
  - expected files/areas: `src/App.vue`, `src/components/ThemeControls.vue`,
    shell CSS;
  - changed: migrated interface appearance, language, and theme-mode selectors
    to Select; migrated export actions to Button with outlined secondary actions
    and the existing ZIP download as the sole action button; preserved the
    hidden JSON file input and all current handlers/disabled conditions;
  - verification: browser DOM check exposes the same named controls and keeps
    `Unlock all` disabled when no locks are active.
- [x] Remove superseded local control chrome and document the adopted contract:
  - delete only CSS declarations replaced by the imported blocks; retain
    Selecta-owned composition, spacing, pane sizing, mobile layout, and status
    placement;
  - record the installed `hvab-blocks` source/version and selected block list
    here, including any public token overrides;
  - expected files/areas: `src/style.css`, `.project/PROGRESS.md`;
  - changed: removed the superseded local control, lock, error, and button
    chrome; retained Selecta-owned shell layout, status-message placement,
    pane sizing, and mobile composition;
  - verification: `npm run lint`, `npm run lint:styles`,
    `npm run format:check`, and `npm run build` pass; browser inspection
    confirms all adopted block hosts and the restored system scheme. No Aegea
    preview or export behavior changed.

## Next steps

- [ ] Select a separate shell-design slice before changing visual composition,
      spacing, copy, or component priorities beyond the adopted block defaults.

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
