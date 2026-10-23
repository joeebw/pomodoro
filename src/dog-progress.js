// Companion progress is separate from editable daily totals and championship resets.
export function normalizeDogProgress(saved) {
  const count = (value) => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const sessions = count(saved?.sessions);
  return { sessions, meals: Math.min(sessions, count(saved?.meals)) };
}

export function rewardDogSession(progress) {
  const current = normalizeDogProgress(progress);
  return { sessions: current.sessions + 1, meals: current.meals + 1 };
}

export function consumeDogMeal(progress) {
  const current = normalizeDogProgress(progress);
  return { ...current, meals: Math.max(0, current.meals - 1) };
}

export function dogGrowth(progress) {
  const { sessions } = normalizeDogProgress(progress);
  const fraction = Math.min(1, sessions / 60);
  const stage = sessions < 8 ? 'Cachorro' : sessions < 24 ? 'Joven' : sessions < 60 ? 'En crecimiento' : 'Adulto';
  return { scale: .62 + .38 * fraction, stage, sessions, remaining: Math.max(0, 60 - sessions) };
}
