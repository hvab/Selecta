# Preview baseline

## Checked Aegea source

- Release target: Aegea `11.5`, build `v4199`
- Commit: `e1d058356e5426bb1878785c6f4ab4e68b6c4995`
- Baseline theme: `system/themes/plain`
- Preview source: `system/preview/en.php` and `system/preview/ru.php`
- Sample assets source: `system/theme/images/sample-*`

## Deferred Aegea source

- Aegea `12.0a`, build `v4271`, commit `deb13007265d551ec51d9a25cfc514a2102ec65a`
- Keep this as a later compatibility target; it should not drive the first public release while user-available Aegea is still `11.5`.

## Release compatibility notes

- The `plain` layout template is unchanged between Aegea `11.5` and the deferred `12.0a` source checked here.
- The `plain` CSS-variable set is unchanged between these sources.
- Aegea `11.5` body links use `text-decoration` with `text-decoration-color`; the deferred `12.0a` source keeps the same contract but refines it further. Selecta preview may approximate some link states with a scoped border-bottom subset where that is enough for theme tuning.
- The deferred `12.0a` source adds bundled Inter and JetBrains Mono fonts. Selecta MVP still intentionally generates only system web-safe font choices.

## Plain font contract

- Rechecked against the clean Aegea `11.5` / `v4199` checkout at the exact
  baseline commit above; both `system/themes/plain/src/styles/variables.scss`
  and compiled `system/themes/plain/styles/main.css` declare the same stack.
- Default `--mainFontFamily`: `system-ui, -apple-system, BlinkMacSystemFont, "SF UI Text", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif`.
- `--noteMainFontFamily` and `--smallFontFamily` remain `inherit`. The preview
  supplies this default locally; a plain-source child theme omits these font
  overrides and inherits them from Aegea. Explicit system/Google selections
  keep their existing generation and font-loading paths.
- A live Aegea render and paired width/linebreak comparison are still needed
  to verify visual parity; source equality does not establish pixel parity.

## Dark mode contract

- Aegea dark-mode support is theme metadata plus runtime appearance state: themes declare `supports_dark_mode`, while Aegea applies dark variables only when the blog responds to dark mode.
- Selecta exports light variables as the base `:root` block. When `supportsDarkMode` is enabled, it also exports dark variables under Aegea's real selector path: `@media (prefers-color-scheme: dark) { :root .e2-responds-to-dark-mode { ... } }`.
- Selecta preview may emulate `.e2-responds-to-dark-mode` locally for the dark preview mode, but exported CSS should continue to use the Aegea selector rather than a Selecta-specific class.
- `theme-info.php` `colors` stay tied to the light palette, matching the checked `plain` contract for theme-list preview colors.
- Selecta interface appearance is separate app UI state. It must not affect generated CSS, `theme-info.php`, theme JSON, share URLs, or ZIP contents.
- In the user-available Aegea theme set checked for Selecta presets, dark-mode-capable built-ins are `plain`, `acute`, `fiesta`, and `gal`. `chancery`, `douglas`, `holm`, `kolomna`, `vox`, and `vulcano` declare no dark-mode support.

## Demo content source

The preview should use Aegea theme preview content from `system/preview/en.php` and `system/preview/ru.php`. Selecta keeps its own extra preview states for theme tuning, including visited links, forced hover links, lead text, and highlighted text.

The transfer should be simplified: keep the page familiar to Aegea users without porting the whole Aegea renderer.

## Transfer scope

P0:

- real `plain` layout skeleton: `.common`, `.flag`, `.header-content`, `.content`, `.footer`;
- header with blog title, subtitle, and home link;
- main menu with regular, parent, current, and icon states;
- preview notes together cover title, lead, body text, regular link, visited link, forced hover link, `mark`, `foot`, and `loud`; after the P2 merge the first note keeps the link and `mark` examples, the favourite note keeps lead and `foot`, and the search snippet keeps highlighted `mark` in title and text;
- footer with author, email, RSS, and engine text.

P1:

- sample image with caption from `system/theme/images/sample-image.jpg`;
- note meta band with comments, read count, tags, and current tag;
- favourite note;
- simple form with input, textarea, and button.

P2:

- `h2`, `h3`, `b`, `i`, and `tt`;
- ordered and unordered lists;
- table;
- `hr`;
- search snippet with highlighted `mark` and thumbnails from `system/theme/images/sample-thumb-*`;
- simple pagination.

P3 is intentionally deferred to the future backlog in `.project/IDEAS.md`. Do not include full comment-form states, admin controls, sharing widgets, author-only note states, or full compiled `plain/styles/main.css` in the simplified transfer.

## Maintenance checklist

When preview-related code changes:

1. Compare the checked Aegea release target with the user-available Aegea source.
2. Recheck `system/preview/en.php` and `system/preview/ru.php` for demo content changes.
3. Recheck the relevant `plain` templates and markup used by the selected P0/P1/P2 blocks.
4. Recheck the `plain` CSS-variable set used by the preview and exported themes.
5. Recheck link underline behavior for the selected Aegea target version.
6. Recheck whether the preview still covers all required states from `SPEC.md`.
7. Update this baseline when the checked Aegea release target or the preview contract changes.
