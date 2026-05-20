# Preview baseline

## Checked Aegea source

- Release target: Aegea `11.5`, build `v4199`
- Commit: `e1d058356e5426bb1878785c6f4ab4e68b6c4995`
- Baseline theme: `system/themes/plain`

## Deferred Aegea source

- Aegea `12.0a`, build `v4271`, commit `deb13007265d551ec51d9a25cfc514a2102ec65a`
- Keep this as a later compatibility target; it should not drive the first public release while user-available Aegea is still `11.5`.

## Release compatibility notes

- The `plain` layout template is unchanged between Aegea `11.5` and the deferred `12.0a` source checked here.
- The `plain` CSS-variable set is unchanged between these sources.
- Aegea `11.5` uses border-based link underlines; the deferred `12.0a` source switches the main link contract to `text-decoration-color`.
- The deferred `12.0a` source adds bundled Inter and JetBrains Mono fonts. Selecta MVP still intentionally generates only system web-safe font choices.

## Fixed demo content

The preview should use one stable English-language page with:

- blog title: `Northbound Notes`;
- blog subtitle: `Field notes on design, cities, and small routines`;
- main menu items: `Notes`, `Projects`, `Archive`, `About`;
- note title: `A quiet page for testing themes`;
- lead paragraph;
- two body paragraphs;
- one regular link;
- one visited link;
- one secondary/tag link;
- one forced hover example;
- one marked fragment;
- one quotation-style fragment;
- one text input;
- footer text with author name, email, RSS link, and engine text.

This set covers the preview states required by `SPEC.md` without adding extra content categories before the preview surface exists.

## Maintenance checklist

When preview-related code changes:

1. Compare the checked Aegea release target with the user-available Aegea source.
2. Recheck the relevant `plain` markup used by the preview.
3. Recheck the `plain` CSS-variable set used by the preview and exported themes.
4. Recheck link underline behavior for the selected Aegea target version.
5. Recheck whether the preview still covers all required states from `SPEC.md`.
6. Update this baseline when the checked Aegea release target or the preview contract changes.
