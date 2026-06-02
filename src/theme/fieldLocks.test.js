import test from 'node:test';
import assert from 'node:assert/strict';
import { clearAllFieldLocks, createEmptyFieldLocks, hasAnyFieldLocked } from './fieldLocks.js';

test('createEmptyFieldLocks starts unlocked', () => {
  const fieldLocks = createEmptyFieldLocks();

  assert.equal(hasAnyFieldLocked(fieldLocks), false);
});

test('clearAllFieldLocks resets every section', () => {
  const fieldLocks = createEmptyFieldLocks();

  fieldLocks.palette.background = true;
  fieldLocks.meta.displayName = true;
  clearAllFieldLocks(fieldLocks);
  assert.equal(hasAnyFieldLocked(fieldLocks), false);
});
