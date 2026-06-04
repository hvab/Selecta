# Progress

## Status checklist

- [x] Project rules, specification, and iteration plan are documented.
- [x] Setup track: runnable project, local tooling, concise `.gitignore`, and UI architecture are documented.
- [x] Stage 1.1: Vite + Vue + JavaScript project scaffold.
- [x] Stage 1.2: Initial serializable theme state model.
- [x] Stage 1.3: Separate minimal `styles/main.css` generator.
- [x] Stage 1.4: Separate minimal `theme-info.php` generator.
- [x] Stage 1.5: Minimal screen with current theme state and generated file contents.
- [x] Stage 1 review against `SPEC.md`.
- [x] Stage 2: Aegea-based preview surface with fixed demo content, source version, and maintenance checklist.
- [x] Stage 3: Main controls with live preview and live file updates.
- [x] Stage 4: Theme metadata fields and validation.
- [x] Stage 5: Client-side ZIP export.
- [x] Stage 6: Theme install verification in a live Aegea blog.
- [x] Stage 7.1: First MVP polish pass and README alignment.
- [x] Stage 7.2: Browser QA for long names and metadata boundary values.
- [x] Stage 7.3: Final MVP review and cleanup.
- [x] Pre-release Random button for quick theme sampling.
- [x] Pre-release Aegea 11.5 target audit.
- [x] Stage 8: Expanded Aegea demo preview.
- [x] Stage 9: Contrast warnings and field locks for Random.
- [x] Stage 10.0: Session restore in localStorage and Reset.
- [x] Stage 10.1: Aegea theme presets.
- [x] Stage 11: URL state and JSON export/import.

## Current runnable state

The app starts locally and shows:

- a first Aegea-based preview surface;
- editable theme metadata fields;
- metadata validation errors for required names and invalid folder names;
- editable color, typography, and layout controls;
- non-blocking contrast warnings and field locks for Random;
- Aegea theme presets;
- session restore, Reset, URL sharing, JSON export, and JSON import;
- a guarded download button that exports a ZIP archive with the theme folder inside;
- the current theme state;
- generated `styles/main.css`;
- generated `theme-info.php`.

Both generated files must come from the same theme state model.

## Stage 1 boundaries

Included in this stage:

- Vite + Vue project setup;
- initial theme state grouped by responsibility;
- file generation kept outside the UI layer;
- one minimal screen proving the generation contract.

Not included yet:

- real Aegea preview;
- settings panel and live controls;
- ZIP export;
- validation;
- advanced typography controls;
- preview maintenance docs.

## Stage 1 review

Completed against the intended first-stage scope from `SPEC.md` and `plan.md`:

- one serializable theme state exists;
- the model keeps `meta`, `palette`, `typography`, and `layout` separate;
- `styles/main.css` and `theme-info.php` are generated outside the UI layer;
- the minimal screen shows the state and both generated file contents from that same state.

Deliberately still outside the completed Stage 1 scope:

- derived CSS values;
- live preview;
- controls;
- validation;
- ZIP export.

## Stage 2 review

Completed against the intended second-stage scope from `SPEC.md`, `plan.md`, and `PREVIEW-BASELINE.md`:

- fixed English preview demo content is documented;
- the checked Aegea commit and `plain` baseline theme are documented;
- preview maintenance checklist is documented;
- the first Aegea-like preview surface is implemented separately from the generator shell;
- preview covers the required blog title, subtitle, menu, note title, body text, lead, regular link, visited link, secondary/tag link, forced hover state, marked fragment, quotation-style fragment, input, footer, and engine text;
- preview uses the shared CSS-variable contract that also generates `styles/main.css`.

Deliberately still outside the completed Stage 2 scope:

- editable controls;
- live user edits;
- ZIP export;
- final install verification in a real Aegea instance.

## Stage 3 review

Completed against the intended third-stage scope from `SPEC.md` and `plan.md`:

- main color controls cover background, text, headings, links, visited links, hover, secondary/tag-related text, active navigation, marked text, and input colors;
- typography controls cover interface font, note text font, note text size, title scale, and note text line height;
- layout controls cover content width and side margins;
- controls update the same theme state model used by preview, `styles/main.css`, and `theme-info.php`;
- the controls panel is compact and responsive.

Deliberately still outside the completed Stage 3 scope:

- admin-specific color editing;
- theme metadata editing;
- validation;
- ZIP export;
- real Aegea install verification.

## Stage 4 review

Completed against the intended fourth-stage scope from `SPEC.md` and `plan.md`:

- theme metadata controls cover the display name and technical folder name;
- the folder name is automatically suggested from the display name until the user edits it manually;
- metadata changes update the same theme state model used by `theme-info.php`;
- metadata validation covers required display name, required folder name, and invalid folder name characters;
- validation errors are shown inline before the future download step;
- folder name suggestion and metadata validation are covered by focused tests.

Deliberately still outside the completed Stage 4 scope:

- ZIP export;
- blocking the download button when validation fails;
- real Aegea install verification.

## Stage 5.1 review

Completed as the first ZIP export slice against `SPEC.md` and `plan.md`:

- ZIP generation runs client-side;
- the archive contains the theme folder with `theme-info.php` and `styles/main.css`;
- the archive name comes from `meta.folderName`;
- the download button is disabled while metadata validation has errors;
- ZIP structure is covered by focused tests.

Deliberately still outside this first Stage 5 slice:

- real Aegea install verification;
- final Stage 5 review against `SPEC.md`;
- broader export UX polish.

## Stage 5 review

Completed against the intended fifth-stage scope from `SPEC.md` and `plan.md`:

- the download path creates a client-side ZIP archive;
- the archive structure is `theme-name/theme-info.php` and `theme-name/styles/main.css`;
- the archive filename uses the validated `meta.folderName`;
- the archive contents are generated from the same theme state as the preview and read-only file outputs;
- metadata validation blocks download before archive generation;
- the ZIP file name, archive paths, and extracted file contents are covered by focused tests.

Deliberately still outside the completed Stage 5 scope:

- installing the exported theme in a real local Aegea instance;
- comparing the installed theme with the generator preview;
- broader MVP polish and README alignment.

## Stage 6 review

Completed by manual verification in a live Aegea blog:

- the downloaded ZIP can be installed as an Aegea theme;
- the generated child theme is accepted by Aegea;
- `based_on = plain` works for inheritance;
- the generated `styles/main.css` is enough to apply the exported CSS variables;
- the resulting blog appearance matches the generator preview closely enough for the MVP install flow.

Deliberately still outside the completed Stage 6 scope:

- broader MVP polish;
- README alignment with the completed install/export flow.

## Stage 7.1 review

Completed as the first final-polish slice against `SPEC.md` and `plan.md`:

- the generator shell has more room for the completed preview and controls;
- long control labels and validation errors can wrap on narrow screens;
- preview navigation can wrap instead of overflowing;
- long words in preview body copy can wrap inside the preview surface;
- preview inputs shrink to their container on narrow screens;
- `README.md` now describes the actual run, edit, download, and install flow.

Deliberately still outside this first Stage 7 slice:

- deeper browser QA for long names and boundary values;
- deeper empty and boundary value audit;
- any post-MVP features.

## Stage 7.2 review

Completed as a browser QA slice against `SPEC.md` and `plan.md`:

- long display names auto-generate long folder names without horizontal overflow on a narrow viewport;
- empty display name and folder name show metadata errors and block download;
- invalid folder names show metadata errors and block download;
- the guarded download button stays enabled only for valid metadata;
- the first Stage 7 layout polish keeps the page within the viewport at the checked narrow width.

Deliberately still outside this Stage 7 slice:

- changing the theme generation contract;
- broader visual redesign;
- any post-MVP features.

## Stage 7.3 review

Completed as the final MVP review against `SPEC.md` and `plan.md`:

- the documented MVP stages are complete;
- the app keeps one theme state feeding preview, generated CSS, generated `theme-info.php`, and ZIP export;
- the generated theme remains a `plain` child theme with `theme-info.php` and `styles/main.css`;
- metadata validation guards the download path;
- `README.md` matches the actual Vite local path with the configured `/Selecta/` base.

Deliberately still outside the completed MVP:

- dark mode;
- presets;
- i18n;
- Google Fonts or bundled fonts;
- JSON import/export;
- existing-theme import;
- arbitrary CSS editing.

## Stage 8.1 review

Completed as the preparation slice for the simplified Aegea demo preview transfer:

- `PREVIEW-BASELINE.md` now uses Aegea `system/preview/en.php` as the source for the next preview;
- the checked release target remains Aegea `11.5`, build `v4199`, commit `e1d058356e5426bb1878785c6f4ab4e68b6c4995`;
- sample assets are explicitly sourced from `system/theme/images/sample-*`;
- the transfer scope is split into P0, P1, and P2;
- P3 states stay deferred in the future backlog.

Deliberately still outside this Stage 8.1 slice:

- moving preview content into JavaScript;
- changing Vue preview components;
- copying sample image assets;
- changing preview CSS.

## Stage 8.2 review

Completed as the static data slice for the simplified Aegea demo preview transfer:

- `src/preview/demoContent.js` now contains structured preview data based on Aegea `system/preview/en.php`;
- the data includes blog metadata, main menu items, demo notes, tags, pagination, a simple form, and footer metadata;
- sample image and thumbnail references are preserved as Aegea source paths for the later asset path slice;
- P3 states remain out of the data model for this simplified transfer.

Deliberately still outside this Stage 8.2 slice:

- rendering the new data in Vue;
- copying sample image assets into Selecta;
- changing preview CSS;
- replacing the current preview surface.

## Stage 8.3 review

Completed as the P0 rendering slice for the simplified Aegea demo preview transfer:

- `AegeaPreview.vue` now renders header, main menu, one note, and footer from `src/preview/demoContent.js`;
- the main menu includes regular, parent, current, and icon states;
- the preview notes together cover lead text, regular link, visited link, forced hover link, `mark`, `foot`, and `loud`; after the later P2 merge these states are split across note 1, the favourite note, and the search snippet;
- the preview still consumes theme CSS variables through `getThemeCssVariables()`;
- a small footer spacing adjustment keeps the P0 surface readable.

Deliberately still outside this Stage 8.3 slice:

- sample image assets and captions;
- note meta band, tags, favourite note, and simple form;
- tables, lists, search snippets, thumbnails, and pagination;
- broader `plain` CSS subset transfer.

## Stage 8.4 review

Completed as the P1 states slice for the simplified Aegea demo preview transfer:

- the preview now includes the Aegea sample image and caption;
- the sample image is served from `public/preview/sample-image.jpg`;
- note meta bands render comments, read counts, tags, and a current tag state;
- the preview now shows the favourite-note example;
- a simple comment-like form renders input, textarea, and submit button states;
- the preview shell allows the preview pane to shrink without horizontal overflow.

Deliberately still outside this Stage 8.4 slice:

- P2 tables, lists, headings, search snippets, thumbnails, and pagination;
- full comment-form states;
- admin controls and sharing widgets;
- broader `plain` CSS subset transfer.

## Stage 8.5 review

Completed as the selected P2 states slice for the simplified Aegea demo preview transfer:

- the first note now renders the broader Aegea demo text with `h2`, `h3`, `b`, `i`, `tt`, lists, table, and `hr`;
- the search-result snippet renders as a third preview note;
- thumbnail images render from `public/preview/sample-thumb-*`;
- simple timeline pagination renders the `Earlier` link;
- browser verification confirmed the selected P2 states render without horizontal overflow.

Deliberately still outside this Stage 8.5 slice:

- full comment-form states;
- admin controls and sharing widgets;
- broader `plain` CSS subset transfer beyond styles needed by the selected preview states.

## Stage 8.6 review

Completed as the scoped CSS reconciliation slice for the selected Aegea preview states:

- image proportional wrappers now follow the Aegea `plain` aspect-ratio pattern;
- marked thumbnail images use the real `mark img` border color behavior;
- search-result thumbnails render before snippet text and align by their bottom edge;
- note meta bands use the Aegea-style one-pixel item underline;
- read counts and comment links include the Aegea inline SVG icons;
- hidden tags include the Aegea lock icon;
- meta tags use the `e2-tag` color and underline rules from `plain`.

Deliberately still outside this Stage 8.6 slice:

- full compiled `plain/styles/main.css`;
- full comment-form states;
- admin controls and sharing widgets;
- author-only note states.

## Stage 8.7 review

Completed as the browser QA slice for the simplified Aegea demo preview transfer:

- preview stays responsive inside `.app-preview-pane` without horizontal overflow;
- shell and preview styles remain separated by scope;
- theme CSS variables still come from `getThemeCssVariables()` only;
- demo content covers the selected P0/P1/P2 states after the post-review fixes to note 1 and meta comments;
- header menu matches Aegea parent/current behavior: parent keeps the active underline, current does not;
- pagination `Earlier` link has hover colors from `plain`;
- preview links use the Aegea-style ease-out return animation on hover out.

Post-8.7 follow-up:

- P1 comment form controls are visually aligned with Aegea `plain` (input background, radius, textarea size, orange submit).

Deliberately still outside this Stage 8.7 slice:

- full compiled `plain/styles/main.css`;
- body links still use a scoped border-bottom subset instead of Aegea `text-decoration-color`;
- full comment-form states;
- admin controls and sharing widgets;
- author-only note states.

## Next small step

- [ ] Stage 12.5 (`0.6.0`): load selected Google Fonts in live preview without loading the whole catalog (`ROADMAP.md`).

- [x] Start Stage 3 with read-only planning for the first controls slice.
- [x] Stage 3.1: First editable color controls for background, text, and links.
- [x] Stage 3.2: Editable heading, visited link, hover, and tag color controls.
- [x] Stage 3.3: Editable secondary text, active navigation, marked text, and input color controls.
- [x] Stage 3.4: System font controls for interface and note text typography.
- [x] Stage 3.5: Numeric typography controls for note size, title scale, and line height.
- [x] Stage 3.6: Layout controls for content width and side margins.
- [x] Stage 3.7: Compact responsive controls panel styling.
- [x] Stage 3 review against `SPEC.md`.
- [x] Start Stage 4 with read-only planning for metadata fields and validation.
- [x] Stage 4.1: Editable display name with automatic folder name suggestion.
- [x] Stage 4.2: Folder name validation and metadata error display.
- [x] Stage 4 review against `SPEC.md`.
- [x] Start Stage 5 with read-only planning for ZIP export.
- [x] Stage 5.1: Client-side ZIP archive generation and guarded download button.
- [x] Stage 5 review against `SPEC.md`.
- [x] Stage 6: Verification in a live Aegea blog.
- [x] Stage 7.1: First MVP polish pass and README alignment.
- [x] Stage 7.2: Browser QA for long names and metadata boundary values.
- [x] Stage 7.3: Final MVP review and cleanup.
- [x] Stage 8.1: Simplified Aegea demo preview baseline.
- [x] Stage 8.2: Move static Aegea demo content into preview data.
- [x] Stage 8.3: Render P0 Aegea preview surface from demo data.
- [x] Stage 8.4: Add P1 Aegea preview states.
- [x] Stage 8.5: Add selected P2 Aegea preview states.
- [x] Stage 8.6: Reconcile the scoped preview CSS subset with Aegea `plain`.
- [x] Stage 8.7: Browser QA for responsive preview and shell/preview style isolation.

## Post-MVP roadmap

- [x] Post-MVP planning — see `ROADMAP.md` (fixed 2026-06-02).

Planned releases (detail in `ROADMAP.md`):

- [x] Stage 9.1: Non-blocking contrast warnings (WCAG 3:1 threshold, `src/theme/contrast.js`).
- [x] Stage 9.2: Per-field locks for Random (`src/theme/fieldLocks.js`, Unlock all).
- [x] Stage 9 review (`0.3.0`): contrast, locks, a11y fixes, marked thumbnail color.
- [x] Stage 10.0.1: Session storage module with guarded localStorage I/O and shape validation.
- [x] Stage 10.0: Session restore, field-lock restore, controls-pane width restore, and Reset to defaults.
- [x] Stage 10.1: Aegea theme presets selector with lock reset and session persistence.
- [x] Stage 11.1: Theme serialization module with strict shape validation.
- [x] Stage 11.2: URL share with `?theme=` loading priority and invalid-link fallback.
- [x] Stage 11.3: JSON export using the theme serialization format.
- [x] Stage 11.4: JSON import with inline invalid-file feedback.
- [x] Stage 11 (`0.5.0`): URL state and JSON export/import.
- [x] Stage 12.1: Typography font source model (`plain` / `system` / future `google`).
- [x] Stage 12.2: Aegea preset font override reconciliation for `chancery`, `holm`, and `kolomna`.
- [x] Stage 12.3: Static Google Fonts catalog snapshot and pure catalog helpers.
- [x] Stage 12.4: Searchable font picker with `Cyrillic only` default-on and category/search filters.
- [ ] Stage 12 (`0.6.0`): Google Fonts.
- [ ] Stage 13+: theme contract expansion, Aegea version targeting, deep preview states (on demand).
- [ ] Backlog: dark mode, bundled Cyrillic fonts, theme import, UI i18n, visual diff, gallery, arbitrary CSS editor.
- [x] UX follow-up: user-facing Aegea link in generator shell (`App.vue`; MVP hardcoded URL).
- [ ] With UI i18n: locale-specific Aegea site URLs (shell header, README, preview `engineHref` in `demoContent.js`; e.g. `blogengine.me` EN, `blogengine.ru` RU).
