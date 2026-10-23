const SOURCES = {
  bark: new URL('../assets/audio/max-bark.mp3', import.meta.url).href,
  eat: new URL('../assets/audio/max-eat.mp3', import.meta.url).href,
};

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
    play(kind, offset = 0) {
      stop();
      if (!context || !SOURCES[kind]) return;
      const request = version;
      load(kind).then((buffer) => {
        if (request !== version || context.state !== 'running' || offset >= buffer.duration) return;
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = kind === 'bark' ? .45 : .65;
        source.connect(gain).connect(context.destination);
        source.onended = () => { source.disconnect(); gain.disconnect(); if (active === source) active = null; };
        active = source;
        source.start(0, Math.max(0, offset));
      }).catch(() => {});
    },
    stop,
  };
}
