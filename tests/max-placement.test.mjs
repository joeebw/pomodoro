import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestedPlacement } from '../src/max-placement.js';

test('suggestions include narrow mobile margins and never accept an unreachable point', () => {
  const valid = (p) => p.x === 8 && p.y > 200 && p.y < 400;
  assert.ok(valid(suggestedPlacement(320, 800, valid)));
  assert.equal(suggestedPlacement(320, 800, () => false), null);
  const edge = suggestedPlacement(390, 900, (p) => p.x === 338 && p.y === 848);
  assert.deepEqual(edge, { x: 338, y: 848 });
});

test('suggestions also find narrow reachable gaps between mobile controls', () => {
  assert.deepEqual(suggestedPlacement(320, 800, ({ x, y }) => x >= 15 && x <= 23 && y >= 55 && y <= 63), { x: 16, y: 56 });
});
