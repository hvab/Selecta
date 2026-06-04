import { FONT_SOURCE_PLAIN } from './fonts.js';

export const initialThemeState = {
  meta: {
    folderName: 'my-theme',
    displayName: 'My Theme',
    basedOn: 'plain',
    supportsDarkMode: false,
    useLikelyLight: true,
  },
  palette: {
    background: '#ffffff',
    foreground: '#111111',
    headings: '#111111',
    link: '#0066cc',
    linkVisited: '#663399',
    hover: '#cc3300',
    tag: '#666666',
    engineText: '#666666',
    admin: '#cc3300',
    active: '#cc3300',
    markedTextBackground: '#fff2a8',
    inputBackground: '#f0f0f0',
    inputText: '#111111',
  },
  typography: {
    mainFontSource: FONT_SOURCE_PLAIN,
    mainFontFamily: '',
    noteFontSource: FONT_SOURCE_PLAIN,
    noteFontFamily: '',
    noteTextSize: '18px',
    noteTextLineHeight: 1.6,
    titleScale: 1.5,
  },
  layout: {
    maxWidth: '48rem',
    margins: '2rem',
  },
};
