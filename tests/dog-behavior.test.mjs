import assert from 'node:assert/strict';
import test from 'node:test';
import { AUTONOMOUS_POSES, EXPRESSIVE_POSES, createDogBehavior } from '../src/dog-behavior.js';

test('shuffled gestures visit the whole catalog before repeating, including across deck boundaries', () => {
  for (const random of [() => 0, () => .5, () => .999]) {
    const behavior = createDogBehavior(random);
    const poses = Array.from({ length: AUTONOMOUS_POSES.length * 3 }, (_, i) => behavior.next(i * 20000));
    for (let i = 0; i < poses.length; i += AUTONOMOUS_POSES.length) {
      assert.deepEqual([...new Set(poses.slice(i, i + AUTONOMOUS_POSES.length))].sort(), [...AUTONOMOUS_POSES].sort());
    }
    assert.ok(poses.every((pose, i) => i === 0 || pose !== poses[i - 1]));
  }
});

test('expressive gestures wait twenty awake seconds without discarding the remaining catalog', () => {
  const behavior = createDogBehavior(() => .99);
  const seen = [];
  let previousExpressive = -Infinity;
  for (let awake = 0; seen.length < AUTONOMOUS_POSES.length && awake < 200000; awake += 1000) {
    const pose = behavior.next(awake);
    if (pose === 'idle') continue;
    if (EXPRESSIVE_POSES.has(pose)) {
      assert.ok(awake - previousExpressive >= 20000);
      previousExpressive = awake;
    }
    seen.push(pose);
  }
  assert.equal(seen.length, AUTONOMOUS_POSES.length);
  assert.equal(new Set(seen).size, AUTONOMOUS_POSES.length, 'waiting does not refill or lose queued gestures');
});
