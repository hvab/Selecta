export const PALETTE_COLOR_CONTROLS = [
  { key: 'background' },
  { key: 'foreground' },
  { key: 'headings' },
  { key: 'link' },
  { key: 'linkVisited' },
  { key: 'hover' },
  { key: 'tag' },
  { key: 'engineText' },
  { key: 'active' },
  { key: 'markedTextBackground' },
  { key: 'inputBackground' },
  { key: 'inputText' },
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
