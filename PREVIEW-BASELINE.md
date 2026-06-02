# Preview baseline

## Checked Aegea source

- Release target: Aegea `11.5`, build `v4199`
- Commit: `e1d058356e5426bb1878785c6f4ab4e68b6c4995`
- Baseline theme: `system/themes/plain`
- Preview source: `system/preview/en.php`
- Sample assets source: `system/theme/images/sample-*`

## Deferred Aegea source

- Aegea `12.0a`, build `v4271`, commit `deb13007265d551ec51d9a25cfc514a2102ec65a`
- Keep this as a later compatibility target; it should not drive the first public release while user-available Aegea is still `11.5`.

## Release compatibility notes

- The `plain` layout template is unchanged between Aegea `11.5` and the deferred `12.0a` source checked here.
- The `plain` CSS-variable set is unchanged between these sources.
- Aegea `11.5` body links use `text-decoration` with `text-decoration-color`; the deferred `12.0a` source keeps the same contract but refines it further. Selecta preview may approximate some link states with a scoped border-bottom subset where that is enough for theme tuning.
- The deferred `12.0a` source adds bundled Inter and JetBrains Mono fonts. Selecta MVP still intentionally generates only system web-safe font choices.

## Demo content source

The preview should use the English-language Aegea theme preview content from `system/preview/en.php`. Selecta keeps the UI English-only for MVP, so the Russian preview source stays out of scope for this transfer.

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

P3 is intentionally deferred to the future backlog in `PROGRESS.md`. Do not include full comment-form states, admin controls, sharing widgets, author-only note states, or full compiled `plain/styles/main.css` in the simplified transfer.

## Maintenance checklist

When preview-related code changes:

1. Compare the checked Aegea release target with the user-available Aegea source.
2. Recheck `system/preview/en.php` for demo content changes.
3. Recheck the relevant `plain` templates and markup used by the selected P0/P1/P2 blocks.
4. Recheck the `plain` CSS-variable set used by the preview and exported themes.
5. Recheck link underline behavior for the selected Aegea target version.
6. Recheck whether the preview still covers all required states from `SPEC.md`.
7. Update this baseline when the checked Aegea release target or the preview contract changes.
