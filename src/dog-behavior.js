export const AUTONOMOUS_POSES = ['sniff', 'sit', 'wag', 'stretch', 'play', 'scratch', 'shake', 'yawn', 'lick', 'bow', 'look', 'paw', 'roll', 'ball', 'sneeze', 'lounge', 'wipe', 'dig'];
export const POSE_DURATIONS = { scratch: 3200, lick: 1500, roll: 3200, look: 3000, paw: 2400, ball: 3000, bow: 2400, sneeze: 2200, lounge: 4000, wipe: 2800, dig: 3000 };
export const EXPRESSIVE_POSES = new Set(['play', 'roll', 'shake', 'sneeze', 'dig']);

export function createDogBehavior(random = Math.random) {
  let deck = [], last, lastExpressive = -Infinity;
  return {
    next(awakeTime) {
      if (!deck.length) {
        deck = [...AUTONOMOUS_POSES];
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
      }
      const index = deck.findIndex((pose) => pose !== last && (!EXPRESSIVE_POSES.has(pose) || awakeTime - lastExpressive >= 20000));
      // Wait quietly without consuming a pose when only energetic gestures remain.
      if (index < 0) return 'idle';
      const [pose] = deck.splice(index, 1);
      if (EXPRESSIVE_POSES.has(pose)) lastExpressive = awakeTime;
      last = pose;
      return pose;
    },
  };
}
