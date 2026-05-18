function escapePhpSingleQuotedString(value) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

export function generateThemeInfo(themeState) {
  const useLikelyLight = themeState.meta.useLikelyLight ? "  'use_likely_light' => true,\n" : '';

  return `<?php return [

  'display_name' => '${escapePhpSingleQuotedString(themeState.meta.displayName)}',

  'colors' => [
    'background' => '${escapePhpSingleQuotedString(themeState.palette.background)}',
    'headings' => '${escapePhpSingleQuotedString(themeState.palette.headings)}',
    'text' => '${escapePhpSingleQuotedString(themeState.palette.foreground)}',
    'link' => '${escapePhpSingleQuotedString(themeState.palette.link)}',
  ],

  'based_on' => '${escapePhpSingleQuotedString(themeState.meta.basedOn)}',
  'meta_viewport' => 'width=device-width, initial-scale=1',
  'supports_dark_mode' => ${themeState.meta.supportsDarkMode},
${useLikelyLight}
]; ?>
`;
}
