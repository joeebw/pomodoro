import assert from 'node:assert/strict';
import test from 'node:test';
import { createDogCare } from '../src/dog-care.js';

// Small DOM adapter: exercise public care operations and placement controls
// without importing browser dependencies into this static application.
class Element {
  hidden = false;
  dataset = {};
  style = { transform: '', setProperty() {} };
  classList = { toggle() {}, add() {} };
  nodes = new Map();
  events = new Map();
  querySelector(selector) {
    if (!this.nodes.has(selector)) this.nodes.set(selector, new Element());
    return this.nodes.get(selector);
  }
  addEventListener(type, listener) { this.events.set(type, listener); }
  click() { this.events.get('click')?.({ detail: 0 }); }
  getBoundingClientRect() { return { width: 300, height: 120 }; }
  append() {}
  focus() {}
  remove() {}
  setAttribute() {}
}

test('food consumes one reward only after valid placement; free water shares the single dish and respects availability', () => {
  const names = ['document', 'matchMedia', 'innerWidth', 'innerHeight', 'cancelAnimationFrame'];
  const previous = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  const roots = [];
  const document = {
    createElement() { const element = new Element(); roots.push(element); return element; },
    body: new Element(), querySelectorAll: () => [], querySelector: () => new Element(), addEventListener() {},
  };
  Object.assign(globalThis, { document, matchMedia: () => ({ matches: true }), innerWidth: 600, innerHeight: 500, cancelAnimationFrame() {} });
  let rewards = 1, served = 0, reachable = false;
  try {
    const care = createDogCare({
      planMeal: () => reachable ? { seat: { x: 30, y: 30 }, route: [{ x: 30, y: 30 }] } : null,
      onMealChange() {},
      onServe() { if (!rewards) return false; rewards--; served++; return true; },
    });
    const controls = roots[0];
    const confirm = () => controls.querySelector('[data-place="confirm"]').click();
    const cancel = () => controls.querySelector('[data-place="cancel"]').click();
    care.setFeeding({ available: 1, asleep: false });
    assert.equal(care.begin(), true);
    confirm();
    assert.equal(care.meal, null, 'unreachable locations cannot consume rewards');
    assert.equal(served, 0);
    cancel();
    assert.equal(care.placing, false);
    reachable = true;
    care.begin(); confirm();
    assert.equal(care.meal.kind, 'food');
    assert.equal(care.meal.remaining, 6700);
    assert.equal(rewards, 0);
    assert.equal(served, 1);
    confirm();
    assert.equal(served, 1, 'a placed dish cannot consume twice');
    assert.equal(care.begin('water'), false, 'food and water share one dish');
    care.clearMeal();
    care.setFeeding({ available: 0, asleep: false });
    assert.equal(care.begin('food'), false);
    assert.equal(care.begin('water'), true, 'no earned meals are required for water');
    confirm();
    assert.equal(care.meal.kind, 'water');
    assert.equal(care.meal.remaining, 4000);
    assert.equal(served, 1, 'water never consumes a reward');
    assert.equal(care.begin('water'), false);
    care.meal.remaining = 2000;
    care.setFeeding({ available: 0, asleep: true });
    assert.equal(care.meal.remaining, 2000, 'sleep preserves the pending portion');
    care.clearMeal();
    assert.equal(care.begin('water'), false, 'sleep blocks new water');
    care.setFeeding({ available: 0, asleep: false });
    care.setPlaying(true);
    assert.equal(care.begin('water'), false, 'games and petting block new water');
    care.setPlaying(false);
    care.begin('water'); confirm();
    care.setEnabled(false);
    assert.equal(care.meal, null, 'hiding Max removes temporary objects');
    assert.equal(care.begin('water'), false);
    assert.equal(served, 1);
  } finally {
    names.forEach((name, i) => { if (previous[i]) Object.defineProperty(globalThis, name, previous[i]); else delete globalThis[name]; });
  }
});
