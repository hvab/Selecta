import postcss from 'postcss';
import { THEME_VALUE_CONSTRAINTS } from './constraints.js';
import { FONT_SOURCE_GOOGLE, FONT_SOURCE_PLAIN, FONT_SOURCE_SYSTEM, normalizeFontFamily } from './fonts.js';
import { googleFontsCatalog } from './googleFontsCatalog.js';
import { scalePixelSize } from './typography.js';

const paletteVariables = {
  '--backgroundColor': 'background',
  '--foregroundColor': 'foreground',
  '--headingsColor': 'headings',
  '--linkColor': 'link',
  '--linkColorVisited': 'linkVisited',
  '--hoverColor': 'hover',
  '--tagColor': 'tag',
  '--engineTextColor': 'engineText',
  '--adminColor': 'admin',
  '--activeColor': 'active',
  '--markedTextBackground': 'markedTextBackground',
  '--inputBackgroundColor': 'inputBackground',
  '--inputTextColor': 'inputText',
};

const knownVariables = new Set([
  ...Object.keys(paletteVariables),
  '--backgroundTransparentColor',
  '--thinRuleColor',
  '--headingsUnderlineColor',
  '--boldColor',
  '--boldUnderlineColor',
  '--linkUnderlineColor',
  '--linkUnderlineColorVisited',
  '--hoverUnderlineColor',
  '--tagUnderlineColor',
  '--engineTextUnderlineColor',
  '--adminUnderlineColor',
  '--markedImageBorderColor',
  '--mainFontFamily',
  '--noteMainFontFamily',
  '--noteTitleFontSize',
  '--noteTitleLineHeight',
  '--noteTextFontSize',
  '--noteTextLineHeight',
  '--maxWidth',
  '--marginLeft',
  '--marginRight',
]);

const namedColors = {
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  white: '#ffffff',
  maroon: '#800000',
  red: '#ff0000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  green: '#008000',
  lime: '#00ff00',
  olive: '#808000',
  yellow: '#ffff00',
  navy: '#000080',
  blue: '#0000ff',
  teal: '#008080',
  aqua: '#00ffff',
  rebeccapurple: '#663399',
};

function parseNumber(value) {
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) ? Number(value) : null;
}

function parseColorChannel(value) {
  const channel = parseNumber(value.endsWith('%') ? value.slice(0, -1) : value);

  return channel !== null && channel >= 0 && channel <= (value.endsWith('%') ? 100 : 255)
    ? Math.round(value.endsWith('%') ? (channel * 255) / 100 : channel)
    : null;
}

function isOpaqueAlpha(value) {
  return value.endsWith('%') ? parseNumber(value.slice(0, -1)) === 100 : parseNumber(value) === 1;
}

export function parseThemeColor(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const color = value.trim().toLowerCase();

  if (Object.hasOwn(namedColors, color)) {
    return namedColors[color];
  }

  if (/^#[\da-f]{3}$/.test(color)) {
    return `#${[...color.slice(1)].map((channel) => channel.repeat(2)).join('')}`;
  }

  if (/^#[\da-f]{6}$/.test(color)) {
    return color;
  }

  const rgb = /^rgba?\(([^()]*)\)$/.exec(color);

  if (!rgb) {
    return null;
  }

  const commaSyntax = rgb[1].includes(',');
  const parts = commaSyntax ? rgb[1].split(',').map((part) => part.trim()) : rgb[1].split('/');
  const channels = commaSyntax ? parts.slice(0, 3) : parts[0].trim().split(/\s+/);
  const alpha = commaSyntax ? parts[3] : parts[1]?.trim();

  if (
    (commaSyntax ? parts.length < 3 || parts.length > 4 : parts.length > 2) ||
    channels.length !== 3 ||
    (alpha !== undefined && !isOpaqueAlpha(alpha)) ||
    (commaSyntax &&
      channels.some((channel) => channel.endsWith('%')) &&
      !channels.every((channel) => channel.endsWith('%')))
  ) {
    return null;
  }

  const parsedChannels = channels.map(parseColorChannel);

  return parsedChannels.every((channel) => channel !== null)
    ? `#${parsedChannels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
    : null;
}

function collectDeclarations(rule, declarations) {
  for (const node of rule.nodes) {
    if (
      node.type === 'decl' &&
      knownVariables.has(node.prop) &&
      (!declarations.has(node.prop) || node.important || !declarations.get(node.prop).important)
    ) {
      declarations.set(node.prop, { value: node.value.trim(), important: Boolean(node.important) });
    }
  }
}

function resolveVariable(name, declarations, fallbackDeclarations = null, seen = new Set()) {
  if (seen.has(name) || !knownVariables.has(name)) {
    return null;
  }

  if (!declarations.has(name)) {
    return fallbackDeclarations ? resolveVariable(name, fallbackDeclarations, null, seen) : null;
  }

  const value = declarations.get(name).value;
  const reference = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);

  return reference
    ? resolveVariable(reference[1], declarations, fallbackDeclarations, new Set([...seen, name]))
    : value;
}

function getImportedGoogleFamilies(root) {
  const families = new Set();

  for (const node of root.nodes) {
    if (node.type === 'comment' || (node.type === 'atrule' && node.name.toLowerCase() === 'charset')) {
      continue;
    }

    if (node.type !== 'atrule' || node.name.toLowerCase() !== 'import') {
      break;
    }

    const importedUrl = /^(?:url\(\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\s"'()]+))\s*\)|"([^"\n]+)"|'([^'\n]+)')$/i.exec(
      node.params.trim()
    );

    if (!importedUrl) {
      continue;
    }

    try {
      const url = new URL(importedUrl.slice(1).find(Boolean));

      if (url.origin === 'https://fonts.googleapis.com' && url.pathname === '/css2' && !url.username && !url.password) {
        for (const family of url.searchParams.getAll('family')) {
          families.add(family.split(':')[0].trim().toLowerCase());
        }
      }
    } catch {
      // Imported URLs are inspected as text and never loaded.
    }
  }

  return families;
}

function applyFont(typography, prefix, variableName, declarations, importedFamilies) {
  if (!declarations.has(variableName)) {
    typography[`${prefix}FontSource`] = FONT_SOURCE_PLAIN;
    typography[`${prefix}FontFamily`] = '';
    return false;
  }

  const value = resolveVariable(variableName, declarations);

  if (value === null) {
    return false;
  }

  if (/^(inherit|initial|unset|revert|revert-layer)$/i.test(value)) {
    typography[`${prefix}FontSource`] = FONT_SOURCE_PLAIN;
    typography[`${prefix}FontFamily`] = '';
    return true;
  }

  const family = normalizeFontFamily(value, '');

  if (!family) {
    return false;
  }

  const firstFamily = family
    .split(',')[0]
    .trim()
    .replace(/^["']|["']$/g, '')
    .toLowerCase();
  const googleFont = googleFontsCatalog.find((font) => font.family.toLowerCase() === firstFamily);

  if (googleFont && importedFamilies.has(firstFamily)) {
    typography[`${prefix}FontSource`] = FONT_SOURCE_GOOGLE;
    typography[`${prefix}FontFamily`] = googleFont.family;
  } else {
    typography[`${prefix}FontSource`] = FONT_SOURCE_SYSTEM;
    typography[`${prefix}FontFamily`] = family;
  }

  return true;
}

function parseConstrainedValue(value, constraint) {
  if (value === null) {
    return null;
  }

  const length = constraint.unit ? /^(\+?(?:\d+(?:\.\d*)?|\.\d+))(px|rem)$/i.exec(value) : null;
  const number = constraint.unit
    ? length && length[2].toLowerCase() === constraint.unit
      ? Number(length[1])
      : null
    : parseNumber(value);

  return number !== null && number >= constraint.min && number <= constraint.max
    ? constraint.unit
      ? `${number}${constraint.unit}`
      : number
    : null;
}

function applyPalette(palette, declarations, fallbackDeclarations = null) {
  let recognized = false;

  for (const [variable, field] of Object.entries(paletteVariables)) {
    if (!declarations.has(variable)) {
      continue;
    }

    const color = parseThemeColor(resolveVariable(variable, declarations, fallbackDeclarations));

    if (color !== null) {
      palette[field] = color;
      recognized = true;
    }
  }

  return recognized;
}

// False means no supported value was found. Successfully parsed CSS still
// clears absent font overrides so JSON cannot restore a deleted override.
export function applyThemeCss(themeState, source) {
  if (typeof source !== 'string') {
    return false;
  }

  let root;

  try {
    root = postcss.parse(source);
  } catch {
    return false;
  }

  const lightDeclarations = new Map();
  const darkDeclarations = new Map();

  for (const node of root.nodes) {
    if (node.type === 'rule' && node.selector.trim() === ':root') {
      collectDeclarations(node, lightDeclarations);
    } else if (
      node.type === 'atrule' &&
      node.name.toLowerCase() === 'media' &&
      /^\(\s*prefers-color-scheme\s*:\s*dark\s*\)$/i.test(node.params.trim())
    ) {
      for (const rule of node.nodes ?? []) {
        if (rule.type === 'rule' && /^:root\s+\.e2-responds-to-dark-mode$/.test(rule.selector.trim())) {
          collectDeclarations(rule, darkDeclarations);
        }
      }
    }
  }

  let recognized = applyPalette(themeState.palette, lightDeclarations);
  recognized = applyPalette(themeState.darkPalette, darkDeclarations, lightDeclarations) || recognized;
  const importedFamilies = getImportedGoogleFamilies(root);
  recognized =
    applyFont(themeState.typography, 'main', '--mainFontFamily', lightDeclarations, importedFamilies) || recognized;
  recognized =
    applyFont(themeState.typography, 'note', '--noteMainFontFamily', lightDeclarations, importedFamilies) || recognized;

  for (const [section, field, variable] of [
    ['typography', 'noteTextSize', '--noteTextFontSize'],
    ['typography', 'noteTextLineHeight', '--noteTextLineHeight'],
    ['layout', 'maxWidth', '--maxWidth'],
  ]) {
    const value = parseConstrainedValue(
      resolveVariable(variable, lightDeclarations),
      THEME_VALUE_CONSTRAINTS[section][field]
    );

    if (value !== null) {
      themeState[section][field] = value;
      recognized = true;
    }
  }

  const leftMargin = parseConstrainedValue(
    resolveVariable('--marginLeft', lightDeclarations),
    THEME_VALUE_CONSTRAINTS.layout.margins
  );
  const rightMargin = parseConstrainedValue(
    resolveVariable('--marginRight', lightDeclarations),
    THEME_VALUE_CONSTRAINTS.layout.margins
  );

  if (leftMargin !== null && leftMargin === rightMargin) {
    themeState.layout.margins = leftMargin;
    recognized = true;
  }

  const titleSize = resolveVariable('--noteTitleFontSize', lightDeclarations);

  if (titleSize !== null && /^\+?(?:\d+(?:\.\d*)?|\.\d+)px$/i.test(titleSize)) {
    const titleScale = Number.parseFloat(titleSize) / Number.parseFloat(themeState.typography.noteTextSize);
    const scaleConstraint = THEME_VALUE_CONSTRAINTS.typography.titleScale;

    if (
      Number.parseFloat(scalePixelSize(themeState.typography.noteTextSize, themeState.typography.titleScale)) ===
      Number.parseFloat(titleSize)
    ) {
      recognized = true;
    } else if (titleScale >= scaleConstraint.min && titleScale <= scaleConstraint.max) {
      themeState.typography.titleScale = titleScale;
      recognized = true;
    } else {
      for (const boundary of [scaleConstraint.min, scaleConstraint.max]) {
        if (
          Number.parseFloat(scalePixelSize(themeState.typography.noteTextSize, boundary)) ===
          Number.parseFloat(titleSize)
        ) {
          themeState.typography.titleScale = boundary;
          recognized = true;
          break;
        }
      }
    }
  }

  return recognized;
}
