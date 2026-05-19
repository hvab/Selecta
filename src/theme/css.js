import { hexToRgba } from './color.js';
import { getNoteTitleLineHeight, scalePixelSize } from './typography.js';

export function getThemeCssVariables(themeState) {
  const noteTitleFontSize = scalePixelSize(themeState.typography.noteTextSize, themeState.typography.titleScale);

  return {
    '--backgroundColor': themeState.palette.background,
    '--backgroundTransparentColor': hexToRgba(themeState.palette.background, 0.8),
    '--foregroundColor': themeState.palette.foreground,
    '--thinRuleColor': hexToRgba(themeState.palette.foreground, 0.15),
    '--headingsColor': themeState.palette.headings,
    '--headingsUnderlineColor': hexToRgba(themeState.palette.headings, 0.15),
    '--boldColor': themeState.palette.headings,
    '--boldUnderlineColor': hexToRgba(themeState.palette.headings, 0.15),
    '--linkColor': themeState.palette.link,
    '--linkUnderlineColor': hexToRgba(themeState.palette.link, 0.15),
    '--linkColorVisited': themeState.palette.linkVisited,
    '--linkUnderlineColorVisited': hexToRgba(themeState.palette.linkVisited, 0.15),
    '--hoverColor': themeState.palette.hover,
    '--hoverUnderlineColor': hexToRgba(themeState.palette.hover, 0.15),
    '--tagColor': themeState.palette.tag,
    '--tagUnderlineColor': hexToRgba(themeState.palette.tag, 0.15),
    '--engineTextColor': themeState.palette.engineText,
    '--engineTextUnderlineColor': hexToRgba(themeState.palette.engineText, 0.15),
    '--adminColor': themeState.palette.admin,
    '--adminUnderlineColor': hexToRgba(themeState.palette.admin, 0.15),
    '--activeColor': themeState.palette.active,
    '--markedTextBackground': themeState.palette.markedTextBackground,
    '--inputBackgroundColor': themeState.palette.inputBackground,
    '--inputTextColor': themeState.palette.inputText,
    '--mainFontFamily': themeState.typography.mainFontFamily,
    '--noteMainFontFamily': themeState.typography.noteFontFamily,
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
  return `:root {
${Object.entries(getThemeCssVariables(themeState))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
`;
}
