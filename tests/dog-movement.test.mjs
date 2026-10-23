import assert from 'node:assert/strict';
import test from 'node:test';
import { DOG_SIZE, dogSpots, isDogSpotFree, isDogPathFree, findDogRoute } from '../src/dog-movement.js';

test('the entire dog stays within the viewport and outside padded controls', () => {
  const viewport = { width: 320, height: 740 };
  const obstacles = [{ left: 100, right: 200, top: 200, bottom: 245 }];
  assert.equal(isDogSpotFree({ x: 8, y: 8 }, viewport, obstacles), true);
  for (const point of [{ x: -1, y: 8 }, { x: 260, y: 8 }, { x: 8, y: 700 }, { x: 50, y: 150 }]) {
    assert.equal(isDogSpotFree(point, viewport, obstacles), false);
  }
  assert.equal(isDogSpotFree({ x: 100 - DOG_SIZE.width - 4, y: 200 }, viewport, obstacles), true);
});

test('a multi-segment route goes around a barrier without cutting through controls', () => {
  const viewport = { width: 500, height: 500 };
  const obstacles = [{ left: 200, right: 240, top: 50, bottom: 300 }];
  const from = { x: 8, y: 100 }, to = { x: 400, y: 100 };
  const route = findDogRoute(from, to, viewport, obstacles);
  assert.ok(route && route.length > 1);
  assert.deepEqual(route.at(-1), to);
  let previous = from;
  for (const next of route) {
    assert.ok(isDogPathFree(previous, next, viewport, obstacles));
    previous = next;
  }
  assert.ok(route.some((point) => point.y >= 304));
});

test('unreachable food locations have no route, rather than movement into the barrier', () => {
  const viewport = { width: 500, height: 500 };
  const obstacles = [{ left: 200, right: 240, top: 0, bottom: 500 }];
  assert.equal(findDogRoute({ x: 8, y: 100 }, { x: 400, y: 100 }, viewport, obstacles), null);
});

test('safe endpoints cannot produce a route through an intervening control', () => {
  const viewport = { width: 500, height: 500 };
  const obstacle = [{ left: 200, right: 240, top: 50, bottom: 400 }];
  const from = { x: 8, y: 100 };
  const to = { x: 400, y: 100 };
  assert.ok(isDogSpotFree(from, viewport, obstacle));
  assert.ok(isDogSpotFree(to, viewport, obstacle));
  assert.equal(isDogPathFree(from, to, viewport, obstacle), false);
  assert.equal(isDogPathFree(from, { x: 8, y: 300 }, viewport, obstacle), true);
});

test('candidate positions include screen edges and interior points across viewport sizes', () => {
  for (const viewport of [{ width: 320, height: 740 }, { width: 1280, height: 900 }]) {
    const spots = dogSpots(viewport, () => .5);
    assert.ok(spots.every((point) => isDogSpotFree(point, viewport, [])));
    assert.ok(spots.some((point) => point.x === 8));
    assert.ok(spots.some((point) => point.x === viewport.width - DOG_SIZE.width - 8));
    assert.ok(spots.some((point) => point.x > 8 && point.x < viewport.width - DOG_SIZE.width - 8));
  }
});
