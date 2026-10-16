import { ATHLETE_QUOTES } from './athlete-quotes.js';
import { CLASSIC_QUOTES } from './classic-quotes.js';

// Spread each author's entries across the catalog instead of leaving long blocks.
const authors = new Map();
for (const entry of [...ATHLETE_QUOTES, ...CLASSIC_QUOTES]) {
  if (!authors.has(entry.author)) authors.set(entry.author, []);
  authors.get(entry.author).push(entry);
}

const orderedQuotes = [...authors.values()]
  .flatMap((entries) => entries.map((entry, index) => ({ entry, position: (index + 0.5) / entries.length })))
  .sort((a, b) => a.position - b.position)
  .map(({ entry }) => entry);

// Start with Topuria while retaining the balanced spacing around the rotation.
const firstQuote = orderedQuotes.indexOf(ATHLETE_QUOTES[0]);
export const MOTIVATIONAL_QUOTES = [...orderedQuotes.slice(firstQuote), ...orderedQuotes.slice(0, firstQuote)];

const wrap = (index) => ((index % MOTIVATIONAL_QUOTES.length) + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length;

export function getDailyQuote(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return MOTIVATIONAL_QUOTES[wrap(day)];
}

export function getCompletionQuote(completed) {
  // The catalog already mixes authors; traverse it once before repeating.
  return MOTIVATIONAL_QUOTES[wrap(Math.max(1, Math.floor(completed)) - 1)];
}
