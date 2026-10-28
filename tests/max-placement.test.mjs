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
