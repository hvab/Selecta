# Preview baseline

## Checked Aegea source

- Commit: `deb13007265d551ec51d9a25cfc514a2102ec65a`
- Baseline theme: `system/themes/plain`

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

1. Compare the checked Aegea commit with the current Aegea source.
2. Recheck the relevant `plain` markup used by the preview.
3. Recheck the `plain` CSS-variable set used by the preview and exported themes.
4. Recheck whether the preview still covers all required states from `SPEC.md`.
5. Update this baseline when the checked Aegea commit or the preview contract changes.
