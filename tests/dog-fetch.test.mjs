import assert from 'node:assert/strict';
import test from 'node:test';
import { planDogFetch } from '../src/dog-fetch.js';
import { isDogPathFree } from '../src/dog-movement.js';

const viewport = { width: 600, height: 500 };
const origin = { x: 20, y: 20 };
const landing = { x: 450, y: 300 };

test('a fetch round has a safe route there and back to the exact starting point', () => {
  const obstacles = [{ left: 220, right: 260, top: 0, bottom: 280 }];
  const plan = planDogFetch(origin, landing, viewport, obstacles);
  assert.ok(plan);
  assert.deepEqual(plan.inbound.at(-1), origin);
  assert.deepEqual(plan.outbound.at(-1), plan.seat);
  for (const [start, route] of [[origin, plan.outbound], [plan.seat, plan.inbound]]) {
    let previous = start;
    for (const point of route) {
      assert.ok(isDogPathFree(previous, point, viewport, obstacles));
      previous = point;
    }
  }
});

test('reject throws on controls, beyond screen edges, too close, or across an unreachable barrier', () => {
  assert.equal(planDogFetch(origin, { x: 40, y: 52 }, viewport, []), null);
  assert.equal(planDogFetch(origin, { x: 580, y: 400 }, viewport, []), null);
  assert.equal(planDogFetch(origin, landing, viewport, [{ left: 440, right: 510, top: 290, bottom: 360 }]), null);
  assert.equal(planDogFetch(origin, landing, viewport, [{ left: 220, right: 260, top: 0, bottom: 500 }]), null);
});
