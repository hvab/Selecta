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
      folderName: '',
    }),
    {
      displayName: 'Display name is required.',
      folderName: 'Folder name is required.',
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
      folderName: 'Use lowercase letters, numbers, and hyphens only.',
    }
  );
});

test('rejects leading, trailing, and repeated folder name hyphens', () => {
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: '-my-theme' }), {
    folderName: 'Use lowercase letters, numbers, and hyphens only.',
  });
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: 'my-theme-' }), {
    folderName: 'Use lowercase letters, numbers, and hyphens only.',
  });
  assert.deepEqual(validateMetadata({ ...initialThemeState.meta, folderName: 'my--theme' }), {
    folderName: 'Use lowercase letters, numbers, and hyphens only.',
  });
});
