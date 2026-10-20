# Ideas

Raw ideas and parked future work for Selecta. Keep this file lightweight. When
an idea becomes the next implementation slice, move the concrete checklist to
`.project/PROGRESS.md`.

Nothing here is an audit blocker or an active implementation task. Completed
presets, dark mode, RU/EN localization and localized Aegea links are not backlog.
Do not reintroduce zoom/mobile verification or artificially oversized imports.

## Optional follow-ups

- [ ] Highlighted-link contrast: the search-result title already contains
      `<mark>` inside a link, while the current warning compares only body text
      with the highlight background. A default palette with highlight color
      `#0066cc` produces no warning despite matching the default link color.
      Consider a targeted hint after a small desktop check; do not add forced
      palette constraints or imply complete WCAG coverage.
- [ ] Google Fonts fallback: if relevant during ordinary desktop acceptance,
      check one selected family with its font request unavailable. A fallback
      stack and `display=swap` are already emitted. No full-catalog/network
      campaign or loading redesign is planned.
- [ ] Disabled ZIP feedback: metadata errors already appear beside fields, but
      `App.vue` still renders a header paragraph explaining disabled download.
      Assess whether the duplicate paragraph can be removed or replaced by a
      focused explanation without moving header controls. Remove only CSS made
      unused by an actual change; the current `download-error` rules are used.

## Inbox

- [ ] Theme contract expansion for more Aegea CSS variables.
- [ ] Target Aegea version selection for generation and preview.
- [ ] Deeper preview states and more page types.
- [ ] Bundled Cyrillic open-source fonts.
- [ ] Existing theme import and continued editing.
- [ ] Visual diff between generated theme and `plain`.
- [ ] Theme gallery.
- [ ] Advanced mode for manual CSS-variable editing.
- [ ] Generated README for exported themes.
- [ ] GitHub-ready folder export.

## Later

- [ ] Self-hosted font flow for bundled open-source font packs.
- [ ] Logo upload.

## Parked

- [ ] Full Google Fonts catalog with runtime API access.
