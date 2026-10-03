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

## Validation slice on the previous published base

Scope: keep imported and restored themes based on `plain`, and reject non-finite
numeric model values. The published shell still supports `system`; preserve its
existing session behavior and optional UI fields. Do not add numeric ranges,
CSS grammar, payload limits, migrations, or UI changes.

- [x] Reproduce unsupported parent and overflowing JSON numbers on the published
      base; add regressions in `src/theme/serialize.test.js` and
      `src/storage.test.js`, covering JSON, File, URL, and session restore.
      Verification: targeted Node tests reproduced seven failing regressions on
      the unchanged base; existing tests and positive compatibility cases passed.
      Next: implement the shared boundary check. No CSS grammar was tested.
- [x] Share field-value checks between `src/theme/serialize.js` and
      `src/storage.js` through `src/theme/validation.js`; preserve font normalization
      and known-field copying. Verification: all 28 targeted tests passed, including
      the new regressions, all ten built-in presets, finite values outside UI ranges,
      and the existing `system` session test. No UI or persistence timing changed.
      Next: run the complete local quality gate and inspect generated ZIP contents.
- [x] Run `npm test`, `npm run lint`, `npm run lint:styles`,
      `npm run format:check`, and `npm run build`; inspect the diff.
      Verification: 108 tests, JS lint, style lint, build, changed-file Prettier,
      and `git diff --check` passed on local Node 24 after a clean lockfile install.
      Full `format:check` still fails on the two unchanged audit prompt files in
      the published base; leave these outside this slice. Verified ten preset ZIPs
      after JSON/URL round-trips and unknown Google font fallback. Chrome rejects
      unsupported-parent and `1e999` URLs without applying their state; EN/RU
      feedback remains available. File decoding is covered with synthetic Blob
      tests; browser file picker, PHP/live Aegea, and Linux/Node 22 are unverified.
      Generators still consume trusted in-memory state; no direct-generator guards
      or CSS-string validation were added. Next: review the draft PR and CI;
      resolve baseline formatting independently before merging.

### Quality-gate prerequisite follow-up

- [x] Cherry-pick the verified R02 prerequisite `c29c7e3` as `d6691a5`,
      preserving both independent progress sections. Dependency: PR #1.
- [x] Verify all five local checks: 108 tests, JS/style lint, full formatting,
      and build pass. Next: verify the complete Ubuntu/Node 22 CI on the updated
      PR #2 head, then review the draft without merging.

The formatting failure above describes the first R01 check before R02.
Only the prerequisite prompt formatting and this progress update extend R01;
its runtime code and validation scope remain unchanged.

## Active R01 synchronization with the new UI base

Base: `origin/main` at `8662ce5`. Its documented UI contract requires a concrete
`light`/`dark` shell appearance and ignores old `system`/missing values. Preserve
that policy; theme JSON/URL still excludes shell state and keeps `basedOn=plain`.
The preceding validation notes describe verification before the UI merge.

- [x] Merge current main normally, retaining the new UI and both independent
      progress sections. Inspect `storage.js`, App restore/import handlers,
      the theme model, and SPEC; theme-field contracts are unchanged.
- [x] Adapt only R01 session regression fixtures to valid light/dark UI state;
      prove invalid parent/overflow rejection and valid restored finite values.
      Areas: `src/storage.test.js`. Verification: all 23 selected R01 tests pass.
      The seven rejection regressions fail again against the unmodified new base;
      positive restore checks accept both current shell modes and finite values
      outside UI slider ranges. No session migration or runtime policy changed.
- [x] Run the five quality commands and verify browser URL rejection in the
      new UI: build passes; 108/109 tests pass, with only the base's stale `system`
      fixture failing; JS/style lint and full formatting expose the known base
      failures. Chrome still rejects unsupported-parent and overflow URLs,
      preserves the theme, and provides EN/RU error feedback in the new shell.
      A new local clean install is blocked by npm's Git-package restriction;
      local checks use a copy of the already installed project dependencies.
- [ ] Incorporate the verified new quality prerequisite, keeping both progress
      sections and all main UI changes. Push normally and verify full CI on the
      exact final head; the previous green run is historical evidence only.

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

## Active track: global action hierarchy and header layout (planned)

Status: the first header-layout slice is implemented and awaiting manual browser
review. This track changes only the generator shell, not the Aegea preview
markup or exported-theme contract.

### Agreed interaction model

- Replace the separate shell header and preview toolbar with one global top bar.
  Its desktop order is: localized Selecta name and short generator context,
  `Theme` light/dark toggle, `Interface` light/dark toggle, `RU / EN`, `Share`
  menu, and the primary `Download ZIP` action at the right edge.
- `Theme` clearly means the edited palette and Aegea preview mode. Selecting
  dark continues to enable Aegea dark-mode support as it does now; it is not a
  cosmetic-only preview control.
- `Interface` is a separate two-position segmented control with sun/moon
  icons. Remove the visible and persisted `system` choice: on first visit,
  resolve the OS preference to `light` or `dark`, then store only that concrete
  value. Old sessions with a `system` value are incompatible and ignored.
- Use a compact textual `RU / EN` language switcher, not flags or a select.
- `Share` contains only outward actions: copy the theme link and download the
  theme JSON. Keep JSON import out of this menu because it replaces the current
  work state; place `Import theme` beside the preset selector at the top of the
  controls pane.
- Keep `Randomize` and `Reset` as two prominent actions in the first row above
  all controls in the left pane. `Download ZIP` remains the only global primary
  action; `Reset` stays visually quieter and requires a deliberate confirmation
  if it discards unsaved work.
- Remove the whole-theme `Unlock all` action. Each editable-card header gains a
  group lock that locks or unlocks all fields in that card. Its mixed state must
  be represented accessibly and visually; per-field locks remain available.
- At narrow widths, keep the Selecta name and ZIP action on the first header
  row; place the remaining toolbar controls on a second horizontally scrollable
  row. Do not hide ZIP in an overflow menu.

### Implementation plan

- [x] Audit the current component split and the existing i18n keys
      before choosing the exact component boundaries; expected areas:
      `src/components/App/`, `src/components/ThemeControls/`, `src/ui/`, and
      `src/i18n/`.
  - changed: confirmed the completed component split keeps App responsible for
    global actions and shell composition, while ThemeControls and AegeaPreview
    remain separate; the header slice does not overlap the CSS refactor.
- [x] Build the global responsive header and move existing global controls into
      it without changing their theme/export semantics; expected areas:
      `src/components/App/` and shell-only styles.
  - changed: moved the Selecta identity, current theme-mode select, current
    interface-appearance select, language select, and existing ZIP action into
    one app-wide header; removed the duplicate preview toolbar; kept the
    remaining actions and all handlers unchanged in the left pane.
  - changed: narrow screens keep the brand and ZIP action in the first header
    row, with the remaining existing controls in a horizontally scrollable
    second row.
  - verification: pending manual browser review of desktop and narrow layouts.
- [x] Replace persisted `system` shell appearance with initial OS-preference
      resolution to a concrete light/dark value; expected areas:
      `src/components/App/` and `src/storage.js`.
  - changed: interface appearance now starts as a concrete OS-derived light or
    dark value, exposes only those two choices, and no longer follows later OS
    changes.
  - changed: `system` and missing shell-appearance values are invalid session
    data, so their old sessions are ignored instead of migrated.
  - verification: pending manual browser review of first visit and explicit
    light/dark selection.
- [x] Add distinct, labelled two-option controls for theme palette/preview mode
      and interface appearance; retain the current dark-palette/export contract.
      Expected areas: App component, UI controls, and shell styles.
  - changed: both controls show explicit localized group labels, while their
    light/dark native-radio options use sun/moon icons with accessible labels.
  - changed: theme mode and interface appearance now use separate toggle groups;
    selecting dark theme still enables the generated theme's dark-mode support,
    while the interface toggle changes only shell appearance.
  - verification: pending manual browser review of appearance, keyboard radio
    navigation, and independent theme/interface state changes.
- [x] Relocate Randomize, Reset, preset selection, and JSON import according to
      the agreed hierarchy; make Reset confirmation behaviour explicit before
      implementation. Expected areas: App, preset component, i18n, and shell
      styles.
  - changed: Randomize and Reset are now large first-row actions in the controls
    pane; JSON import is in the preset card, with its file input and status copy
    kept beside that action.
  - changed: Reset uses a native localized confirmation before it replaces the
    current theme, clears locks, and resets session state.
  - verification: pending manual browser review of action placement, reset
    confirmation, and successful JSON import from the preset card.
- [x] Replace the global unlock action with card-level group locks, including an
      accessible mixed state; expected areas: ThemeControls, lock controls,
      i18n, and shell UI.
  - changed: removed the whole-theme unlock action and added header locks for
    metadata, fonts, typography, layout, and the currently edited palette.
  - changed: a partially locked card displays an indeterminate state; activating
    it locks all fields in that card, while activating a fully locked card
    unlocks all of its fields. The dark-mode capability switch remains outside
    locks because Random does not change it.
  - verification: pending manual browser review of per-card scope, mixed state,
    and Random respecting the resulting locks.
- [x] Consolidate copy-link and JSON-export actions into the `Share` menu while
      retaining status feedback and the existing hidden file-input flow. Expected
      areas: App, i18n, and shell styles.
  - changed: moved Copy link and Export JSON into a native Share menu in the
    global header; kept JSON import beside presets, where it replaces the
    current work state rather than sharing it.
  - changed: copy-link success/error feedback appears inside the open menu;
    ZIP remains the sole primary action, with metadata validation feedback next
    to it.
  - verification: pending manual browser review of the menu, copy feedback,
    JSON export, and narrow-layout placement.

## Active track: `hvab-blocks` 0.2.0 radio-group migration (planned)

Status: the global action-hierarchy work is ready for browser review. The
radio-group migration is implemented and must not change preview, export, or
locale-storage contracts.

### Implementation plan

- [x] Upgrade `hvab-blocks` from the pinned `0.1.0` tag to `0.2.0`, refresh the
      lockfile, and inspect the release's documented radio-group CSS/markup
      contract. Changed: installed the published `v0.2.0` tag (commit
      `b9c78a6bdccbc6d511032381b04c9b5143cc3719`) and selectively imported
      `radio-group.css`; verified package and lockfile resolve to `0.2.0`, and
      the upstream block uses native radio inputs in `hb-radio-group` /
      `hb-radio-group__option` / `hb-radio-group__content`. Manual check: the
      existing shell still loads unchanged after this dependency-only slice.
- [x] Add one local Vue adapter for the upstream radio-group block and replace
      the light/dark Theme and Interface `ModeToggle` instances without changing
      their current state or side effects. Changed: added `RadioGroup`, which
      renders the upstream native radio markup and accepts option labels/icons;
      both header mode controls now use it with their existing state handlers;
      deletion of `ModeToggle` was deferred to the final migration step. Manual
      check: each group keeps independent state and native keyboard radio
      navigation.
- [x] Replace the language select with the same radio-group adapter using the
      compact `RU` and `EN` labels. Changed: locale persistence and document
      metadata keep their existing handlers; only the native select host was
      replaced. Manual check: changing language updates the UI and survives
      reload.
- [x] Remove the superseded local `ModeToggle` and record the final
      `hvab-blocks` version/selected block in this file. Changed: removed the
      unused local component; the shell now consumes `radio-group.css` from
      `hvab-blocks` `v0.2.0` alongside the existing selected blocks.

## Planned track: headless overlay behavior for Share and Reset

Status: Share and Reset now use the selected headless primitives. This track
must not change theme state, sharing/export behavior, or the generator-shell
visual language.

### Chosen composition

- Add `reka-ui` as the single Vue headless dependency after checking its current
  release and lockfile result. It supplies the required accessible primitives in
  one package: `DropdownMenu` for Share and `Dialog` for Reset
  confirmation. Do not add Headless UI or Floating UI alongside it.
- Keep all visible styling in `hvab-blocks`: import `popover.css` for the Share
  panel and `modal.css` for Reset. `reka-ui` owns only portal,
  anchoring, collisions, dismissal, keyboard handling, focus return/trap, and
  inert background behavior.
- Use a dropdown menu, not a generic popover, for Share because its contents
  are command items. Use a dialog for Reset: it retains the explicit confirm
  action but also supports dismissal by clicking outside the panel.
- Keep portal overlays in one shell layer contract: the top bar stays in normal
  document stacking, the Reka floating-content wrapper uses the floating layer,
  and the modal veil uses the higher modal layer. Do not set a local stacking
  value only on the menu surface.
- Preserve the existing local `Button` component, localized copy, and action
  handlers. The reset action must be split into opening the confirmation and a
  separate confirmed reset handler; `window.confirm` must disappear.

### Implementation plan

- [x] Dependency and contract slice: install one reviewed `reka-ui` release,
      refresh the lockfile, and selectively import the needed `hvab-blocks`
      overlay styles. Changed: installed `reka-ui` `2.10.1` and imported
      `popover.css`, `modal.css`, and `dialog.css`; verified its menu and
      dialog triggers support `as-child`, and both content hosts use Portal.
      Manual check: existing controls and header remain unchanged.
- [x] Add compact local Vue adapters over the specific Reka primitives rather
      than exposing library markup throughout the app: one for dropdown action
      menus and one for dialogs. Changed: added `ActionMenu` with local
      action data and a trigger slot, plus controlled `ConfirmDialog` with
      trigger, Cancel, and confirm-action slots; both use `as-child` with the
      existing root-button adapter and apply only `hb-*` visual classes. Manual
      check: mounted examples receive `data-state` and can be themed only by
      `hb-*` classes.
  - changed: the Share panel uses a namespaced unscoped selector because its
    DOM is teleported outside the component; keep ordinary local component DOM
    styles scoped, and reserve unscoped selectors for portal hosts only.
- [x] Migrate Share alone: replace native `details` with the dropdown adapter,
      portal the content, apply `hb-popover`, and keep Copy link / Export JSON
      actions and their status feedback. Changed: selected actions close the
      menu through Reka while success/error feedback remains next to the Share
      trigger. Manual check: Enter/Space/Arrow keys, Escape, click outside,
      focus return, collision near viewport edges, and closing after either
      action.
- [x] Migrate Reset alone: replace `window.confirm` with a dialog styled by
      `hb-modal`; add a localized question, Cancel, and destructive Confirm
      labels. Changed: Reset now opens controlled `ConfirmDialog`; Cancel,
      Escape, and clicks outside the panel leave current work untouched, while
      confirm calls the unchanged reset handler after the dialog closes. Manual
      check: focus stays trapped while open and returns to Reset.
- [x] Correct the overlay stacking and minimal-dialog composition after browser
      review. Changed: removed the top bar stacking context; the actual Reka
      floating-content wrapper now uses the shared floating layer, while the
      reset veil uses the higher modal layer. Reset retains a single question
      and actions without dialog header or dividers, but restores the standard
      480px panel width and 24px/32px spacing. The question and all action-track
      status messages use explicit `hb-text` typography roles.
  - changed: interface colour scheme is applied to the document root, so Reka
    portal content inherits the same dark/light `hvab-blocks` tokens as the
    generator shell.
- [x] Restore `hb-dialog` composition for Reset. Changed: the panel now uses
      the library's `hb-dialog`, `__body`, and `__footer` elements without a
      header or dividers. Reka `Dialog` replaces `AlertDialog` so clicking the
      overlay closes the modal without resetting the theme.
- [ ] Review desktop, narrow layout, light/dark shell appearance, and reduced
      viewport height; then remove only the superseded native-menu/confirmation
      CSS and record the installed `reka-ui` version and final block list here.
  - code-review changed: Share success uses a polite live region and its error
    uses an alert role.

## Next steps

- [ ] Browser-review the three header radio groups: independent Theme and
      Interface state, `RU` / `EN` switching and persistence, keyboard radio
      navigation, and the narrow top-bar layout.
- [ ] Browser-review Share and Reset overlays on desktop and narrow screens;
      then remove only superseded native-menu and confirmation remnants.

## Planned track: feedback surfaces and action status

Status: planned after visual review found that action outcomes are rendered as
detached text nodes and can change the header layout. This track affects only
generator-shell feedback presentation, not theme state, import/export data, or
the Aegea preview.

### Audit result

- Metadata validation and contrast warnings already use the local `Field`
  adapter with `hb-field__message` and error/warning views; retain that pattern.
- JSON import success/error, Share success/error, and the disabled ZIP reason
  are standalone `App` paragraphs styled by local color classes. They are the
  remaining feedback hardcodes.
- `hvab-blocks` provides the right visual primitives: `field` for feedback
  belonging to a control, `tooltip` for a short anchored outcome, and `alert`
  only for a persistent standalone notification. Reka UI already supplies the
  required tooltip portal, position, and dismissal behavior.

### Implementation plan

- [x] Add one local controlled tooltip adapter over Reka `Tooltip`, styled by
      `hb-tooltip` and an optional arrow; import `tooltip.css`. Its portal CSS
      must follow the existing overlay-layer contract, and it must support a
      short programmatic open interval without changing layout.
  - expected areas: `src/ui/`, `src/ui/hvab.css`, and shell overlay styles.
  - changed: added `FeedbackTooltip` with an explicit controlled `open` value,
    immediate trigger response, bottom placement by default, its own Reka
    provider, and the tooltip block's CSS arrow.
  - manual check: collision at header edges, keyboard focus, Escape, and
    automatic close without a stale timer reopening it.
- [x] Move JSON import feedback into `PresetSelector`: pass the translated
      error from App and render it as the Import button's `Field` message with
      the `error` view. Do not keep a detached App paragraph. Successful import
      needs no extra banner because the selected values visibly update.
  - expected areas: `src/components/App/` and `src/components/PresetSelector/`.
  - changed: invalid JSON now appears as the Import JSON field message and is
    linked to that button through `aria-describedby`; the unused import-success
    copy and local import-status styles are removed.
  - manual check: invalid JSON is adjacent to Import JSON, has field error
    styling, and a successful import clears it.
- [x] Replace Share's layout-affecting status paragraphs with a controlled
      feedback tooltip anchored to the Share button. Copy success opens it
      briefly; copy/link errors use the same anchored surface with the tooltip
      block's public color tokens and remain announced through a nonvisual
      polite/error status region.
  - expected areas: `src/components/App/`, the new tooltip adapter, and i18n
    status handling.
  - changed: `FeedbackTooltip` is a sibling overlay with an explicit reference
    to the Share button, not a child of `ActionMenu`. Nesting its `TooltipRoot`
    had shadowed the menu's popper context and placed an opened menu off-screen.
    Opening Share clears active feedback before the direct menu trigger opens.
  - manual check: header controls never move; Copy link shows feedback, errors
    are announced, and the menu still closes and returns focus correctly.
- [ ] Remove the redundant disabled-ZIP paragraph after verifying metadata
      fields provide the actionable errors. If an explanation is still needed,
      add it as an anchored disabled-control tooltip rather than a new header
      row; do not use `hb-alert` for this short control-specific reason.
  - expected areas: `src/components/App/` and shell status styles.
  - manual check: invalid metadata blocks ZIP without moving the header and
    leaves the relevant metadata field errors visible.
- [ ] Delete the superseded `share-*`, `import-*`, and `download-error` local
      feedback CSS only after all three feedback paths are moved. Reserve
      `hb-alert` for a future persistent global notification, not transient
      action confirmation.

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

## Technical iteration: remote quality gate (R02)

Baseline: `origin/main` at `a95eb2c4df1151a8d9adad5afe3e7919ceef7968`.
At that original baseline, the remote implementation supported shell `system`;
its valid-session fixture was correct. Tests (99/99), JavaScript/style lint, and build passed. Only
Prettier fails on the two already tracked audit prompt documents.

- [x] Format only `audit/1-astra-xhigh-prompt.md` and
      `audit/2-sol-6-1-xhigh-verify-prompt.md`, preserving their content.
      Verify with `npm run format:check` and a scoped diff.
- [x] Rerun `npm test`, `npm run lint`, `npm run lint:styles`,
      `npm run format:check`, and `npm run build`: all pass locally.
      Keep the independent plain-font fix and local UI work out of this branch.

No lint rules, thresholds, session behavior, or audit reports are changed.
The prompt changes add exactly four blank lines; ignoring blank lines produces
no diff. No new test is needed for Markdown formatting.

Local verification uses Node 24/macOS. Next small step: create a draft PR and
verify the existing Node 22/Linux CI without running deployment.

## Technical iteration: complete R01 value contract

The owner delegated the value-policy decision and authorized commits and pushes
on separate fix branches, without merging or pushing main. Continue the existing
R01 PR from its updated main baseline; leave develop and unrelated fixes alone.

- [x] Define shared control/import constraints in `src/theme/constraints.js`:
      six-digit HEX colors (either case); decimal px text size 14..24; decimal
      rem content width 36..64 and margins 1..4; finite unitless title scale
      1.2..2 and text line height 1.3..1.9. Reuse these limits in ThemeControls.
      Verify defaults, Random and all presets fit; accept decimal precision
      independently of the sliders' interaction steps.
- [x] Extend the existing shared boundary validator for JSON/File/URL/storage.
      Reject unsupported models atomically; retain editable metadata errors,
      known-field copying, version 2 and existing font normalization/fallback.
      Verify CSS breakout, wrong units, malformed colors and range endpoints
      using a temporary harness; adjust existing range fixtures to the contract.
- [x] Guard the ZIP boundary (including direct callers) and Download availability
      with the same model invariant; retain the separate metadata validity gate.
      Verify ZIP paths, CSS declarations and escaped PHP metadata against the
      real Aegea variable contract without changing preview markup or engine.
- [x] Run scoped quality checks and build; record existing R02 failures rather
      than fixing them. Commit/push only this iteration and update draft PR #2.
      Inspect CI; no merge, release, main push or environment repair.

Policy rationale: inputs remain exactly representable by the current editor;
presets and generated themes already use these units and bounds. Arbitrary CSS
functions/declarations and manual values outside the editor are rejected, never
silently clamped or partially applied. Invalid stored sessions use the existing
fallback. CSS injection into the exported artifact is relevant; JS/PHP execution
or XSS has not been demonstrated by this audit.

Implementation: shared limits now drive the existing sliders and value validator.
Custom system stacks retain named/quoted families and generic fallbacks, with
balanced quotes and complete comma-separated tokens; unsupported font syntax is
rejected at external boundaries. The existing trusted generator fallback remains.
Download availability and direct ZIP callers also reject an invalid model;
editable empty/invalid metadata can still be imported and repaired in the UI,
but cannot become an archive path. No preview structure or Aegea target changed.

Verification before prerequisite integration: scoped ESLint/Prettier, build and
ZIP parsing passed. A temporary harness rejected 250 invalid models across
JSON/File/URL/storage and direct ZIP, accepted all catalog font choices and ten
preset archives, and checked range endpoints plus 200 Random themes applied as
the App applies them. Existing range fixtures now use the supported endpoints;
no new repository test or infrastructure was added.

Browser file-chooser verification remains unavailable: the Chrome extension
requires file-URL access, which was not enabled. File decoding was verified via
Blob. PHP/live Aegea installation and paired rendering remain unverified; no
runtime repair or V01/V03/V04 work was attempted.

Full checks still encountered the known main R02 failures. The already prepared
quality prerequisite at PR #1 head `954f71d` has successful Node 22/Linux CI and
is merged into this fix branch as a separate integration commit. This does
not merge either PR into main or deploy the site.

## Technical iteration: quality gate after main update

New baseline: `8662ce5a7a94fff4df4f95bab34a0f48eea9b561`. It includes the
UI migration, concrete light/dark session policy, document-root colour scheme,
and already published audit reports. Reproduced on an isolated worktree:
98/99 tests, one PresetSelector formatting error, seven App.css style errors,
and formatting failures in two prompts, two reports and PresetSelector.
Build passes. No dependencies or quality rules are changed.

- [x] Merge new main into this branch without rewriting history; retain its UI.
- [x] Format only the PresetSelector opening tag, with unchanged attributes.
- [x] Align the session test fixture with the current light/dark contract and
      add explicit rejection regressions for legacy system/missing values.
      Coordinate `storage.test.js`; leave runtime persistence unchanged.
- [x] Move global root/popper layer declarations out of scoped App.css into
      global shell CSS, preserving selectors/values. Consolidate the duplicate
      download-error rule and replace deprecated clip with equivalent clip-path.
      Coordinate App.css; keep widths, overlays and theme behavior unchanged.
- [x] Format the already published reports in a separate commit under the
      renewed technical-fix authorization. Their normalized Markdown and
      embedded JavaScript ASTs match the baseline: words, data, links and
      semantic structure are unchanged.
- [x] Run all five checks locally: 104/104 tests, JS/style lint, formatting and
      build pass. Unknown ordinary CSS pseudo-classes still fail stylelint.
- [ ] Confirm clean Node 22/Linux PR CI after pushing this branch.

Local clean npm ci is blocked by EALLOWGIT for the pinned hvab-blocks dependency.
No bypass was attempted. Existing installed dependencies were copied with
executable symlinks preserved; the shared and new-main lockfiles match exactly.
The CI clean install remains the authoritative independent install check.

Verified shell layers: Vue compilation of the former scoped :global rules and
the new global CSS produces identical selectors/declarations/priorities.
Chrome light/dark Share/Reset portals use floating z-index 10 and modal 20;
Copy-link status retains role=status, a 1px box and inset(50%) clipping. Metadata
errors still disable ZIP; download-error flex-basis remains auto in the header.

Read-only npm audit: 16 flagged package records (14 high, 1 moderate, 1 low),
including inherited dependency records, not 16 independent vulnerabilities.
Production-only audit flags PostCSS and nanoid through Vue's compiler package;
the built browser chunks contain no modules from either package. Tooling
issues include brace-expansion, braces and its stylelint chain, fast-uri,
js-yaml, colord and postcss-selector-parser. Audit proposes breaking downgrades
for the braces/stylelint chain; do not run audit fix --force. Dependencies and
lockfile remain unchanged. Dependency remediation requires separate scope.

Final R01 combination after integrating the verified R02 prerequisite:
all five existing quality commands pass locally (114/114 existing tests,
ESLint, stylelint, Prettier and build). The temporary contract harness also
passes again. Chrome URL import rejects CSS breakout and out-of-range scale,
preserves the saved theme, and announces the error in EN/RU. A valid endpoint
payload applies all values and enables ZIP; the download bridge timed out, so
browser-downloaded archive inspection remains unverified. The ten archives
created through the real ZIP API were parsed and inspected independently.

Implementation is complete; next small step is owner review of draft PR #2 and
its final CI, followed by the separately requested PR integration. Live Aegea
installation, Chrome file permissions, R05 integration and other verification
experiments are outside this iteration.
