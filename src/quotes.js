import { ATHLETE_QUOTES } from './athlete-quotes.js';

const wrap = (index) => ((index % ATHLETE_QUOTES.length) + ATHLETE_QUOTES.length) % ATHLETE_QUOTES.length;

export function getDailyQuote(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ATHLETE_QUOTES[wrap(day)];
}

export function getCompletionQuote(completed) {
  // A coprime stride visits the entire catalog before repeating.
  return ATHLETE_QUOTES[wrap((Math.max(1, Math.floor(completed)) - 1) * 17)];
}
