const SOURCES = {
  bottle: new URL('../assets/audio/max-bottle.wav', import.meta.url).href,
  bark: new URL('../assets/audio/max-bark.mp3', import.meta.url).href,
  pant: new URL('../assets/audio/max-pant.wav', import.meta.url).href,
  eat: new URL('../assets/audio/max-eat.mp3', import.meta.url).href,
  poop: new URL('../assets/audio/max-poop.mp3', import.meta.url).href,
  scratch: new URL('../assets/audio/max-scratch.wav', import.meta.url).href,
  lick: new URL('../assets/audio/max-lick.wav', import.meta.url).href,
};
const VOLUMES = { bottle: .45, bark: .4, pant: .45, eat: .65, poop: .3, scratch: .45, lick: .45 };

// Decode the real recordings once. Buffer playback can resume accurately even
// offline, where cached responses do not necessarily support HTTP byte ranges.
export function createDogAudio() {
  let context;
  let active, activeGain, activeKind;
  let volume = 1;
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
    setVolume(value) {
      volume = Number.isFinite(Number(value)) ? Math.min(100, Math.max(0, Number(value))) / 100 : 1;
      if (volume === 0) stop();
      else if (active && activeGain) activeGain.gain.value = VOLUMES[activeKind] * volume;
    },
    unlock() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      try {
        context ??= new AudioContext();
        context.resume().catch(() => {});
        for (const kind of Object.keys(SOURCES)) load(kind).catch(() => {});
      } catch { /* Visual actions still work if browser audio is unavailable. */ }
    },
    play(kind, offset = 0, { delay = 0, duration } = {}) {
      stop();
      if (!context || !SOURCES[kind] || volume === 0) return;
      const request = version;
      load(kind).then((buffer) => {
        if (request !== version || context.state !== 'running' || offset >= buffer.duration) return;
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = VOLUMES[kind] * volume;
        source.connect(gain).connect(context.destination);
        source.onended = () => { source.disconnect(); gain.disconnect(); if (active === source) active = null; };
        active = source; activeGain = gain; activeKind = kind;
        const when = delay > 0 ? context.currentTime + delay : 0;
        if (Number.isFinite(duration) && duration > 0) source.start(when, Math.max(0, offset), duration);
        else source.start(when, Math.max(0, offset));
      }).catch(() => {});
    },
    stop,
  };
}
