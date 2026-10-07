const integer = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Math.max(0, Math.floor(Number(value))) : fallback;
const cycleSize = (value) => Math.min(8, Math.max(2, integer(value, 4)));

export function normalizeChampionship(saved, configuredCycle, sessionsToday = 0) {
  const target = cycleSize(saved?.target ?? configuredCycle);
  const steps = saved ? Math.min(target - 1, integer(saved.steps)) : integer(sessionsToday) % target;
  return {
    target,
    steps,
    belts: integer(saved?.belts),
    victorySize: steps === 0 && integer(saved?.victorySize) >= 2 ? cycleSize(saved.victorySize) : 0,
  };
}

export function completeChampionshipStep(championship, configuredCycle) {
  const step = championship.steps + 1;
  const won = step === championship.target;
  const result = { step, target: championship.target, won, belts: championship.belts + Number(won) };
  return {
    championship: won
      ? { steps: 0, target: cycleSize(configuredCycle), belts: result.belts, victorySize: championship.target }
      : { ...championship, steps: step, victorySize: 0 },
    result,
  };
}

export function beginChampionshipCycle(championship, configuredCycle) {
  if (!championship.victorySize) return championship;
  return { ...championship, target: cycleSize(configuredCycle), victorySize: 0 };
}

export function championshipView(championship) {
  return championship.victorySize
    ? { step: championship.victorySize, target: championship.victorySize, won: true }
    : { step: championship.steps, target: championship.target, won: false };
}
