import { FONT_SOURCE_PLAIN } from './fonts.js';

const initialPalette = {
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
};

const initialDarkPalette = {
  background: '#202020',
  foreground: '#c0c0c0',
  headings: '#ffffff',
  link: '#0080d4',
  linkVisited: '#406090',
  hover: '#f04020',
  tag: '#c0c0c0',
  engineText: '#808080',
  admin: '#4cb26e',
  active: '#ff6440',
  markedTextBackground: '#443300',
  inputBackground: '#404040',
  inputText: '#c0c0c0',
};

export const initialThemeState = {
  meta: {
    folderName: 'my-theme',
    displayName: 'My Theme',
    basedOn: 'plain',
    supportsDarkMode: false,
    useLikelyLight: true,
  },
  palette: initialPalette,
  darkPalette: initialDarkPalette,
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
