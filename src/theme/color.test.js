import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgba } from './color.js';

test('converts full hex colors to rgba', () => {
  assert.equal(hexToRgba('#336699', 0.15), 'rgba(51, 102, 153, 0.15)');
});

test('converts short hex colors to rgba', () => {
  assert.equal(hexToRgba('#fff', 0.8), 'rgba(255, 255, 255, 0.8)');
});
