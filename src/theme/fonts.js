export const systemFonts = [
  {
    value: 'Arial, Helvetica, sans-serif',
    label: 'Arial',
  },
  {
    value: 'Georgia, "Times New Roman", serif',
    label: 'Georgia',
  },
  {
    value: 'Verdana, Geneva, sans-serif',
    label: 'Verdana',
  },
  {
    value: '"Trebuchet MS", Helvetica, sans-serif',
    label: 'Trebuchet MS',
  },
  {
    value: '"Times New Roman", Times, serif',
    label: 'Times New Roman',
  },
  {
    value: '"Courier New", Courier, monospace',
    label: 'Courier New',
  },
];

const fontFamilyValuePattern = /^[A-Za-z0-9 "'_,.-]+$/;

export function normalizeFontFamily(value, fallbackValue) {
  if (typeof value !== 'string') {
    return fallbackValue;
  }

  const fontFamily = value.trim().replace(/ {2,}/g, ' ');

  return fontFamily && fontFamilyValuePattern.test(fontFamily) ? fontFamily : fallbackValue;
}
