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
    assert.equal(state.settings.dogVolume, 100);
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

test('dog volume persists and clamps old or invalid values without changing alarm preferences', () => {
  let saved;
  globalThis.localStorage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
  try {
    for (const [input, expected] of [[25, 25], [0, 0], [100, 100], [-10, 0], [150, 100], ['invalid', 100]]) {
      saved = JSON.stringify({ settings: { dogVolume: input, sound: false } });
      let state = loadState();
      assert.equal(state.settings.dogVolume, expected);
      saveState(state);
      state = loadState();
      assert.equal(state.settings.dogVolume, expected);
      assert.equal(state.settings.sound, false);
    }
  } finally { delete globalThis.localStorage; }
});
