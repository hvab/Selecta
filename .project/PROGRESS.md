# Progress

Current working context for Selecta. Product behavior is defined in
[`SPEC.md`](../SPEC.md); historical plans are not active instructions.

## Status

The audit remediation was merged as `8f5c722` in PR #8 (2026-10-19).
[CI](https://github.com/hvab/Selecta/actions/runs/39265357150) and
[Pages](https://github.com/hvab/Selecta/actions/runs/39265357066) succeeded on
that revision. No new versioned release was created during audit closeout.
PR [#9](https://github.com/hvab/Selecta/pull/9) merged the dependency refresh,
theme import and editor-interface iterations into main as `9222e8a` on 2026-10-20.
[CI](https://github.com/hvab/Selecta/actions/runs/39430724768) and
[Pages](https://github.com/hvab/Selecta/actions/runs/39430724821) succeeded on
that revision. Release commit `56dc0df` and annotated tag `v0.9.0` are on main.
[Selecta 0.9.0](https://github.com/hvab/Selecta/releases/tag/v0.9.0) was published
on 2026-10-20; publication was confirmed through GitHub release metadata.

Local `develop` was synchronized with main `8f5c722` on 2026-10-20 before
the dependency refresh. Audit documentation closeout is preserved separately
in commit `eb5b4c8`. The dependency refresh preserves that audit baseline.

## Release preparation: 0.9.0 (2026-10-20)

- [x] Compare all commits since `v0.8.0` with CHANGELOG; add missing user-facing
      changes, consolidate intermediate dependency entries and prepare the
      dated `0.9.0` section. Keep historical release sections unchanged.
- [x] Set package/lockfile versions to `0.9.0` without a commit or tag; align
      README status and the SPEC export tree with the prepared release.
- [x] Check formatting, version consistency and the production build; record
      results and remaining publication steps. No app behavior changes.

The release section includes unified theme import, JSON snapshots, the editor
redesign, group locks, Reset confirmation, dependency/browser requirements and
all merged audit fixes. Intermediate hvab-blocks versions are consolidated into
the final 0.4.0 integration. The changelog now also records shared-URL session
persistence and stale-import protection for every supported import route.
Historical release sections are unchanged; Unreleased is empty.

Package and both root lockfile versions agree at `0.9.0`. Formatting, diff
whitespace checks and production build passed. The full quality gate passed
immediately before PR #9 merged; main CI/Pages links above identify that code
revision. Release preparation changes only documentation and version metadata.
The Aegea 11.5 baseline and recorded platform/import limits remain unchanged.

The owner authorized a release commit and annotated `v0.9.0` tag after reviewing
this preparation. Commit `56dc0df` records that release closeout; the tag and
GitHub release are now published. Earlier iteration entries below describe
their completion-time state.

## README release follow-up (2026-10-20)

- [x] Replace the local-preparation/0.8.0 status with the published 0.9.0 release
      link and its changelog section. Existing feature and import descriptions
      already match the release and remain unchanged.
- [x] Confirm publication through GitHub, check Markdown formatting and diff
      whitespace. Documentation only; no application behavior changes.

Next small step: commit and publish this documentation correction when requested.

## Commit closeout (2026-10-20)

The owner accepted the UI iterations and requested all accumulated changes to
be committed in logical groups. Code commits: `c7467e1`, `1393605`, `1bd6084`, `85b57a7`, `4e26a63`.
Each staged code snapshot passed a production build before its commit. Final
lint, style lint, formatting and build passed. Browser verification and limits
remain recorded with the relevant iterations below. Earlier uncommitted/no-commit
notes describe the state when those iterations were completed.

## Implemented

- Vite, Vue and plain JavaScript; browser-only generation of child themes based
  on Aegea `plain`, with a theme folder inside the ZIP.
- Metadata, layout, typography and light/dark palette controls; independent
  light/dark shell appearance and RU/EN interface/preview.
- Aegea presets, Random, per-field/group locks, session restore and Reset.
- Unified JSON, folder, ZIP and individual CSS/PHP import, JSON/ZIP export and URL sharing; validated input
  boundaries and shared stale-import protection. Language and shell preferences
  stay outside exports. Theme ZIPs include a `selecta.json` snapshot.
- System/plain font choices and a curated Cyrillic Google Fonts catalog;
  remote CSS loading with fallbacks, without bundling font files.
- Non-blocking contrast hints; no comprehensive contrast certification.
- Local Vue adapters over `hvab-blocks` 0.4.0, with Reka menu, dialog and
  feedback-tooltip behavior. Shell and Aegea preview styles remain separate.
- Two-column workspace with a fixed sidebar header/footer, scrollable controls,
  interface-settings popover, bottom ZIP/overflow actions and a theme-mode control
  inside the preview frame. Workspace breakpoint is `43rem`, matching the combined minimum pane widths.
  Desktop is the primary use case.

## Audit closeout

The authoritative outcome and PR mapping are in [`audit/README.md`](../audit/README.md).

- R01–R05 are merged: validation, quality gate, panel sizing, plain font stack
  and persistence. V01 stale File success/error handling is also merged.
- V02 install/render acceptance and V03 desktop preview comparison are closed
  by the owner's manual confirmation. Do not repair local PHP/libzip merely
  to repeat that acceptance; no detailed platform matrix is claimed.
- The separate V03 header overlap is fixed and merged in PR #8.
- V04 large-file stress scenarios were withdrawn: real configs are about 1 KB.
  Font-network fallback and highlighted-link contrast are optional backlog items.
- No further zoom or mobile checks. Historical unchecked checklists do not
  reinstate them. Broader platform coverage is not claimed or a mandatory audit
  follow-up without a concrete task.
- PR #2, #4, #6, #7 and #8 are merged; #1, #3 and #5 are closed duplicates.
  No open PR or GitHub Issue remained at closeout.

## Latest iteration: mobile layout polish (2026-10-20)

Owner explicitly requested mobile polish and supplied the narrow-layout screenshot;
this iteration authorizes focused mobile verification beyond the prior desktop scope.

- [x] Step 1 — Check narrow rendering, then make the stacked workspace/sidebar
      fill the viewport and keep each lock beside its input under the label.
      Areas: App.css and Field.vue. Preserve desktop layout and control styles.
- [x] Step 2 — Refine narrow-screen action/preview spacing as needed, verify
      phone widths and the desktop boundary, run quality gates/build and record
      actual results. No new features, theme contract changes or commit/push.

The stacked workspace/sidebar fills the available width. Narrow fields now use
one label row and one input/addons row, keeping locks and numeric values beside
the control. Mobile export actions are fixed at the viewport bottom with
safe-area padding and page clearance, including the validation-message state.
The responsive breakpoint is 43rem so the two desktop panes never compete below
their combined minimum widths; wide preview content is contained horizontally.

Browser verification used same-origin app frames at 320px and 390px plus a 700px
two-column boundary check. Verified preset layout, metadata/color/font/range
controls, export-menu placement, validation feedback and persistent ZIP access
while scrolling the preview. The temporary review wrapper was removed and
metadata restored. This is browser-width verification, not a physical-device
or Safari/iOS certification. Lint, style lint, formatting and production build
passed. No Aegea contract changes, commit or push.
Next small step: owner visual acceptance of this final layout pass.

## Latest follow-up: unfilled closed locks (2026-10-20)

- [x] Use the flat Button view for closed locks, matching the open-lock surface
      while retaining native hover feedback. Area: ui/LockToggle. Mixed-state
      outline, crossfade and toggle behavior remain unchanged.
      Next step: owner visual acceptance of the unfilled closed state.

## Latest follow-up: lock crossfade (2026-10-20)

- [x] Fade between open/closed/mixed lock details over 140ms, keeping the SVG
      frame and button geometry fixed. Area: ui/LockToggle. Honor reduced motion;
      verify field/group states and unchanged dimensions in the desktop browser,
      then run lint/style lint/format/build. No commit/push or mobile/zoom.

Open, closed and mixed SVG details now overlap in the same frame and fade only
opacity; the body remains fixed. There are no timers or transition-dependent
state updates. Reduced-motion CSS removes the fade. Desktop browser confirmed
0.14s opacity transitions, 16px SVGs in unchanged 20×20px buttons, one active
state layer, and working field/group none→mixed→all→none transitions. Lock state
was restored. Lint, style lint, formatting and build passed. Next small step:
owner acceptance of the fade; no commit/push.

## Latest follow-up: compact lock icons (2026-10-20)

- [x] Reduce the lock artwork to 16px and its button to XS (20px). Replace
      group list marks with two overlapping locks. Area: ui/LockToggle.
      Verify visual clarity, unchanged none/mixed/all semantics and quality checks.

Desktop browser confirmed 16px artwork in 20px buttons and the group's two-lock
silhouette. Palette group transitions none→mixed→all→none remain unchanged;
locks were restored afterward. Lint, style lint and formatting passed.
Next small step: owner visual acceptance; no commit/push.

## Latest iteration: lock icons (2026-10-20)

- [x] Step 1 — Replace field/group lock checkboxes with a local LockToggle
      adapter over the existing Button. Draw monochrome open/closed SVG locks;
      add list marks to group locks and a dash for mixed state. Preserve existing
      toggle semantics and add localized action tooltips. Areas: FieldLock,
      GroupLock, ui/LockToggle and RU/EN locales. No theme-state/export changes.
- [x] Step 2 — Verify single/all/mixed states and keyboard operation in the
      desktop browser, check both shell appearances, run quality gates/build,
      and update current documentation. No commit/push or mobile/zoom checks.

Field locks now use open/closed monochrome SVG locks in the existing small
Button surface. Group locks add three list lines and show a dash for a mixed
state. The local LockToggle adapter exposes aria-pressed=false/true/mixed and
localized action titles; the lock data, grouping and Random behavior stay in
the existing model. No hvab-blocks source or shared Checkbox styles changed.

Desktop browser verified field toggles, none→mixed→all→none group transitions,
Space/Enter, focus ring, RU/EN titles and both shell appearances. Existing lock
state was restored after verification. Lint, style lint, formatting and production
build passed. No mobile/zoom or commit/push. Next small step: owner visual
acceptance of open/closed icons and the group/mixed markers.

## Latest follow-up: lighter Random gradient (2026-10-20)

- [x] Remove hover movement and use the supplied sky-blue (#58a6ff), coral
      (#ff6b6b) and cream (#ffedd5) palette with a dark readable label. Retain
      slow gradient animation and reduced-motion handling. Area: App.css.
      Verify computed geometry/colors and run scoped code-quality checks.

The gradient now uses the reference's blue/coral/cream colors with #172033
text. Hover/active transforms and the transform transition were removed;
only the soft glow changes on hover. The 9s animation and reduced-motion rule
remain. Desktop browser confirmed gradient stops, label color, no transform
and 9s duration. Style lint and formatting passed. Next step: owner visual
acceptance of the lighter palette; no commit/push.

## Latest follow-up: colorful Random button (2026-10-20)

- [x] Give Random a custom gradient as explicitly requested, retaining its
      existing size, label and action. Areas: App.vue/App.css. Check text contrast,
      hover/focus and both shell appearances; run lint/style lint/format checks.
      Owner follow-up: add slow, continuous gradient animation and respect
      prefers-reduced-motion.
      Keep other buttons and hvab-blocks source unchanged.

Random now has an app-local blue/purple/pink/teal gradient with a slow 9s
alternating animation, white semibold label and a subtle hover lift/glow.
Native button semantics, L size, action and focus ring are preserved.
Reduced-motion CSS disables the background animation; hover transitions use
shared motion tokens. The animation is confined to this button.

Desktop browser confirmed the scoped keyframe, 9s duration, 36px height,
keyboard focus ring and appearance in both light/dark shell. White-text contrast
at the gradient stops ranges from 4.99:1 to 6.51:1. Lint, style lint, formatting
and production build passed. No theme-model changes, mobile/zoom or commit/push.
Next small step: owner acceptance of the gradient and animation intensity.

## Latest follow-up: preset swatch order (2026-10-20)

- [x] Match the sidebar order from left to right: background, foreground,
      headings, link, hover. The fifth segment uses hover instead of active.
      Areas: PresetSelector and specification; no selection or theme-data changes.
      Next step: owner visual acceptance of the ordered swatches.

## Latest follow-up: heading color in preset swatches (2026-10-20)

- [x] Add headings as the fifth swatch segment, preserving background,
      foreground, link and active colors. Areas: PresetSelector and current
      specification. Verify Fiesta's pink heading segment and code quality.

Desktop browser confirmed five rendered segments in Fiesta, including its
pink heading color (#ff00a0) and cyan active color (#03c7ce). Lint, style lint
and formatting passed. No changes to preset selection or theme data.
Next step: owner visual acceptance of the five-color swatches; no commit/push.

## Latest iteration: preset color cards (2026-10-20)

- [x] Step 1 — Replace the preset select with a compact grid of named color
      cards. Reuse hb-card selection/hover surfaces through a native radio-card
      adapter; display background, foreground, link and active colors in the same
      order for every preset. Keep import behavior unchanged. Areas:
      PresetSelector, ui/RadioCard, locales if needed. Verify keyboard selection,
      selected/custom state, preset application and both UI languages.
- [x] Step 2 — Verify desktop layout in light/dark shell and adjustable sidebar
      widths, run lint/style lint/format/build, and document actual results.
      No hvab-blocks source edits, theme-model changes, commit/push or mobile/zoom.

All ten presets are visible as compact cards with localized names and fixed
base-palette swatches (background, foreground, link, active). The local RadioCard
adapter uses native radio semantics with hb-card hover/selection states and the
shared focus tokens; no hvab-blocks source or existing control styles changed.
Custom values clear selection and show the existing localized custom label.
Import and drag/drop handlers remain unchanged.

Desktop browser verification covered mouse selection, native arrow navigation,
Fiesta palette application, custom-state detection after a typography change,
RU/EN labels, light/dark shell and sidebar resizing. The grid uses four columns
at the current normal width and three at the 320px minimum, with no clipped
labels at that minimum. Swatches intentionally summarize the base palette only;
they do not preview dark palettes or typography. Lint, style lint, formatting
and production build passed. No mobile/zoom, commit or push. Next small step:
owner visual acceptance of the card density and swatch presentation.

## Latest follow-up: equal export-button heights (2026-10-20)

- [x] Set the overflow button to L to match the ZIP button's 36px height.
      Keep the vertical symbol and square geometry; use the existing size variant.
      Area: App.vue. Desktop browser measurement confirmed both buttons are 36px
      high. No component-style changes. Next step: owner visual acceptance.

## Latest follow-up: symbol action buttons (2026-10-20)

- [x] Use text-presentation Unicode symbols for settings and overflow; make the
      settings button L and the vertical-ellipsis button M. Give these two local
      icon-only compositions square geometry through the public padding token,
      and size the symbols separately. Areas: App.vue/App.css. Check centered
      symbols, existing popover/menu behavior and code-quality commands.
      Keep hvab-blocks source and shared Button styles unchanged.

Verified in the desktop browser: settings is 36×36 (L), overflow is 28×28
(M), both have zero inline padding and 20px centered text symbols. Settings
uses U+2699 with text presentation (U+FE0E); overflow uses U+22EE. The installed
hvab-blocks version has no dedicated icon-only button variant. Both popover
and upward menu open and dismiss with Escape. Lint, style lint, formatting
and production build passed. Shared Button and hvab-blocks source are unchanged.
Unicode glyph shapes depend on the system font. Next small step: owner visual
acceptance of these two buttons; no commit/push.

## Latest iteration: two-column editor layout (2026-10-20)

Scope: remove the shared topbar; keep hvab-blocks control styles unchanged.
Theme data, import/export behavior and the Aegea page contract stay unchanged.

- [x] Step 1 — Move branding into a fixed sidebar header, retain the scrollable
      controls, and pin ZIP download plus an upward overflow menu to the bottom.
      Areas: App.vue/App.css. Check desktop scrolling, resizing and both exports.
- [x] Step 2 — Add an interface-settings popover using Reka and hb-popover with
      existing RadioGroup controls; move the theme-mode control into the preview
      frame and identify the active palette in the colors heading.
      Areas: App, a local Popover adapter, ThemeControls, RU/EN locales.
      Check separate shell/theme modes, keyboard dismissal/focus and RU/EN.
      Inspect the pinned/current Aegea markup and variables for preview impact.
- [x] Step 3 — Run lint, style lint, formatting and production build; visually
      inspect the desktop layout and update this context with actual results.
      No component restyling, commit/push, mobile or zoom verification.

Desktop browser verification covered independent sidebar/preview scrolling,
fixed header/footer and preview control, upward export menu, RU/EN settings,
light/dark shell independent of the preview, active palette headings, Escape
with focus return, and keyboard sidebar resizing. ZIP and JSON were downloaded;
the JSON matches selecta.json inside the ZIP. Copy-link reported success.
Lint, style lint, formatting and production build passed. hvab-blocks CSS and
control styles were not changed; the Popover adapter only supplies Reka behavior
and the existing hb-popover surface. The preview control reserves its own space
above the scrollable blog so it cannot overlap the blog menu.

The checked Aegea 11.5 baseline remains unchanged. Current local Aegea source
was compared: preview demo content is unchanged, while the newer plain layout
adds drafts and changes some variable defaults (including fonts). This iteration
only changes the outer frame and does not migrate Aegea markup or variables.
No mobile/zoom or live Aegea installation verification in this layout iteration.
No commit/push. Next small step: owner visual acceptance of the arrangement.

## Latest iteration: direct import and drag-and-drop (2026-10-20)

Owner follow-up: show the localized import hint only in the button's native
`title`; remove the paragraph below it and retain the error description link.

- [x] Remove the import menu and directory picker. The import button directly
      opens the existing multiple-file picker for ZIP/JSON/CSS/PHP.
- [x] Accept a folder or files dropped on that button. Capture browser drag
      entries during the drop event, read only supported folder paths, reuse
      existing readers and include asynchronous directory reads in the revision
      guard. Reject ambiguous selections without changing the theme.
- [x] Verify direct picker/keyboard behavior and drag feedback, independently
      review with Sol 6.1, run quality gates and update current documentation.
      Keep browser evidence separate from simulated drag-entry verification.
      No commit/push or mobile/zoom checks.

Coordinator and independent Sol 6.1 review found no confirmed defects.
The dropped directory reads exactly three supported paths with `create: false`;
missing paths are skipped, other read failures reject the import. No imported
PHP/CSS is executed or inserted into the page.

Lint, style lint, formatting, all 166 existing checks and production build passed.
Temporary checks covered 22 drop-reader scenarios and 86 App/UI scenarios;
the coordinator repeated the latter and independently verified delayed folder
reads after DataTransfer capture, precedence and rejection paths.
These checks simulate browser Entry API callbacks; native dragging from Finder
has not been verified because the browser automation does not expose that action.

Desktop Chromium verified direct mouse/Enter file-picker opening, ZIP and paired
CSS/PHP imports, RU/EN hints, absence of a popup and loaded drag-feedback tokens.
No captured console warnings/errors. Next manual check: drag one theme folder
from Finder onto the button and confirm the imported name/colors. Changes remain
uncommitted; no push or mobile/zoom verification.

## Previous iteration: unified theme import (2026-10-20)

- [x] Replace separate import buttons with one localized theme-import menu:
      choose a folder or files (ZIP, JSON, CSS, PHP), using the existing ActionMenu.
      Verify keyboard menu behavior and native picker opening on desktop.
- [x] Route file selection by format; allow one CSS and/or PHP with an optional
      JSON baseline, retaining JSON < PHP < CSS precedence and revision protection.
      Reuse readers without applying or executing source code; reject ambiguous
      selections atomically. Check single files and paired CSS/PHP.
- [x] Independently review with Sol 6.1, verify quality gates and production UI,
      and update SPEC, README, CHANGELOG and this context. No commit/push.

Coordinator and independent review confirmed supported combinations, file-order
independence, case-insensitive extensions, JSON < PHP < CSS precedence and atomic
rejection of duplicates/ZIP mixtures. Loose source files retain the JSON/default
export folder name. Existing folder and ZIP behavior is preserved.

Lint, style lint, formatting, all 166 existing checks and build passed.
Temporary reader and App harnesses covered 29 and 145 scenarios respectively.
Desktop Chromium verified the unified menu in RU/EN, keyboard file-picker
activation, Escape with focus return, paired PHP/CSS, ZIP and folder selection.
No captured console warnings/errors. No mobile/zoom verification.

Limits: one CSS and/or PHP per selection with optional JSON, or one ZIP/JSON
alone; only the existing supported theme settings are applied. Source PHP/CSS
is never executed or inserted into the document. No commit/push.
Next small step: owner acceptance of the unified import, then commit on request.

## Latest iteration: ZIP import (2026-10-20)

- [x] Define ZIP scope: one theme at archive root or inside one top-level theme
      folder; reuse the folder importer and its JSON < PHP < CSS precedence.
- [x] Add a ZIP reader using the existing `fflate` dependency. Read only the
      three supported theme files, reject ambiguous/corrupt archives, and keep
      extraction in memory. Verify generated archives and alternate layouts.
- [x] Add a localized ZIP picker sharing the existing import revision guard.
      Verify cancellation/races with JSON/folder imports and Reset.
      The temporary App harness passed 142 scenarios, including 58 ZIP cases.
- [x] Coordinator/independent Sol 6.1 review, existing quality gates/build and
      a desktop ZIP upload; refresh SPEC, README, CHANGELOG and this summary.
      No commit/push or mobile/zoom checks.

Independent review found a decompression limit bypass caused by trusting the
ZIP's declared size. Selected files now use streaming extraction in small
compressed chunks, checking actual output before retaining it. The coordinator
and independent reviewer confirmed rejection with both local and central sizes
forged. Root/wrapper layouts, stored/deflate and data descriptors were verified.

Lint, style lint, formatting, all 166 existing checks and production build passed.
Desktop Chromium verified ZIP upload with stale JSON and edited PHP/CSS, reload
persistence, RU/EN controls, atomic rejection of a corrupt ZIP and recovery on
the next valid upload. No captured console warnings/errors.

Limits: 32 MiB archive, 1 MiB per supported file, 4096 archive entries, one theme
at root or in one top-level folder. Unsupported files are not decompressed;
PHP/CSS keep the folder importer's supported subset. No full CRC certification
or live Aegea installation was performed. No mobile/zoom checks.
Next small step: owner acceptance, then commit when requested.

Future import from an Aegea blog URL is recorded in `IDEAS.md`: discover CSS
from public HTML and investigate indirectly available metadata and CORS.
It is outside this implementation.

## Latest iteration: theme-folder import (2026-10-20)

Scope approved by the owner: embed `selecta.json` in exported theme folders;
import a selected folder using JSON as a baseline and supported PHP/CSS values
as the authority. Ignore unsupported content and generate a fresh plain child
theme, without preserving arbitrary source files or executing imported code.

1. [x] Define precedence and supported subset in SPEC before implementation.
2. [x] Add static PHP/CSS readers and folder-to-state mapping in `src/theme/`.
       The optional JSON baseline is followed by PHP metadata/colors and CSS
       values. Normalize the selected directory name; ignore unsupported files.
       PostCSS is a direct runtime dependency for parsing without applying CSS.
3. [x] Include `selecta.json` in ZIP output and expose folder selection in the
       RU/EN UI. Share stale-import protection with JSON import and preserve R05.
       Update existing ZIP assertions for the additional archive entry.
4. [x] Coordinator and independent Sol 6.1 review completed. Existing lint,
       style lint, formatting, all 166 checks and production build passed.
       Separate temporary checks covered source precedence, malformed/missing
       JSON, PHP literals/expressions, supported CSS and cross-kind import races.
       The coordinator verified 26 integration scenarios; the independent
       reviewer also verified 1,000 snapshot round-trips with fractional sizes.
5. [x] Desktop Chromium selected a real fixture folder with stale JSON and edited
       PHP/CSS. The resulting name, folder, flags, colors, fonts and dimensions
       matched the supported theme files, persisted after reload, and rendered
       with RU/EN controls. No captured console errors/warnings. ZIP structure
       and embedded JSON were verified programmatically. No mobile/zoom pass.
6. [x] Update SPEC, README, CHANGELOG, agent guidance and backlog with the
       implemented scope and limits. Leave the changes uncommitted.

Limits: static return-array PHP, supported root/dark CSS scopes and literal
values (plus simple known-variable references). Complex PHP, arbitrary styles,
external CSS imports, assets, templates and inheritance chains are ignored.
Unsupported values retain the JSON/default baseline; removed font overrides
return to plain. Asymmetric margins and values outside controls are not mapped.
The next export is a new supported theme, not a lossless copy of the folder.

Aegea's local theme loader and built-in theme source were checked: an extra
JSON file does not change the existing PHP/CSS contract. No live Aegea install
was repeated. New implementation changes are local only: no commit, push, PR,
main merge or deployment. Next small step: owner acceptance, then commit when
requested. No further feature expansion is required for this iteration.

## Latest iteration: dependency refresh (2026-10-20)

- [x] Commit audit documentation closeout (`eb5b4c8`) and merge main into
      `develop` (`ff68291`), preserving all merged audit fixes.
- [x] Run `ncu -u` and update the lockfile to latest stable dependencies,
      including `hvab-blocks` 0.4.0, Vue 3.5.44, Reka UI 2.11, Vite 8.3.4,
      ESLint 10.13 and the current Stylelint toolchain.
- [x] Verify library changes and engines/peers with independent Sol 6.1 agents.
      Existing Vite/ESLint/Stylelint configurations and UI adapters remain
      compatible. Remove one unused initial assignment required by ESLint 10.
- [x] Document Node.js `^22.13.0 || >=24`; retain Node 22 in CI. Vite 8 uses
      its current default browser targets (Chrome/Edge 111, Firefox 114,
      Safari 16.4). The generated Aegea theme contract is unchanged.
- [x] Verify clean `npm ci`, lint, style lint, formatting, all 166 existing
      checks, and production build on Node 24.22. Repeat lint, style lint,
      all 166 checks and build on Node 22.17; both builds produce matching assets.
- [x] Verify production build in desktop Chromium: RU/EN, both shell themes,
      light/dark preview, preset selection, keyboard radio navigation, Share
      menu/copy feedback/disabled actions, dialog focus cycle/Escape/Reset,
      immediate reload persistence, and downloaded ZIP entries/metadata.
      Captured console has no warnings/errors. No zoom/mobile verification.
- [x] Independently review the diff with Sol 6.1 and accept the result after
      coordinator checks. No confirmed regressions found in this scope.

`ncu` reports all direct dependencies current. `npm audit --omit=dev` reports
zero vulnerabilities. Full audit retains nine related high-severity entries
from the single unpatched [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
in Stylelint's dev-only dependency chain. `braces` 3.0.3 is still latest;
there is no published compatible fix. Lint glob patterns here are fixed and
browser theme data never reaches this chain. Do not force the proposed
Stylelint downgrade. The separate `fast-uri` advisory was removed by updating
the compatible transitive dependency.

Audit documentation closeout is committed: historical setup/work logs and
prompts are archived, original audit reports are preserved, and actual optional
UI polish remains in [`IDEAS.md`](./IDEAS.md). No active audit task remains.

The dependency refresh is committed as `2913230`. It has not pushed,
merged into main, deployed, or created a release;
GitHub CI has not run for these local commits. Verification above is local.
No further application migration is currently required. Do not restart
completed audit work from historical plans.

## Working references

- [`SPEC.md`](../SPEC.md): current product scope.
- [`UI-ARCHITECTURE.md`](../UI-ARCHITECTURE.md): shell/preview separation.
- [`PREVIEW-BASELINE.md`](../PREVIEW-BASELINE.md): pinned Aegea source contract.
- [`RELEASE.md`](../RELEASE.md): checks, PR and release workflow.
- [`CHANGELOG.md`](../CHANGELOG.md): release history and unreleased changes.
- [`IDEAS.md`](./IDEAS.md): optional future work.
- [`archive/README.md`](./archive/README.md): completed plans and detailed history.

Read `AGENTS.md` before implementation; machine-local paths belong only in
`AGENTS.local.md`. Use scoped checks for documentation changes. Plan the next
implementation slice here before changing code, and record actual verification
and remaining limits afterward.
