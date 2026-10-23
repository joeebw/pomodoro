export const DOG_SIZE = { width: 72, height: 76 };

export function isDogSpotFree(point, viewport, obstacles) {
  const { width, height } = DOG_SIZE;
  if (point.x < 8 || point.y < 8 || point.x + width > viewport.width - 8 || point.y + height > viewport.height - 8) return false;
  return obstacles.every((rect) => point.x + width + 4 <= rect.left || point.x - 4 >= rect.right
    || point.y + height + 4 <= rect.top || point.y - 4 >= rect.bottom);
}

export function isDogPathFree(from, to, viewport, obstacles) {
  const samples = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 8));
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    if (!isDogSpotFree({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }, viewport, obstacles)) return false;
  }
  return true;
}

export function dogSpots(viewport, random = Math.random) {
  const right = viewport.width - DOG_SIZE.width - 8;
  const bottom = viewport.height - DOG_SIZE.height - 8;
  const edgeStops = Math.max(2, Math.ceil((bottom - 8) / 32) + 1);
  const edges = [
    { x: right, y: bottom }, { x: 8, y: bottom }, { x: right, y: 8 }, { x: 8, y: 8 },
    ...Array.from({ length: edgeStops * 2 }, (_, i) => ({ x: i % 2 ? 8 : right, y: 8 + (bottom - 8) * Math.floor(i / 2) / (edgeStops - 1) })),
  ];
  return [...edges, ...Array.from({ length: 24 }, () => ({ x: 8 + random() * (right - 8), y: 8 + random() * (bottom - 8) }))];
}

// A grid route allows Max to go around a control instead of pushing into it.
export function findDogRoute(from, to, viewport, obstacles) {
  if (!isDogSpotFree(from, viewport, obstacles) || !isDogSpotFree(to, viewport, obstacles)) return null;
  if (isDogPathFree(from, to, viewport, obstacles)) return [to];
  const axis = (max, a, b) => [...new Set([8, max, a, b,
    ...Array.from({ length: Math.max(0, Math.floor((max - 8) / 24)) }, (_, i) => 8 + (i + 1) * 24),
  ])].sort((x, y) => x - y);
  const xs = axis(viewport.width - DOG_SIZE.width - 8, from.x, to.x);
  const ys = axis(viewport.height - DOG_SIZE.height - 8, from.y, to.y);
  const id = (x, y) => y * xs.length + x;
  const position = (key) => ({ x: xs[key % xs.length], y: ys[Math.floor(key / xs.length)] });
  const start = id(xs.indexOf(from.x), ys.indexOf(from.y));
  const end = id(xs.indexOf(to.x), ys.indexOf(to.y));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const scores = new Map([[start, 0]]);
  const parent = new Map();
  const free = new Map();
  const closed = new Set();
  const queue = [{ key: start, cost: distance(from, to) }];
  // This small binary heap avoids sorting the entire frontier on each step.
  function push(item) {
    let i = queue.length;
    queue.push(item);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (queue[p].cost <= item.cost) break;
      queue[i] = queue[p]; i = p;
    }
    queue[i] = item;
  }
  function pop() {
    const first = queue[0], last = queue.pop();
    if (queue.length) {
      let i = 0;
      while (i * 2 + 1 < queue.length) {
        let child = i * 2 + 1;
        if (child + 1 < queue.length && queue[child + 1].cost < queue[child].cost) child++;
        if (queue[child].cost >= last.cost) break;
        queue[i] = queue[child]; i = child;
      }
      queue[i] = last;
    }
    return first.key;
  }
  while (queue.length) {
    const current = pop();
    if (closed.has(current)) continue;
    if (current === end) {
      const path = [];
      for (let key = end; key !== start; key = parent.get(key)) path.unshift(position(key));
      // Keep only turns that cannot safely be replaced by a straight segment.
      const simplified = [];
      let anchor = from;
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1 || !isDogPathFree(anchor, path[i + 1], viewport, obstacles)) {
          simplified.push(path[i]); anchor = path[i];
        }
      }
      return simplified;
    }
    closed.add(current);
    const cx = current % xs.length, cy = Math.floor(current / xs.length);
    const here = position(current);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = cx + dx, y = cy + dy;
      if ((!dx && !dy) || x < 0 || y < 0 || x >= xs.length || y >= ys.length) continue;
      const next = id(x, y);
      if (closed.has(next)) continue;
      const there = position(next);
      if (!free.has(next)) free.set(next, isDogSpotFree(there, viewport, obstacles));
      if (!free.get(next) || !isDogPathFree(here, there, viewport, obstacles)) continue;
      const score = scores.get(current) + distance(here, there);
      if (score >= (scores.get(next) ?? Infinity)) continue;
      scores.set(next, score); parent.set(next, current);
      push({ key: next, cost: score + distance(there, to) });
    }
  }
  return null;
}
