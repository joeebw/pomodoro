import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeDogProgress, rewardDogSession, consumeDogMeal, dogGrowth } from '../src/dog-progress.js';
import { loadState, saveState } from '../src/storage.js';

test('companion starts as a puppy and old completed totals do not grant meals', () => {
  let saved = JSON.stringify({ completed: 900, settings: {} });
  globalThis.localStorage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
  try {
    const state = loadState();
    assert.deepEqual(state.dog, { sessions: 0, meals: 0 });
    assert.equal(dogGrowth(state.dog).scale, .62);
    state.dog = rewardDogSession(state.dog);
    saveState(state);
    assert.deepEqual(loadState().dog, { sessions: 1, meals: 1 });
    state.dog = consumeDogMeal(state.dog);
    state.completed = 0;
    state.sessionsToday = 0;
    state.championship = null;
    saveState(state);
    assert.deepEqual(loadState().dog, { sessions: 1, meals: 0 });
  } finally { delete globalThis.localStorage; }
});

test('growth never shrinks on feeding and is capped at adult size', () => {
  let progress = normalizeDogProgress(null);
  for (let i = 0; i < 80; i++) {
    const before = dogGrowth(progress).scale;
    progress = rewardDogSession(progress);
    assert.ok(dogGrowth(progress).scale >= before);
  }
  assert.equal(dogGrowth(progress).scale, 1);
  assert.equal(dogGrowth(progress).stage, 'Adulto');
  assert.equal(dogGrowth(consumeDogMeal(progress)).scale, 1);
  assert.deepEqual(consumeDogMeal({ sessions: 1, meals: 0 }), { sessions: 1, meals: 0 });
  assert.deepEqual(normalizeDogProgress({ sessions: -1, meals: Infinity }), { sessions: 0, meals: 0 });
  assert.deepEqual(normalizeDogProgress({ sessions: 2, meals: 100 }), { sessions: 2, meals: 2 });
});
