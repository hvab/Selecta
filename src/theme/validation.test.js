import test from 'node:test';
import assert from 'node:assert/strict';
import { initialThemeState } from './model.js';
import { validateMetadata } from './validation.js';

test('accepts valid theme metadata', () => {
  assert.deepEqual(validateMetadata(initialThemeState.meta), {});
});

test('requires display name and folder name', () => {
  assert.deepEqual(
    validateMetadata({
      ...initialThemeState.meta,
      displayName: ' ',
      folderName: '  ',
    }),
    {
      displayName: 'displayNameRequired',
      folderName: 'folderNameRequired',
    }
  );
});

test('rejects invalid folder name characters', () => {
  assert.deepEqual(
    validateMetadata({
      ...initialThemeState.meta,
      folderName: 'My Theme',
    }),
    {
      folderName: 'folderNameInvalid',
    }
  );
});

test('rejects leading, trailing, and repeated folder name hyphens', () => {
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: '-my-theme' }), {
    folderName: 'folderNameInvalid',
  });
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: 'my-theme-' }), {
    folderName: 'folderNameInvalid',
  });
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: 'my--theme' }), {
    folderName: 'folderNameInvalid',
  });
});
