import { hexToRgba } from './color.js';
import { FONT_SOURCE_GOOGLE, SERIF_FONT_STACK, UI_FONT_STACK, getFontFamilyCssValue } from './fonts.js';
import { findGoogleFont, getGoogleFontFamilyCssValue, getSelectedGoogleFontsCss2Url } from './googleFonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import { getNoteTitleLineHeight, scalePixelSize } from './typography.js';

function getThemeFontFamilyCssValue(source, value, fallbackValue) {
  const googleFont = source === FONT_SOURCE_GOOGLE ? findGoogleFont(googleFontsCatalog, value) : null;

  if (source === FONT_SOURCE_GOOGLE) {
    return googleFont ? getGoogleFontFamilyCssValue(googleFont) : null;
  }

  return getFontFamilyCssValue(source, value, fallbackValue);
}

function getPaletteCssVariables(palette) {
  return {
    '--backgroundColor': palette.background,
    '--backgroundTransparentColor': hexToRgba(palette.background, 0.8),
    '--foregroundColor': palette.foreground,
    '--thinRuleColor': hexToRgba(palette.foreground, 0.15),
    '--headingsColor': palette.headings,
    '--headingsUnderlineColor': hexToRgba(palette.headings, 0.15),
    '--boldColor': palette.headings,
    '--boldUnderlineColor': hexToRgba(palette.headings, 0.15),
    '--linkColor': palette.link,
    '--linkUnderlineColor': hexToRgba(palette.link, 0.15),
    '--linkColorVisited': palette.linkVisited,
    '--linkUnderlineColorVisited': hexToRgba(palette.linkVisited, 0.15),
    '--hoverColor': palette.hover,
    '--hoverUnderlineColor': hexToRgba(palette.hover, 0.15),
    '--tagColor': palette.tag,
    '--tagUnderlineColor': hexToRgba(palette.tag, 0.15),
    '--engineTextColor': palette.engineText,
    '--engineTextUnderlineColor': hexToRgba(palette.engineText, 0.15),
    '--adminColor': palette.admin,
    '--adminUnderlineColor': hexToRgba(palette.admin, 0.15),
    '--activeColor': palette.active,
    '--markedTextBackground': palette.markedTextBackground,
    '--markedImageBorderColor': palette.markedTextBackground,
    '--inputBackgroundColor': palette.inputBackground,
    '--inputTextColor': palette.inputText,
  };
}

function formatCssVariables(variables, indentation = '  ') {
  return Object.entries(variables)
    .map(([name, value]) => `${indentation}${name}: ${value};`)
    .join('\n');
}

export function getThemeCssVariables(themeState) {
  const noteTitleFontSize = scalePixelSize(themeState.typography.noteTextSize, themeState.typography.titleScale);
  const mainFontFamily = getThemeFontFamilyCssValue(
    themeState.typography.mainFontSource,
    themeState.typography.mainFontFamily,
    UI_FONT_STACK
  );
  const noteFontFamily = getThemeFontFamilyCssValue(
    themeState.typography.noteFontSource,
    themeState.typography.noteFontFamily,
    SERIF_FONT_STACK
  );

  return {
    ...getPaletteCssVariables(themeState.palette),
    ...(mainFontFamily ? { '--mainFontFamily': mainFontFamily } : {}),
    ...(noteFontFamily ? { '--noteMainFontFamily': noteFontFamily } : {}),
    '--noteTitleFontSize': noteTitleFontSize,
    '--noteTitleLineHeight': getNoteTitleLineHeight(noteTitleFontSize),
    '--noteTextFontSize': themeState.typography.noteTextSize,
    '--noteTextLineHeight': themeState.typography.noteTextLineHeight,
    '--maxWidth': themeState.layout.maxWidth,
    '--marginLeft': themeState.layout.margins,
    '--marginRight': themeState.layout.margins,
  };
}

export function generateThemeCss(themeState) {
  const googleFontsImportUrl = getSelectedGoogleFontsCss2Url(googleFontsCatalog, themeState.typography);
  const googleFontsImport = googleFontsImportUrl ? `@import url("${googleFontsImportUrl}");\n\n` : '';
  const darkModeCss = themeState.meta.supportsDarkMode
    ? `
@media (prefers-color-scheme: dark) {
  :root .e2-responds-to-dark-mode {
${formatCssVariables(getPaletteCssVariables(themeState.darkPalette), '    ')}
  }
}
`
    : '';

  return `${googleFontsImport}:root {
${formatCssVariables(getThemeCssVariables(themeState))}
}
${darkModeCss}`;
}
