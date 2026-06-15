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

Historical setup notes live in `.project/SETUP-PLAN.md`.

## Active track

English/Russian localization is implemented and awaiting review.

This slice adds `vue-i18n`, a persistent UI language switcher, and localized
preview content for Cyrillic font checks.

### Feature plan

- [x] Confirm product decisions:
  - first visit uses `navigator.language`, `ru-*` selects Russian, all other
    values fall back to English;
  - language is an app preference only, not URL, theme JSON, ZIP, or share state;
  - Reset keeps the selected language;
  - preview content is localized to check Cyrillic Google Fonts;
  - English Aegea link uses `blogengine.me`, Russian Aegea link uses
    `blogengine.ru`;
  - header copy is English/Russian and links to the matching Aegea language
    site.
- [x] Add i18n foundation:
  - add `vue-i18n`;
  - create `src/i18n/index.js`;
  - create `src/i18n/locales/en.js` and `src/i18n/locales/ru.js`;
  - store selected locale in `localStorage` key `selecta_locale`;
  - update `document.documentElement.lang` on initial load and language change.
- [x] Localize generator shell:
  - `src/App.vue` header, export panel, status messages, metadata errors,
    contrast warnings, language switcher, and aria labels;
  - `src/components/PresetSelector.vue` visible labels;
  - `src/components/ThemeControls.vue` control labels, optgroups, lock aria
    labels, and Google Font category labels.
- [x] Localize preview content:
  - use `system/preview/en.php` and `system/preview/ru.php` from the local Aegea
    checkout as the content baseline;
  - preserve Selecta-specific preview states: lead text, visited link, forced
    hover link, `mark`, search snippet, tags, form labels, and footer;
  - keep preview links language-specific for Aegea.
- [x] Update project context:
  - update `PREVIEW-BASELINE.md` to include `system/preview/ru.php`;
  - update this file with the i18n status and invariants.
- [x] Verify:
  - `npm run lint`;
  - `npm run lint:styles`;
  - `npm run format:check`;
  - `npm run build`;
  - browser check at `http://localhost:5174/Selecta/`: switching to Russian
    changes UI and preview, reload preserves Russian, Reset keeps Russian, URL
    stays free of language params.
- [ ] Review:
  - have another AI or human review the i18n implementation for missed hardcoded
    strings, persistence edge cases, preview fidelity, and maintainability.
- [x] Address review fixes:
  - replace fragile English-message reverse maps with stable validation and
    contrast keys;
  - remove unused English labels from palette lock metadata;
  - add i18n helper/message parity tests;
  - document the localization feature in `CHANGELOG.md`.
- [x] Remove author credit from the header:
  - keep the header focused on Selecta and Aegea for now;
  - decide separately where author credit belongs in the UI or docs.
- [x] Prepare `0.7.0` release:
  - move localization notes from `Unreleased` to `0.7.0 - 2026-06-15`;
  - bump `package.json` and `package-lock.json` to `0.7.0`;
  - rerun the release checks.

### Implementation notes

- `src/i18n/index.js` owns locale normalization, startup locale choice, storage,
  and `html lang`.
- `src/preview/demoContent.js` exports `getAegeaDemoContent(locale)` instead of a
  single static preview content object.
- Validation and contrast modules return stable message ids; `App.vue` translates
  them at the UI boundary.
- `npm audit` reports 3 high severity warnings through
  `vite` / `@vitejs/plugin-vue` / `esbuild`; the suggested
  `npm audit fix --force` upgrades to Vite 8 and is a breaking dependency
  change, so it is left as a separate decision.

## Next steps

- [x] Review the implemented English/Russian localization.
- [ ] Decide where to mention the project author outside the compact app header.
- [ ] Evaluate `vue-i18n` bundle-size/runtime-only setup, for example via
      `@intlify/unplugin-vue-i18n`, before optimizing this feature further.
- [ ] Decide separately whether to address the Vite/esbuild audit warnings in
      this release.
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
- Do not store language in theme JSON, share URLs, or ZIP output.
- Do not stage, commit, switch branches, or push unless the user explicitly asks.
- Keep diffs scoped; avoid reformatting unrelated files.
