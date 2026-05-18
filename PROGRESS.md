# Progress

## Status checklist

- [x] Project rules, specification, and iteration plan are documented.
- [x] Setup track: runnable project, local tooling, concise `.gitignore`, and UI architecture are documented.
- [x] Stage 1.1: Vite + Vue + JavaScript project scaffold.
- [x] Stage 1.2: Initial serializable theme state model.
- [x] Stage 1.3: Separate minimal `styles/main.css` generator.
- [x] Stage 1.4: Separate minimal `theme-info.php` generator.
- [x] Stage 1.5: Minimal screen with current theme state and generated file contents.
- [ ] Stage 1 review against `SPEC.md`.

## Current runnable state

The app starts locally and shows:

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

## Next small step

- [ ] Review Stage 1 against `SPEC.md`.

## Future backlog

- [ ] Stage 2: Aegea-based preview surface with fixed demo content, source version, and maintenance checklist.
- [ ] Stage 3: Main controls with live preview and live file updates.
- [ ] Stage 4: Theme metadata fields and validation.
- [ ] Stage 5: Client-side ZIP export.
- [ ] Stage 6: Verification in a real local Aegea instance.
- [ ] Stage 7: MVP polish and README alignment.
