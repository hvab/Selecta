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

## Current runnable state

The app starts locally and shows:

- a first Aegea-based preview surface;
- editable theme metadata fields;
- metadata validation errors for required names and invalid folder names;
- editable color, typography, and layout controls;
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

## Next small step

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
- [ ] Start Stage 5 with read-only planning for ZIP export.

## Future backlog

- [ ] Stage 5: Client-side ZIP export.
- [ ] Stage 6: Verification in a real local Aegea instance.
- [ ] Stage 7: MVP polish and README alignment.
