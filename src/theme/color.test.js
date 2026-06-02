import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgba, normalizeHexColor, parseHexColor } from './color.js';

test('converts full hex colors to rgba', () => {
  assert.equal(hexToRgba('#336699', 0.15), 'rgba(51, 102, 153, 0.15)');
});

test('converts short hex colors to rgba', () => {
  assert.equal(hexToRgba('#fff', 0.8), 'rgba(255, 255, 255, 0.8)');
});

test('parses short and full hex colors', () => {
  assert.deepEqual(parseHexColor('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(parseHexColor('#336699'), { r: 51, g: 102, b: 153 });
});

test('normalizes short hex to full form', () => {
  assert.equal(normalizeHexColor('#06c'), '#0066cc');
});
