export const PALETTE_COLOR_CONTROLS = [
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Text' },
  { key: 'headings', label: 'Headings' },
  { key: 'link', label: 'Links' },
  { key: 'linkVisited', label: 'Visited links' },
  { key: 'hover', label: 'Hover' },
  { key: 'tag', label: 'Tags' },
  { key: 'engineText', label: 'Secondary text' },
  { key: 'active', label: 'Active navigation' },
  { key: 'markedTextBackground', label: 'Marked text' },
  { key: 'inputBackground', label: 'Input background' },
  { key: 'inputText', label: 'Input text' },
];

export const PALETTE_LOCK_KEYS = PALETTE_COLOR_CONTROLS.map(({ key }) => key);

export const META_LOCK_KEYS = ['displayName', 'folderName'];

export const TYPOGRAPHY_LOCK_KEYS = [
  'mainFontFamily',
  'noteFontFamily',
  'noteTextSize',
  'noteTextLineHeight',
  'titleScale',
];

export const LAYOUT_LOCK_KEYS = ['maxWidth', 'margins'];

function createSectionLocks(keys) {
  return Object.fromEntries(keys.map((key) => [key, false]));
}

export function createEmptyFieldLocks() {
  return {
    meta: createSectionLocks(META_LOCK_KEYS),
    palette: createSectionLocks(PALETTE_LOCK_KEYS),
    typography: createSectionLocks(TYPOGRAPHY_LOCK_KEYS),
    layout: createSectionLocks(LAYOUT_LOCK_KEYS),
  };
}

export function clearAllFieldLocks(fieldLocks) {
  for (const section of Object.values(fieldLocks)) {
    for (const key of Object.keys(section)) {
      section[key] = false;
    }
  }
}

export function hasAnyFieldLocked(fieldLocks) {
  return Object.values(fieldLocks).some((section) => Object.values(section).some(Boolean));
}
