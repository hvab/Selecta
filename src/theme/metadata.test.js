import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestFolderName } from './metadata.js';

test('suggests folder name from display name', () => {
  assert.equal(suggestFolderName('My Theme'), 'my-theme');
  assert.equal(suggestFolderName("O'Neil's Theme"), 'oneils-theme');
  assert.equal(suggestFolderName(' Café Selecta 2026 '), 'cafe-selecta-2026');
});

test('returns empty folder name suggestion for blank display name', () => {
  assert.equal(suggestFolderName('   '), '');
});
