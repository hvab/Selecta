import assert from 'node:assert/strict';
import test from 'node:test';
import { constrainControlsPaneWidth, getControlsPaneMaxWidth } from './panelLayout.js';

test('reserves the divider and preview budget at the current workspace width', () => {
  assert.equal(getControlsPaneMaxWidth(1280, 8), 672);
  assert.equal(getControlsPaneMaxWidth(768, 8), 400);
  assert.equal(getControlsPaneMaxWidth(768, 16), 392);
  assert.equal(getControlsPaneMaxWidth(768.5, 8.25), 400.25);
  assert.equal(getControlsPaneMaxWidth(688, 8), 320);
});

test('keeps the existing controls minimum when both pane minima cannot fit', () => {
  assert.equal(getControlsPaneMaxWidth(687, 8), 320);
  assert.equal(getControlsPaneMaxWidth(641, 8), 320);
  assert.equal(getControlsPaneMaxWidth(375, 0), 320);
});

test('clamps pointer, keyboard, and restored widths to the same limits', () => {
  const maximum = getControlsPaneMaxWidth(768, 8);

  assert.equal(constrainControlsPaneWidth(672, maximum), 400);
  assert.equal(constrainControlsPaneWidth(400 + 16, maximum), 400);
  assert.equal(constrainControlsPaneWidth(320 - 16, maximum), 320);
  assert.equal(constrainControlsPaneWidth(-10, maximum), 320);
  assert.equal(constrainControlsPaneWidth(376, maximum), 376);
  assert.equal(constrainControlsPaneWidth(1000), 672);
});
