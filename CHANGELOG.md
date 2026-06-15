# Changelog

Notable changes to Selecta are documented here.

The project follows semantic versioning where practical.

## Unreleased

## 0.6.1 - 2026-06-15

### Fixed

- Unknown Google Font families from imported/shared themes now fall back to Aegea `plain` instead of emitting an unloaded font-family.
- Font picker keeps imported custom system font stacks visible as a current custom option.
- Google Fonts preview stylesheet link now renders in the document head.

## 0.6.0 - 2026-06-11

### Added

- Google Fonts picker mode for typography controls with a curated Cyrillic catalog, Google category groups, and system stack fallback.
- Live preview stylesheet loading for selected Google Fonts only, with repeated families deduplicated.
- Generated theme CSS adds a deduplicated Google Fonts `@import` before `:root`.
- Manual generator and installed Aegea theme verification for the Google Fonts flow.
- Font-family output now adds modern system fallbacks for Google Fonts and system stack suggestions.
- Random theme generation picks main and note typography from the Google Fonts catalog as well as system stack variants, with matching `*FontSource` values.

## 0.5.0 - 2026-06-03

### Added

- Theme serialization module for upcoming URL and JSON sharing.
- URL sharing with `?theme=` links and invalid-link fallback.
- JSON export using the same theme serialization format.
- JSON import with inline invalid-file feedback.

## 0.4.0 - 2026-06-03

### Added

- Session restore in `localStorage`: theme state, field locks, folder-name edits, and controls pane width
- Reset to defaults in the export bar (clears saved session)
- Aegea theme preset selector with 10 presets (Default, Acute, Chancery, Douglas, Fiesta, Gal, Holm, Kolomna, Vox, Vulcano); based on Aegea v4199 / e1d0583
- Presets update palette, typography, and layout; applying a preset clears field locks
- Manual edits after a preset switch the selector to Custom

### Fixed

- Invalid or unsupported saved sessions are silently ignored instead of breaking the app
- Broken `localStorage` access is handled safely (private mode, blocked storage, quota errors)

## 0.3.3 - 2026-06-02

### Fixed

- Preview footer RSS badge and Aegea engine link with lemon icon, aligned with Aegea `plain` markup and styles.

## 0.3.2 - 2026-06-02

### Fixed

- Preview note meta band links (comments) use theme link and hover colors, aligned with Aegea `plain` band-item rules.

## 0.3.1 - 2026-06-02

### Fixed

- Metadata lock checkboxes align inline with text fields in the controls grid.
- Removed redundant random palette build before the contrast retry loop.
- Folder name normalization happens only in `App.vue`, not in `ThemeControls`.
- Contrast warnings no longer duplicate when hover and link use the same color.

## 0.3.0 - 2026-06-02

### Added

- Non-blocking palette contrast warnings under the related color fields (WCAG 3:1 threshold).
- `src/theme/contrast.js` and color luminance helpers in `src/theme/color.js`.
- Contrast-safe Random theme generation.
- Per-field lock checkboxes for Random; Unlock all in the export bar.
- Post-MVP roadmap in `ROADMAP.md`.

### Fixed

- Search-result thumbnail highlight in preview and exported themes now follows the Marked text color via `--markedImageBorderColor`.
- Theme controls accessibility: valid label structure and `id`/`for` on font, typography, and layout fields.

## 0.2.0 - 2026-06-02

### Added

- Aegea demo preview based on English `system/preview/en.php` content.
- Multi-note preview layout: header, main menu, footer, favourite note, search snippet.
- P1 states: sample image with caption, note meta band, simple comment form.
- P2 states: headings, lists, table, search thumbnails, timeline pagination.
- Sample preview assets in `public/preview/`.
- Scoped Aegea `plain` CSS subset for the selected preview states.

### Changed

- Replaced the compact single-note preview mock with the Aegea demo page layout.
- Default input background in generated themes aligned with Aegea `plain` (`#f0f0f0`).
- Preview pane responsive layout inside the generator shell.
- README link to the Aegea website.

### Fixed

- Preview CSS reconciliation with Aegea `plain`: image ratios, meta band icons/underlines, tag colors, search snippet layout.
- Main menu parent/current underline behavior.
- Link hover-out animation and pagination hover colors.
- Comment form controls aligned with Aegea `plain`.

## 0.1.0 - 2026-05-20

### Added

- Initial public version of Selecta:
  - theme metadata editing;
  - color controls for the generated Aegea `plain` child theme;
  - system font controls for the interface and note text;
  - typography controls for note text size, line height, and title scale;
  - layout controls for content width and side margins;
  - live Aegea-like preview based on the generated CSS variables;
  - generated `theme-info.php` and `styles/main.css` output preview;
  - ZIP export with the theme folder, `theme-info.php`, and `styles/main.css`.
