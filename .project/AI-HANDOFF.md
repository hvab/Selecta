# AI handoff

This file is the working context for continuing Selecta with an AI assistant.
Keep it current after implementation slices. `SPEC.md` remains the product
source of truth.

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
- Generated `styles/main.css` and `theme-info.php` from one theme state model.

Current released base: `0.6.1`.

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
- User-facing app UI stays in English until a dedicated i18n stage.
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

Historical setup notes live in `.project/SETUP-PLAN.md`.

## Active track

No feature track is currently active.

Before starting the next feature, choose one small post-`0.6.1` slice and make
that the active track here.

## Next steps

- [ ] Choose the next post-`0.6.1` slice: Stage 13+ theme contract expansion or
      another small cleanup.
- [ ] If choosing Stage 13+, start with a read-only audit of current Aegea
      `plain` variables, inheritance, and preview gaps.
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
- Do not stage, commit, switch branches, or push unless the user explicitly asks.
- Keep diffs scoped; avoid reformatting unrelated files.
