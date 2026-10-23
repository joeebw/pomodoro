const SOURCES = {
  pant: new URL('../assets/audio/max-pant.wav', import.meta.url).href,
  eat: new URL('../assets/audio/max-eat.mp3', import.meta.url).href,
  poop: new URL('../assets/audio/max-poop.mp3', import.meta.url).href,
  scratch: new URL('../assets/audio/max-scratch.wav', import.meta.url).href,
  lick: new URL('../assets/audio/max-lick.wav', import.meta.url).href,
};
const VOLUMES = { pant: .38, eat: .65, poop: .3, scratch: .45, lick: .45 };

// Decode the real recordings once. Buffer playback can resume accurately even
// offline, where cached responses do not necessarily support HTTP byte ranges.
export function createDogAudio() {
  let context;
  let active;
  let version = 0;
  const buffers = new Map();
  function load(kind) {
    if (!buffers.has(kind)) {
      const pending = fetch(SOURCES[kind]).then((response) => {
        if (!response.ok) throw new Error('Audio unavailable');
        return response.arrayBuffer();
      }).then((data) => context.decodeAudioData(data)).catch((error) => {
        buffers.delete(kind); throw error;
      });
      buffers.set(kind, pending);
    }
    return buffers.get(kind);
  }
  function stop() {
    version++;
    if (active) {
      try { active.stop(); } catch { /* Already ended. */ }
      active = null;
    }
  }
  return {
    unlock() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      try {
        context ??= new AudioContext();
        context.resume().catch(() => {});
        for (const kind of Object.keys(SOURCES)) load(kind).catch(() => {});
      } catch { /* Visual actions still work if browser audio is unavailable. */ }
    },
    play(kind, offset = 0, { delay = 0 } = {}) {
      stop();
      if (!context || !SOURCES[kind]) return;
      const request = version;
      load(kind).then((buffer) => {
        if (request !== version || context.state !== 'running' || offset >= buffer.duration) return;
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = VOLUMES[kind];
        source.connect(gain).connect(context.destination);
        source.onended = () => { source.disconnect(); gain.disconnect(); if (active === source) active = null; };
        active = source;
        source.start(delay > 0 ? context.currentTime + delay : 0, Math.max(0, offset));
      }).catch(() => {});
    },
    stop,
  };
}
