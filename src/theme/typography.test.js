import test from 'node:test';
import assert from 'node:assert/strict';
import { getNoteTitleLineHeight, scalePixelSize } from './typography.js';

test('scales pixel sizes and keeps px units', () => {
  assert.equal(scalePixelSize('18px', 1.5), '27px');
  assert.equal(scalePixelSize('17px', 1.3333), '22.6661px');
});

test('derives note title line height from pixel size', () => {
  assert.equal(getNoteTitleLineHeight('27px'), '31.5px');
});
