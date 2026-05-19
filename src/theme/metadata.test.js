import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFolderName, suggestFolderName } from './metadata.js';

test('normalizes folder name from user input', () => {
  assert.equal(normalizeFolderName(' my-theme '), 'my-theme');
});

test('suggests folder name from display name', () => {
  assert.equal(suggestFolderName('My Theme'), 'my-theme');
  assert.equal(suggestFolderName("O'Neil's Theme"), 'oneils-theme');
  assert.equal(suggestFolderName(' Café Selecta 2026 '), 'cafe-selecta-2026');
});

test('returns empty folder name suggestion for blank display name', () => {
  assert.equal(suggestFolderName('   '), '');
});

test('returns empty folder name suggestion for non-latin input', () => {
  assert.equal(suggestFolderName('Блог'), '');
});
