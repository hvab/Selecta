# Changelog

Notable changes to Selecta are documented here.

The project follows semantic versioning where practical.

## Unreleased

### Added

### Changed

### Fixed

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
