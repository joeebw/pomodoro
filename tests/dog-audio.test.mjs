import assert from 'node:assert/strict';
import test from 'node:test';
import { createDogAudio } from '../src/dog-audio.js';

test('real audio buffers resume at the requested offset and cancelled loads cannot play later', async () => {
  const previousFetch = globalThis.fetch;
  const previousWindow = globalThis.window;
  const starts = [];
  const durations = [];
  const gains = [];
  let stops = 0;
  class AudioContext {
    state = 'running';
    currentTime = 100;
    destination = {};
    resume() { return Promise.resolve(); }
    decodeAudioData(data) { return Promise.resolve({ duration: new Uint8Array(data)[0] === 1 ? 1.6 : 6.7 }); }
    createGain() { const gain = { gain: { value: 0 }, connect() {}, disconnect() {} }; gains.push(gain); return gain; }
    createBufferSource() {
      return {
        buffer: null,
        connect(gain) { return gain; },
        disconnect() {},
        start(when, offset, duration) { durations.push(duration); starts.push({ duration: this.buffer.duration, when, offset }); },
        stop() { stops++; this.onended?.(); },
      };
    }
  }
  globalThis.window = { AudioContext };
  globalThis.fetch = async (url) => ({ ok: true, arrayBuffer: async () => new Uint8Array([url.includes('pant') ? 1 : 2]).buffer });
  const settle = () => new Promise((resolve) => setImmediate(resolve));
  try {
    const audio = createDogAudio();
    audio.play('pant');
    await settle();
    assert.equal(starts.length, 0, 'no playback before a user gesture unlocks audio');
    audio.unlock();
    audio.play('pant');
    audio.play('eat', 2.5);
    await settle();
    assert.deepEqual(starts, [{ duration: 6.7, when: 0, offset: 2.5 }]);
    audio.stop();
    assert.equal(stops, 1);
    audio.play('pant');
    audio.stop();
    await settle();
    assert.equal(starts.length, 1, 'a cancelled request cannot produce a late pant');
    audio.play('pant');
    await settle();
    assert.deepEqual(starts.at(-1), { duration: 1.6, when: 0, offset: 0 });
    audio.setVolume(25);
    assert.equal(gains.at(-1).gain.value, .45 * .25, 'volume updates current playback');
    audio.setVolume(0);
    const count = starts.length;
    audio.play('bark');
    await settle();
    assert.equal(starts.length, count, 'zero volume does not start another recording');
    audio.setVolume(100);
    audio.stop();
    for (const kind of ['bark', 'poop', 'scratch', 'lick', 'bottle', 'water']) {
      audio.play(kind, 0, { delay: kind === 'poop' ? .55 : 0 });
      await settle();
      assert.equal(starts.at(-1).when, kind === 'poop' ? 100.55 : 0);
      assert.equal(starts.at(-1).offset, 0);
      audio.stop();
    }
    audio.play('bottle', 0, { duration: .5 });
    await settle();
    assert.equal(durations.at(-1), .5, 'toy sounds stop at the action duration');
    audio.stop();
  } finally {
    globalThis.fetch = previousFetch;
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
  }
});
