import assert from 'node:assert/strict';
import test from 'node:test';
import { MOTIVATIONAL_QUOTES, getCompletionQuote, getDailyQuote } from '../src/quotes.js';

const normalized = (text) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

test('the catalog has exactly 100 distinct quotes with attribution', () => {
  assert.equal(MOTIVATIONAL_QUOTES.length, 100);
  assert.equal(new Set(MOTIVATIONAL_QUOTES.map(({ text }) => normalized(text))).size, MOTIVATIONAL_QUOTES.length);
  for (const entry of MOTIVATIONAL_QUOTES) {
    assert.ok(entry.text.trim() && entry.author.trim() && entry.work.trim());
    assert.equal(new URL(entry.source).protocol, 'https:');
    if (entry.original) {
      assert.ok(entry.work.includes('traducción al español'));
      assert.equal(decodeURIComponent(new URL(entry.source).hash.slice('#:~:text='.length)), entry.original);
    }
  }
});

test('completion visits the entire catalog before repeating, including existing progress', () => {
  for (const startingSession of [1, 37, 1000]) {
    const cycle = Array.from({ length: MOTIVATIONAL_QUOTES.length }, (_, index) => getCompletionQuote(startingSession + index));
    assert.equal(new Set(cycle).size, MOTIVATIONAL_QUOTES.length);
    assert.equal(getCompletionQuote(startingSession + MOTIVATIONAL_QUOTES.length), cycle[0]);
  }
});

test('daily quotes visit the entire catalog across month and year boundaries', () => {
  const cycle = Array.from({ length: MOTIVATIONAL_QUOTES.length }, (_, index) => getDailyQuote(new Date(2026, 9, 15 + index)));
  assert.equal(new Set(cycle).size, MOTIVATIONAL_QUOTES.length);
  assert.equal(getDailyQuote(new Date(2026, 9, 15 + MOTIVATIONAL_QUOTES.length)), cycle[0]);
  assert.equal(getDailyQuote(new Date(2026, 9, 15, 0, 0)), getDailyQuote(new Date(2026, 9, 15, 23, 59)));
});

test('Topuria remains distributed through the rotation instead of appearing in one block', () => {
  const positions = MOTIVATIONAL_QUOTES.flatMap((entry, index) => entry.author === 'Ilia Topuria' ? [index] : []);
  assert.ok(positions.length >= 9);
  assert.equal(getCompletionQuote(1).author, 'Ilia Topuria');
  const idealSpacing = MOTIVATIONAL_QUOTES.length / positions.length;
  positions.forEach((position, index) => {
    const next = positions[(index + 1) % positions.length];
    const gap = (next - position + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length;
    assert.ok(gap <= Math.ceil(idealSpacing * 2), `Topuria gap of ${gap} sessions`);
  });
});

test('all quote modules are available in the offline app shell', async () => {
  const { readFile } = await import('node:fs/promises');
  const serviceWorker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  for (const name of ['quotes.js', 'athlete-quotes.js', 'classic-quotes.js']) {
    assert.ok(serviceWorker.includes(`'/src/${name}'`));
  }
});
