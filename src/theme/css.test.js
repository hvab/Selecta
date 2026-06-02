import test from 'node:test';
import assert from 'node:assert/strict';
import { generateThemeCss, getThemeCssVariables } from './css.js';
import { initialThemeState } from './model.js';

test('derives shared plain color variables from theme palette', () => {
  assert.deepEqual(getThemeCssVariables(initialThemeState), {
    '--backgroundColor': '#ffffff',
    '--backgroundTransparentColor': 'rgba(255, 255, 255, 0.8)',
    '--foregroundColor': '#111111',
    '--thinRuleColor': 'rgba(17, 17, 17, 0.15)',
    '--headingsColor': '#111111',
    '--headingsUnderlineColor': 'rgba(17, 17, 17, 0.15)',
    '--boldColor': '#111111',
    '--boldUnderlineColor': 'rgba(17, 17, 17, 0.15)',
    '--linkColor': '#0066cc',
    '--linkUnderlineColor': 'rgba(0, 102, 204, 0.15)',
    '--linkColorVisited': '#663399',
    '--linkUnderlineColorVisited': 'rgba(102, 51, 153, 0.15)',
    '--hoverColor': '#cc3300',
    '--hoverUnderlineColor': 'rgba(204, 51, 0, 0.15)',
    '--tagColor': '#666666',
    '--tagUnderlineColor': 'rgba(102, 102, 102, 0.15)',
    '--engineTextColor': '#666666',
    '--engineTextUnderlineColor': 'rgba(102, 102, 102, 0.15)',
    '--adminColor': '#cc3300',
    '--adminUnderlineColor': 'rgba(204, 51, 0, 0.15)',
    '--activeColor': '#cc3300',
    '--markedTextBackground': '#fff2a8',
    '--inputBackgroundColor': '#f0f0f0',
    '--inputTextColor': '#111111',
    '--mainFontFamily': 'Arial, Helvetica, sans-serif',
    '--noteMainFontFamily': 'Georgia, "Times New Roman", serif',
    '--noteTitleFontSize': '27px',
    '--noteTitleLineHeight': '31.5px',
    '--noteTextFontSize': '18px',
    '--noteTextLineHeight': 1.6,
    '--maxWidth': '48rem',
    '--marginLeft': '2rem',
    '--marginRight': '2rem',
  });
});

test('keeps custom font stacks and falls back from unsafe font-family values', () => {
  const themeState = structuredClone(initialThemeState);

  themeState.typography.mainFontFamily = 'Aptos, "Segoe UI", system-ui, sans-serif';
  themeState.typography.noteFontFamily = 'Georgia;\nbody { color: red }';

  assert.equal(getThemeCssVariables(themeState)['--mainFontFamily'], 'Aptos, "Segoe UI", system-ui, sans-serif');
  assert.equal(getThemeCssVariables(themeState)['--noteMainFontFamily'], 'Georgia, "Times New Roman", serif');
  assert.equal(generateThemeCss(themeState).includes('body { color: red }'), false);

  themeState.typography.mainFontFamily = undefined;
  themeState.typography.noteFontFamily = null;

  assert.equal(getThemeCssVariables(themeState)['--mainFontFamily'], 'Arial, Helvetica, sans-serif');
  assert.equal(getThemeCssVariables(themeState)['--noteMainFontFamily'], 'Georgia, "Times New Roman", serif');

  themeState.typography.mainFontFamily = '   ';

  assert.equal(getThemeCssVariables(themeState)['--mainFontFamily'], 'Arial, Helvetica, sans-serif');
});
