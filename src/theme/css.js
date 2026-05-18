export function getThemeCssVariables(themeState) {
  return {
    '--backgroundColor': themeState.palette.background,
    '--foregroundColor': themeState.palette.foreground,
    '--headingsColor': themeState.palette.headings,
    '--linkColor': themeState.palette.link,
    '--linkColorVisited': themeState.palette.linkVisited,
    '--hoverColor': themeState.palette.hover,
    '--tagColor': themeState.palette.tag,
    '--engineTextColor': themeState.palette.engineText,
    '--adminColor': themeState.palette.admin,
    '--activeColor': themeState.palette.active,
    '--markedTextBackground': themeState.palette.markedTextBackground,
    '--inputBackgroundColor': themeState.palette.inputBackground,
    '--inputTextColor': themeState.palette.inputText,
    '--mainFontFamily': themeState.typography.mainFontFamily,
    '--noteMainFontFamily': themeState.typography.noteFontFamily,
    '--noteTextFontSize': themeState.typography.noteTextSize,
    '--maxWidth': themeState.layout.maxWidth,
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
