import assert from 'node:assert/strict';
import test from 'node:test';
import { loadState, saveState } from '../src/storage.js';

test('old installations enable the dog by default and independently retain both preferences', () => {
  let saved = JSON.stringify({ settings: { sound: false }, completed: 7 });
  globalThis.localStorage = {
    getItem: () => saved,
    setItem: (_key, value) => { saved = value; },
  };
  try {
    let state = loadState();
    assert.equal(state.settings.dogEnabled, true);
    assert.equal(state.settings.dogSound, true);
    assert.equal(state.settings.sound, false);
    assert.equal(state.completed, 7);
    for (const [dogEnabled, dogSound] of [[false, true], [true, false], [false, false]]) {
      Object.assign(state.settings, { dogEnabled, dogSound });
      saveState(state);
      state = loadState();
      assert.equal(state.settings.dogEnabled, dogEnabled);
      assert.equal(state.settings.dogSound, dogSound);
      assert.equal(state.settings.sound, false);
    }
  } finally {
    delete globalThis.localStorage;
  }
});
