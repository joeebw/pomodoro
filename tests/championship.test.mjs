import assert from 'node:assert/strict';
import test from 'node:test';
import { completeChampionshipStep, undoChampionshipStep, resetChampionshipCycle } from '../src/championship.js';

test('a manual step can win and undo a belt for every supported cycle length', () => {
  for (let target = 2; target <= 8; target++) {
    const before = { steps: target - 1, target, belts: 3, victorySize: 0 };
    const { championship: won } = completeChampionshipStep(before, target);
    assert.equal(won.belts, 4);
    assert.deepEqual(undoChampionshipStep(won), before);
  }
});

test('undo uses the recent victory size when the next cycle has a different size', () => {
  const before = { steps: 3, target: 4, belts: 0, victorySize: 0 };
  const { championship: won } = completeChampionshipStep(before, 6);
  assert.equal(won.target, 6);
  assert.deepEqual(undoChampionshipStep(won), before);
});

test('undo after resetting a cycle uses its current size and never produces negative progress', () => {
  const reset = resetChampionshipCycle({ steps: 2, target: 4, belts: 1, victorySize: 0 }, 6);
  assert.deepEqual(undoChampionshipStep(reset), { steps: 5, target: 6, belts: 0, victorySize: 0 });
  let progress = resetChampionshipCycle(reset, 6);
  for (let i = 0; i < 20; i++) progress = undoChampionshipStep(progress);
  assert.deepEqual(progress, { steps: 0, target: 6, belts: 0, victorySize: 0 });
});

test('undoing an ordinary step leaves belt totals and cycle size intact', () => {
  assert.deepEqual(undoChampionshipStep({ steps: 2, target: 4, belts: 5, victorySize: 0 }), {
    steps: 1, target: 4, belts: 5, victorySize: 0,
  });
});
