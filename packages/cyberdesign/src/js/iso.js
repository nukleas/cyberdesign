/**
 * cyberdesign/iso.js
 * SVG isometric projector + scene. No dependencies.
 * Fills/strokes come from .cd-iso-* CSS (token-only). JS owns geometry + interaction.
 */

const TILE = { w: 72, h: 36, z: 22 };

export function projectIso(i, j, k = 0, tile = TILE) {
  return {
    x: (i - j) * (tile.w / 2),
    y: (i + j) * (tile.h / 2) - k * tile.z,
  };
}

export function depthKey(node) {
  const { i, j, k = 0, w = 1, d = 1, h = 0 } = node;
  return i + j + k + (w + d + h) * 0.5;
}

function p(i, j, k, tile) {
  const { x, y } = projectIso(i, j, k, tile);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function face(pts, faceName) {
  return `<path class="cd-iso-face cd-iso-face--${faceName}" d="M${pts}Z" />`;
}

function boxFaces(i, j, k, w, d, h, tile) {
  const t = k + h;
  const top = `${p(i, j, t, tile)} L${p(i + w, j, t, tile)} L${p(i + w, j + d, t, tile)} L${p(i, j + d, t, tile)}`;
  const left = `${p(i, j + d, t, tile)} L${p(i + w, j + d, t, tile)} L${p(i + w, j + d, k, tile)} L${p(i, j + d, k, tile)}`;
  const right = `${p(i + w, j, t, tile)} L${p(i + w, j + d, t, tile)} L${p(i + w, j + d, k, tile)} L${p(i + w, j, k, tile)}`;
  const inset = `${p(i + 0.18, j + 0.18, t + 0.01, tile)} L${p(i + w - 0.18, j + 0.18, t + 0.01, tile)} L${p(i + w - 0.18, j + d - 0.18, t + 0.01, tile)} L${p(i + 0.18, j + d - 0.18, t + 0.01, tile)}`;
  const roof = projectIso(i + w / 2, j + d / 2, t, tile);
  return { top, left, right, inset, roof };
}

function blockMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const f = boxFaces(i, j, k, w, d, h, tile);
  const beacon = node.status
    ? `<polygon class="cd-iso-beacon" points="${beaconPts(f.roof, 4)}" />`
    : '';
  return `
    ${face(f.left, 'left')}
    ${face(f.right, 'right')}
    ${face(f.top, 'top')}
    <path class="cd-iso-inset" d="M${f.inset}Z" />
    ${stripeMarkup(node, tile)}
    ${beacon}
  `;
}

function districtMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const f = boxFaces(i, j, k, w, d, h, tile);
  const hatches = [];
  for (let s = 1; s < w; s += 1) {
    hatches.push(`<line class="cd-iso-hatch" x1="${projectIso(i + s, j, k + h, tile).x}" y1="${projectIso(i + s, j, k + h, tile).y}" x2="${projectIso(i + s, j + d, k + h, tile).x}" y2="${projectIso(i + s, j + d, k + h, tile).y}" />`);
  }
  return `
    ${face(f.left, 'left')}
    ${face(f.right, 'right')}
    ${face(f.top, 'top')}
    ${hatches.join('')}
  `;
}

function cylinderMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const top = projectIso(i + w / 2, j + d / 2, k + h, tile);
  const bot = projectIso(i + w / 2, j + d / 2, k, tile);
  const rx = ((w + d) * tile.w) / 4;
  const ry = ((w + d) * tile.h) / 4;
  const body = `M${(top.x - rx).toFixed(2)},${top.y.toFixed(2)} L${(bot.x - rx).toFixed(2)},${bot.y.toFixed(2)} A${rx.toFixed(2)},${ry.toFixed(2)} 0 0 0 ${(bot.x + rx).toFixed(2)},${bot.y.toFixed(2)} L${(top.x + rx).toFixed(2)},${top.y.toFixed(2)} Z`;
  const beacon = node.status
    ? `<polygon class="cd-iso-beacon" points="${beaconPts(top, 4)}" />`
    : '';
  return `
    <path class="cd-iso-cyl-body" d="${body}" />
    <ellipse class="cd-iso-face cd-iso-face--top" cx="${top.x.toFixed(2)}" cy="${top.y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" />
    <ellipse class="cd-iso-cyl-ring" cx="${top.x.toFixed(2)}" cy="${top.y.toFixed(2)}" rx="${(rx * 0.62).toFixed(2)}" ry="${(ry * 0.62).toFixed(2)}" />
    ${stripeMarkup(node, tile)}
    ${beacon}
  `;
}

function stripeMarkup(node, tile) {
  if (!node.classif || node.classif === 'u') return '';
  const { i, j, k = 0, w, d, h } = node;
  const t = k + h + 0.05;
  const band = Math.min(0.32, Math.max(0.16, d * 0.2));
  const pts = `${p(i + 0.12, j + d - band, t, tile)} L${p(i + w - 0.12, j + d - band, t, tile)} L${p(i + w - 0.12, j + d - 0.1, t, tile)} L${p(i + 0.12, j + d - 0.1, t, tile)}`;
  return `<path class="cd-iso-stripe" data-classif="${node.classif}" d="M${pts}Z" />`;
}

function trackMarkup(node, tile) {
  if (node.track !== 'both') return '';
  const { i, j, k = 0, w, d, h } = node;
  const t = k + h + 0.02;
  const a = `${p(i, j, t, tile)} L${p(i + w, j, t, tile)} L${p(i + w, j + d, t, tile)}`;
  const b = `${p(i, j, t, tile)} L${p(i + w, j + d, t, tile)} L${p(i, j + d, t, tile)}`;
  return `${face(a, 'track-a')}${face(b, 'track-b')}`;
}

function hexRing(cx, cy, rx, ry, k) {
  const pts = [];
  for (let a = 0; a < 6; a++) {
    const ang = (Math.PI / 3) * a - Math.PI / 6;
    pts.push({ i: cx + Math.cos(ang) * rx, j: cy + Math.sin(ang) * ry, k });
  }
  return pts;
}

function hexMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const cx = i + w / 2;
  const cy = j + d / 2;
  const top = hexRing(cx, cy, w / 2, d / 2, k + h);
  const bot = hexRing(cx, cy, w / 2, d / 2, k);
  const topD = top.map((pt, n) => `${n ? 'L' : ''}${p(pt.i, pt.j, pt.k, tile)}`).join(' ');
  const scored = top.map((_, a) => {
    const b = (a + 1) % 6;
    return { a, b, mid: top[a].i + top[a].j + top[b].i + top[b].j };
  }).sort((x, y) => x.mid - y.mid);
  const sides = scored.slice(3).map(({ a, b }, n) => {
    const pts = `${p(top[a].i, top[a].j, top[a].k, tile)} L${p(top[b].i, top[b].j, top[b].k, tile)} L${p(bot[b].i, bot[b].j, bot[b].k, tile)} L${p(bot[a].i, bot[a].j, bot[a].k, tile)}`;
    return face(pts, n % 2 ? 'left' : 'right');
  }).join('');
  const roof = projectIso(cx, cy, k + h, tile);
  const beacon = node.status ? `<polygon class="cd-iso-beacon" points="${beaconPts(roof, 4)}" />` : '';
  return `${sides}${face(topD, 'top')}${stripeMarkup(node, tile)}${beacon}`;
}

function rackMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const n = node.slots || 5;
  const slab = h / n;
  const slabs = [];
  for (let s = 0; s < n; s++) {
    const kk = k + s * slab;
    const inset = 0.06 + (s % 2) * 0.04;
    const f = boxFaces(i + inset, j + 0.08, kk, w - inset * 2, d - 0.16, slab * 0.82, tile);
    slabs.push(`${face(f.left, 'left')}${face(f.right, 'right')}${face(f.top, 'top')}`);
  }
  const roof = projectIso(i + w / 2, j + d / 2, k + h, tile);
  const beacon = node.status ? `<polygon class="cd-iso-beacon" points="${beaconPts(roof, 3.5)}" />` : '';
  return `${slabs.join('')}${stripeMarkup(node, tile)}${beacon}`;
}

function stackMarkup(node, tile) {
  const copies = node.replicas || 3;
  const parts = [];
  for (let r = 0; r < copies; r++) {
    const lift = r * 0.42;
    const shift = r * 0.12;
    parts.push(blockMarkup({
      ...node,
      i: node.i + shift,
      j: node.j + shift,
      k: (node.k || 0) + lift,
      h: Math.max(0.55, node.h / copies + 0.15),
      status: r === copies - 1 ? node.status : undefined,
      classif: r === copies - 1 ? node.classif : undefined,
    }, tile));
  }
  return parts.join('');
}

function wedgeMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const t = k + h;
  const tip = { i: i + w, j: j + d / 2 };
  const top = `${p(i, j, t, tile)} L${p(tip.i, tip.j, t, tile)} L${p(i, j + d, t, tile)}`;
  const left = `${p(i, j + d, t, tile)} L${p(tip.i, tip.j, t, tile)} L${p(tip.i, tip.j, k, tile)} L${p(i, j + d, k, tile)}`;
  const right = `${p(i, j, t, tile)} L${p(tip.i, tip.j, t, tile)} L${p(tip.i, tip.j, k, tile)} L${p(i, j, k, tile)}`;
  const back = `${p(i, j, t, tile)} L${p(i, j + d, t, tile)} L${p(i, j + d, k, tile)} L${p(i, j, k, tile)}`;
  const roof = projectIso(i + w * 0.45, j + d / 2, t, tile);
  const beacon = node.status ? `<polygon class="cd-iso-beacon" points="${beaconPts(roof, 3.5)}" />` : '';
  return `${face(back, 'left')}${face(left, 'left')}${face(right, 'right')}${face(top, 'top')}${stripeMarkup(node, tile)}${beacon}`;
}

function actorMarkup(node, tile) {
  const { i, j, k = 0, w, d, h } = node;
  const cx = i + w / 2;
  const cy = j + d / 2;
  const body = boxFaces(cx - w * 0.22, cy - d * 0.22, k, w * 0.44, d * 0.44, h * 0.62, tile);
  const headR = Math.min(w, d) * 0.22;
  const head = projectIso(cx, cy, k + h * 0.82, tile);
  const rx = headR * tile.w;
  const ry = headR * tile.h;
  return `
    ${face(body.left, 'left')}
    ${face(body.right, 'right')}
    ${face(body.top, 'top')}
    <ellipse class="cd-iso-actor-head" cx="${head.x.toFixed(2)}" cy="${head.y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" />
  `;
}

function shapeFor(n) {
  if (n.shape) return n.shape;
  if (n.kind === 'store') return 'cyl';
  if (n.kind === 'team' || n.kind === 'boundary' || n.kind === 'enclave') return 'district';
  if (n.kind === 'standard') return 'hex';
  if (n.kind === 'actor') return 'actor';
  if (n.kind === 'rack') return 'rack';
  if (n.kind === 'stack') return 'stack';
  if (n.kind === 'broker') return 'wedge';
  return 'block';
}

function shapeClass(shape) {
  if (shape === 'cyl') return 'cd-iso-cyl';
  if (shape === 'district') return 'cd-iso-district';
  if (shape === 'hex') return 'cd-iso-hex';
  if (shape === 'rack') return 'cd-iso-rack';
  if (shape === 'stack') return 'cd-iso-stack';
  if (shape === 'wedge') return 'cd-iso-wedge';
  if (shape === 'actor') return 'cd-iso-actor';
  return 'cd-iso-block';
}

function innerMarkup(n, tile) {
  const shape = shapeFor(n);
  if (shape === 'cyl') return cylinderMarkup(n, tile);
  if (shape === 'district') return districtMarkup(n, tile);
  if (shape === 'hex') return hexMarkup(n, tile);
  if (shape === 'rack') return rackMarkup(n, tile);
  if (shape === 'stack') return stackMarkup(n, tile);
  if (shape === 'wedge') return wedgeMarkup(n, tile);
  if (shape === 'actor') return actorMarkup(n, tile);
  return `${blockMarkup(n, tile)}${trackMarkup(n, tile)}`;
}

function nodeAttrs(n) {
  const bits = [
    n.role ? `data-role="${n.role}"` : '',
    n.status ? `data-status="${n.status}"` : '',
    n.classif ? `data-classif="${n.classif}"` : '',
    n.il ? `data-il="${n.il}"` : '',
    n.zone ? `data-zone="${n.zone}"` : '',
    n.track ? `data-track="${n.track}"` : '',
    `data-shape="${shapeFor(n)}"`,
  ];
  return bits.filter(Boolean).join(' ');
}

function labelAnchor(node) {
  if (node.kind === 'team' || node.kind === 'boundary' || node.kind === 'enclave') {
    return { i: node.i + 1.15, j: node.j + 0.35, k: (node.k || 0) + node.h };
  }
  if (node.kind === 'actor') {
    return { i: node.i + node.w / 2, j: node.j + node.d / 2, k: (node.k || 0) + node.h + 0.35 };
  }
  return { ...anchor(node, 'top'), k: anchor(node, 'top').k + 0.15 };
}

function edgeLift(kind) {
  if (kind === 'stream' || kind === 'report') return 0.95;
  if (kind === 'settle' || kind === 'recon') return 0.55;
  if (kind === 'certify') return 1.15;
  return 0.2;
}

function beaconPts(c, s) {
  return `${c.x},${c.y - s} ${c.x + s},${c.y} ${c.x},${c.y + s} ${c.x - s},${c.y}`;
}

function floorPath(i, j, w, d, tile, k = 0) {
  return `M${p(i, j, k, tile)} L${p(i + w, j, k, tile)} L${p(i + w, j + d, k, tile)} L${p(i, j + d, k, tile)}Z`;
}

function gridLines(i0, j0, i1, j1, tile, k = 0) {
  const lines = [];
  for (let i = i0; i <= i1; i++) {
    const a = projectIso(i, j0, k, tile);
    const b = projectIso(i, j1, k, tile);
    const major = i % 2 === 0 ? ' cd-iso-grid--major' : '';
    lines.push(`<line class="cd-iso-grid${major}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`);
  }
  for (let j = j0; j <= j1; j++) {
    const a = projectIso(i0, j, k, tile);
    const b = projectIso(i1, j, k, tile);
    const major = j % 2 === 0 ? ' cd-iso-grid--major' : '';
    lines.push(`<line class="cd-iso-grid${major}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`);
  }
  return lines.join('');
}

function anchor(node, which = 'top') {
  const k = which === 'top' ? (node.k || 0) + node.h : (node.k || 0);
  return { i: node.i + node.w / 2, j: node.j + node.d / 2, k };
}

function samePt(a, b) {
  return Math.abs(a.i - b.i) < 0.02 && Math.abs(a.j - b.j) < 0.02 && Math.abs(a.k - b.k) < 0.02;
}

function pushPt(pts, pt) {
  const last = pts[pts.length - 1];
  if (!last || !samePt(last, pt)) pts.push(pt);
}

function routeOrtho(a, b, lift = 0.15, vias = []) {
  const ka = Math.max(a.k, lift);
  const kb = Math.max(b.k, lift);
  const top = Math.max(ka, kb);
  const start = { i: a.i, j: a.j, k: ka };
  const end = { i: b.i, j: b.j, k: kb };
  const waypoints = Array.isArray(vias) ? vias : [];
  if (waypoints.length) {
    const pts = [];
    pushPt(pts, start);
    pushPt(pts, { i: a.i, j: a.j, k: top });
    let pi = a.i;
    let pj = a.j;
    const hop = (i, j) => {
      if (Math.abs(i - pi) > 0.05 && Math.abs(j - pj) > 0.05) {
        pushPt(pts, { i, j: pj, k: top });
      }
      pushPt(pts, { i, j, k: top });
      pi = i;
      pj = j;
    };
    for (const v of waypoints) hop(v.i, v.j);
    hop(b.i, b.j);
    pushPt(pts, end);
    return pts;
  }
  if (Math.abs(ka - kb) < 0.05) {
    if (Math.abs(a.i - b.i) < 0.05 || Math.abs(a.j - b.j) < 0.05) {
      return [start, { i: end.i, j: end.j, k: top }, end];
    }
    return [start, { i: b.i, j: a.j, k: ka }, { i: b.i, j: b.j, k: ka }, end];
  }
  return [
    start,
    { i: a.i, j: a.j, k: top },
    { i: b.i, j: a.j, k: top },
    { i: b.i, j: b.j, k: top },
    end,
  ];
}

function polyline(pts, tile) {
  return pts.map((pt, n) => {
    const s = projectIso(pt.i, pt.j, pt.k, tile);
    return `${n === 0 ? 'M' : 'L'}${s.x.toFixed(2)},${s.y.toFixed(2)}`;
  }).join(' ');
}

function boundsOf(nodes, tile) {
  if (!nodes.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, w: 0, h: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const corners = [
      [n.i, n.j, n.k || 0],
      [n.i + n.w, n.j, n.k || 0],
      [n.i + n.w, n.j + n.d, n.k || 0],
      [n.i, n.j + n.d, n.k || 0],
      [n.i + n.w / 2, n.j + n.d / 2, (n.k || 0) + (n.h || 0)],
    ];
    for (const [i, j, k] of corners) {
      const { x, y } = projectIso(i, j, k, tile);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/**
 * CdIsoScene(root, opts) → { select, fit, setScope, setKinds, playFlow, destroy, getSelection }
 *
 * opts: { nodes, edges, flows?, layers?, stack?, labels?, tile?, onSelect?, onScope?, onStack? }
 */
export function CdIsoScene(root, opts = {}) {
  const tile = { ...TILE, ...(opts.tile || {}) };
  const model = {
    nodes: opts.nodes || [],
    edges: opts.edges || [],
    flows: opts.flows || [],
    layers: opts.layers || [],
  };
  const byId = () => Object.fromEntries(model.nodes.map((n) => [n.id, n]));

  let selected = null;
  let hovered = null;
  let scope = null;
  let kindFilter = new Set();
  let classifFilter = new Set();
  let zoneFilter = new Set();
  let stack = {
    mode: opts.stack?.mode || (model.layers.length ? 'exploded' : 'flat'),
    isolate: opts.stack?.isolate || null,
    gap: opts.stack?.gap ?? 3.2,
  };
  let labelMode = opts.labels || (stack.mode === 'flat' ? 'all' : 'pin');
  let cam = { x: 0, y: 0, z: 1 };
  let dragging = null;
  let raf = 0;
  let flow = null;
  const particles = [];

  root.classList.add('cd-iso');
  root.innerHTML = `
    <svg class="cd-iso__svg" aria-hidden="false" role="img">
      <g class="cd-iso__world"></g>
    </svg>
    <svg class="cd-iso__leaders" aria-hidden="true"></svg>
    <div class="cd-iso__labels"></div>
    <div class="cd-iso__scan cd-scanline"></div>
  `;
  const svg = root.querySelector('.cd-iso__svg');
  const world = root.querySelector('.cd-iso__world');
  const leaderLayer = root.querySelector('.cd-iso__leaders');
  const labelLayer = root.querySelector('.cd-iso__labels');
  let lastRaw = [];
  let lastPlaced = {};
  let userCam = false;

  function ancestors(n, map) {
    const ids = [];
    let cur = n;
    while (cur?.parent && map[cur.parent]) {
      ids.push(cur.parent);
      cur = map[cur.parent];
    }
    return ids;
  }

  function layerId(n, map = byId()) {
    if (n.layer) return n.layer;
    if (n.parent && map[n.parent]) return layerId(map[n.parent], map);
    return n.zone || (model.layers[0]?.id ?? 'default');
  }

  function layerIndex(id) {
    const idx = model.layers.findIndex((l) => l.id === id);
    return idx < 0 ? 0 : idx;
  }

  function stacked() {
    return stack.mode !== 'flat' && model.layers.length > 0;
  }

  function stackLift(n) {
    if (!stacked() || stack.mode === 'isolate') return 0;
    return layerIndex(layerId(n)) * stack.gap;
  }

  function layerOrigin(id, pool) {
    const map = byId();
    const members = (pool || model.nodes).filter((n) => layerId(n, map) === id);
    if (!members.length) return { i: 0, j: 0 };
    return {
      i: Math.min(...members.map((n) => n.i)),
      j: Math.min(...members.map((n) => n.j)),
    };
  }

  function stackFrame(pool) {
    const map = byId();
    const metrics = {};
    let frameW = 0;
    let frameD = 0;
    for (const layer of model.layers) {
      const members = (pool || model.nodes).filter((n) => layerId(n, map) === layer.id);
      if (!members.length) continue;
      const o = layerOrigin(layer.id, pool);
      const minI = Math.min(...members.map((n) => n.i)) - o.i;
      const minJ = Math.min(...members.map((n) => n.j)) - o.j;
      const maxI = Math.max(...members.map((n) => n.i + n.w)) - o.i;
      const maxJ = Math.max(...members.map((n) => n.j + n.d)) - o.j;
      const w = maxI - minI;
      const d = maxJ - minJ;
      metrics[layer.id] = { o, minI, minJ, w, d };
      frameW = Math.max(frameW, w);
      frameD = Math.max(frameD, d);
    }
    return { metrics, frameW: frameW + 1, frameD: frameD + 1 };
  }

  function makePlacer(pool) {
    if (!stacked()) {
      return (n) => ({ ...n, k: n.k || 0 });
    }
    const { metrics, frameW, frameD } = stackFrame(pool);
    return (n) => {
      const lift = stackLift(n);
      const m = metrics[layerId(n)];
      if (!m) return { ...n, k: (n.k || 0) + lift };
      return {
        ...n,
        i: (n.i - m.o.i) + (frameW - m.w) / 2,
        j: (n.j - m.o.j) + (frameD - m.d) / 2,
        k: (n.k || 0) + lift,
      };
    };
  }

  function visibleNodes() {
    const map = byId();
    return model.nodes.filter((n) => {
      if (scope) {
        const chain = [n.id, ...ancestors(n, map)];
        if (!chain.includes(scope)) return false;
      }
      if (stack.mode === 'isolate' && stack.isolate && layerId(n, map) !== stack.isolate) return false;
      if (kindFilter.size && !kindFilter.has(n.kind)) return false;
      if (classifFilter.size && !classifFilter.has(n.classif || 'u')) return false;
      if (zoneFilter.size && !zoneFilter.has(n.zone || '')) return false;
      return true;
    });
  }

  function visibleIds() {
    return new Set(visibleNodes().map((n) => n.id));
  }

  function visibleEdges() {
    const ids = visibleIds();
    return model.edges.filter((e) => ids.has(e.from) && ids.has(e.to));
  }

  function applyCam() {
    const { width, height } = root.getBoundingClientRect();
    world.setAttribute(
      'transform',
      `translate(${width / 2 + cam.x},${height / 2 + cam.y}) scale(${cam.z})`,
    );
    positionLabels();
  }

  function toScreen(i, j, k) {
    const { width, height } = root.getBoundingClientRect();
    const iso = projectIso(i, j, k, tile);
    return {
      x: width / 2 + cam.x + iso.x * cam.z,
      y: height / 2 + cam.y + iso.y * cam.z,
    };
  }

  const PIN_W = 156;
  const PIN_H = 22;
  const PIN_GAP = 4;
  const PIN_PAD = 10;

  function packPinned(items, height) {
    items.sort((a, b) => a.ty - b.ty);
    const room = height - PIN_PAD * 2;
    const need = items.length * PIN_H + Math.max(0, items.length - 1) * PIN_GAP;
    if (!items.length) return;
    if (need > room) {
      const span = room / items.length;
      items.forEach((it, i) => { it.ly = PIN_PAD + i * span; });
      return;
    }
    let y = PIN_PAD;
    for (const it of items) {
      it.ly = Math.max(y, Math.min(it.ty - PIN_H / 2, height - PIN_PAD - PIN_H));
      y = it.ly + PIN_H + PIN_GAP;
    }
    const last = items[items.length - 1];
    if (last.ly + PIN_H > height - PIN_PAD) {
      let shift = last.ly + PIN_H - (height - PIN_PAD);
      for (const it of items) it.ly -= shift;
      if (items[0].ly < PIN_PAD) {
        const span = room / items.length;
        items.forEach((it, i) => { it.ly = PIN_PAD + i * span; });
      }
    }
  }

  function leaderPath(side, lx, ly, tx, ty) {
    const y = ly + PIN_H / 2;
    const x0 = side === 'left' ? lx + PIN_W : lx;
    const elbow = side === 'left'
      ? Math.min(tx - 14, x0 + 22)
      : Math.max(tx + 14, x0 - 22);
    if (Math.abs(elbow - x0) < 1) {
      return `M${x0.toFixed(1)},${y.toFixed(1)} V${ty.toFixed(1)} H${tx.toFixed(1)}`;
    }
    return `M${x0.toFixed(1)},${y.toFixed(1)} H${elbow.toFixed(1)} V${ty.toFixed(1)} H${tx.toFixed(1)}`;
  }

  function positionLabels() {
    const { width, height } = root.getBoundingClientRect();
    const pins = [];

    for (const btn of labelLayer.querySelectorAll('.cd-iso-plate-label')) {
      const s = toScreen(Number(btn.dataset.i), Number(btn.dataset.j), Number(btn.dataset.k));
      btn.style.left = `${s.x}px`;
      btn.style.top = `${s.y}px`;
    }

    for (const btn of labelLayer.querySelectorAll('.cd-iso-label')) {
      const placed = lastPlaced[btn.dataset.id];
      if (!placed) continue;
      const a = labelAnchor(placed);
      const s = toScreen(a.i, a.j, a.k);
      if (labelMode !== 'pin') {
        btn.classList.remove('cd-iso-label--pin', 'cd-iso-label--pin-left', 'cd-iso-label--pin-right');
        btn.style.left = `${s.x}px`;
        btn.style.top = `${s.y}px`;
        continue;
      }
      pins.push({ btn, tx: s.x, ty: s.y, side: s.x < width / 2 ? 'left' : 'right' });
    }

    if (labelMode !== 'pin') {
      leaderLayer.innerHTML = '';
      return;
    }

    packPinned(pins.filter((p) => p.side === 'left'), height);
    packPinned(pins.filter((p) => p.side === 'right'), height);

    const leaders = [];
    for (const it of pins) {
      const lx = it.side === 'left' ? PIN_PAD : width - PIN_PAD - PIN_W;
      it.btn.classList.add('cd-iso-label--pin', `cd-iso-label--pin-${it.side}`);
      it.btn.style.left = `${lx}px`;
      it.btn.style.top = `${it.ly}px`;
      const hot = it.btn.classList.contains('is-selected') || it.btn.classList.contains('is-hovered') || it.btn.classList.contains('is-related');
      leaders.push(`
        <path class="cd-iso-leader${hot ? ' is-hot' : ''}" data-id="${it.btn.dataset.id}" d="${leaderPath(it.side, lx, it.ly, it.tx, it.ty)}" />
        <circle class="cd-iso-leader-dot${hot ? ' is-hot' : ''}" cx="${it.tx.toFixed(1)}" cy="${it.ty.toFixed(1)}" r="2.4" />
      `);
    }
    leaderLayer.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    leaderLayer.innerHTML = leaders.join('');
  }

  function syncLabelMode() {
    root.classList.toggle('cd-iso--labels-focus', labelMode === 'focus');
    root.classList.toggle('cd-iso--labels-pin', labelMode === 'pin');
    root.dataset.stack = stack.mode;
    if (labelMode === 'pin') positionLabels();
  }

  function plateSet(raw) {
    if (!stacked()) return [];
    const map = byId();
    const { frameW, frameD } = stackFrame(raw);
    return model.layers.map((layer, idx) => {
      if (stack.mode === 'isolate' && stack.isolate && layer.id !== stack.isolate) return null;
      const members = raw.filter((n) => layerId(n, map) === layer.id);
      if (!members.length) return null;
      const k = stack.mode === 'isolate' ? 0 : idx * stack.gap;
      return { ...layer, idx, i: -0.4, j: -0.4, w: frameW + 0.8, d: frameD + 0.8, h: 0.12, k };
    }).filter(Boolean);
  }

  function paint() {
    const raw = visibleNodes();
    const hideDistricts = stacked();
    const put = makePlacer(raw);
    const nodes = raw
      .filter((n) => !(hideDistricts && (n.kind === 'team' || n.kind === 'boundary')))
      .map(put)
      .sort((a, b) => depthKey(a) - depthKey(b));
    const placedById = Object.fromEntries(raw.map((n) => [n.id, put(n)]));
    lastRaw = raw;
    lastPlaced = placedById;
    const edges = visibleEdges();
    const plates = plateSet(raw);
    if (!nodes.length && !plates.length) {
      world.innerHTML = '';
      labelLayer.innerHTML = '';
      return;
    }

    const hull = [...nodes, ...plates];
    const iMin = Math.floor(Math.min(...hull.map((n) => n.i))) - 1;
    const jMin = Math.floor(Math.min(...hull.map((n) => n.j))) - 1;
    const iMax = Math.ceil(Math.max(...hull.map((n) => n.i + n.w))) + 1;
    const jMax = Math.ceil(Math.max(...hull.map((n) => n.j + n.d))) + 1;

    const plateMarkup = plates.map((pl) => {
      const top = floorPath(pl.i, pl.j, pl.w, pl.d, tile, pl.k);
      const g0 = Math.floor(pl.i);
      const g1 = Math.ceil(pl.i + pl.w);
      const h0 = Math.floor(pl.j);
      const h1 = Math.ceil(pl.j + pl.d);
      return `
        <g class="cd-iso-plate" data-layer="${pl.id}">
          <path class="cd-iso-plate__deck" d="${top}" />
          ${gridLines(g0, h0, g1, h1, tile, pl.k)}
        </g>
      `;
    }).join('');

    const risers = [];
    for (let i = 1; plates.length > 1 && i < plates.length; i++) {
      const a = plates[i - 1];
      const b = plates[i];
      const corners = [
        [a.i, a.j],
        [a.i + a.w, a.j],
        [a.i, a.j + a.d],
        [a.i + a.w, a.j + a.d],
      ];
      for (const [ci, cj] of corners) {
        const p0 = projectIso(ci, cj, a.k, tile);
        const p1 = projectIso(ci, cj, b.k, tile);
        risers.push(`<line class="cd-iso-riser" x1="${p0.x}" y1="${p0.y}" x2="${p1.x}" y2="${p1.y}" />`);
      }
    }

    const edgeMarkup = edges.map((e) => {
      const a = placedById[e.from];
      const b = placedById[e.to];
      if (!a || !b) return '';
      const d = polyline(routeOrtho(anchor(a, 'top'), anchor(b, 'top'), edgeLift(e.kind), e.via), tile);
      const cls = e.classif ? ` data-classif="${e.classif}"` : '';
      const track = e.track ? ` data-track="${e.track}"` : '';
      const hop = layerId(a) !== layerId(b) ? ' data-hop="1"' : '';
      const manhattan = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
      const span = manhattan > 7 ? ' data-span="1"' : '';
      return `
        <path class="cd-iso-edge-glow" data-kind="${e.kind}" data-id="${e.id}" d="${d}" />
        <path class="cd-iso-edge" data-kind="${e.kind}" data-id="${e.id}" data-from="${e.from}" data-to="${e.to}"${cls}${track}${hop}${span} d="${d}" />
      `;
    }).join('');

    const nodeMarkup = nodes.map((n) => {
      return `<g class="cd-iso-node ${shapeClass(shapeFor(n))}" data-id="${n.id}" data-kind="${n.kind}" tabindex="0" ${nodeAttrs(n)}>${innerMarkup(n, tile)}</g>`;
    }).join('');

    const worldFloor = stacked() ? '' : `
      <g class="cd-iso__floor-layer">
        <path class="cd-iso-floor" d="${floorPath(iMin, jMin, iMax - iMin, jMax - jMin, tile)}" />
        ${gridLines(iMin, jMin, iMax, jMax, tile)}
      </g>
    `;

    world.innerHTML = `
      ${worldFloor}
      <g class="cd-iso__plates">${plateMarkup}${risers.join('')}</g>
      <g class="cd-iso__edges">${edgeMarkup}</g>
      <g class="cd-iso__nodes">${nodeMarkup}</g>
      <g class="cd-iso__fx"></g>
    `;

    const nodeLabels = nodes.map((n) => {
      const showMarks = n.kind !== 'team' && n.kind !== 'actor' && n.kind !== 'boundary';
      const marks = showMarks ? [
        n.classif && n.classif !== 'u' ? `<span class="cd-iso-mark cd-iso-mark--${n.classif}">${n.classif}</span>` : '',
        n.il ? `<span class="cd-iso-mark cd-iso-mark--il">IL${n.il}</span>` : '',
        n.track === 'both' ? `<span class="cd-iso-mark cd-iso-mark--track">2T</span>` : '',
      ].join('') : '';
      return `
        <button type="button" class="cd-iso-label" data-id="${n.id}" data-kind="${n.kind}" data-classif="${n.classif || ''}" data-zone="${n.zone || ''}">
          <span class="cd-iso-label__kind">${n.kind}</span>
          <span class="cd-iso-label__name">${n.label}</span>
          ${marks}
        </button>
      `;
    }).join('');

    const plateLabels = plates.map((pl) => `
      <button type="button" class="cd-iso-plate-label" data-layer="${pl.id}" data-i="${pl.i + 0.4}" data-j="${pl.j + 0.2}" data-k="${pl.k}">
        <span class="cd-iso-plate-label__idx">L${pl.idx}</span>
        <span class="cd-iso-plate-label__name">${pl.title || pl.id}</span>
      </button>
    `).join('');

    labelLayer.innerHTML = plateLabels + nodeLabels;

    particles.length = 0;
    bindNodeEvents();
    bindPlateEvents();
    syncSelection();
    syncLabelMode();
    applyCam();
  }

  function bindPlateEvents() {
    root.querySelectorAll('.cd-iso-plate-label, .cd-iso-plate').forEach((el) => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = el.dataset.layer;
        if (!id) return;
        if (stack.mode === 'isolate' && stack.isolate === id) setStack({ mode: 'exploded', isolate: null });
        else setStack({ mode: 'isolate', isolate: id });
      });
    });
  }

  function bindNodeEvents() {
    root.querySelectorAll('.cd-iso-node, .cd-iso-label').forEach((nodeEl) => {
      const id = nodeEl.dataset.id;
      nodeEl.addEventListener('pointerenter', () => setHover(id));
      nodeEl.addEventListener('pointerleave', () => setHover(null));
      nodeEl.addEventListener('click', (ev) => {
        ev.stopPropagation();
        select(id);
      });
      nodeEl.addEventListener('dblclick', (ev) => {
        ev.stopPropagation();
        const n = byId()[id];
        if (n && (n.kind === 'team' || n.kind === 'boundary' || n.kind === 'enclave')) setScope(id);
      });
      nodeEl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          select(id);
        }
      });
    });
  }

  function setHover(id) {
    hovered = id;
    root.querySelectorAll('.is-hovered').forEach((n) => n.classList.remove('is-hovered'));
    if (!id) return;
    root.querySelectorAll(`[data-id="${id}"]`).forEach((n) => n.classList.add('is-hovered'));
  }

  function relatedIds(id) {
    const rel = new Set([id]);
    const map = byId();
    const node = map[id];
    if (node?.parent) rel.add(node.parent);
    for (const n of model.nodes) {
      if (n.parent === id) rel.add(n.id);
    }
    for (const e of model.edges) {
      if (e.from === id) rel.add(e.to);
      if (e.to === id) rel.add(e.from);
    }
    return rel;
  }

  function syncSelection() {
    root.classList.toggle('is-focusing', Boolean(selected));
    root.querySelectorAll('.is-selected, .is-related, .is-hot').forEach((n) => {
      n.classList.remove('is-selected', 'is-related', 'is-hot');
    });
    if (!selected) return;
    const rel = relatedIds(selected);
    root.querySelectorAll('.cd-iso-node, .cd-iso-label').forEach((n) => {
      if (n.dataset.id === selected) n.classList.add('is-selected');
      else if (rel.has(n.dataset.id)) n.classList.add('is-related');
    });
    root.querySelectorAll('.cd-iso-edge').forEach((n) => {
      if (n.dataset.from === selected || n.dataset.to === selected) n.classList.add('is-related');
    });
  }

  function select(id) {
    selected = id;
    syncSelection();
    const node = id ? byId()[id] : null;
    opts.onSelect?.(node, {
      edges: node ? model.edges.filter((e) => e.from === id || e.to === id) : [],
      related: node ? [...relatedIds(id)].map((rid) => byId()[rid]).filter(Boolean) : [],
    });
  }

  function setScope(id) {
    scope = id;
    selected = null;
    paint();
    fit(id ? 110 : 88);
    opts.onScope?.(id, byId()[id] || null);
    opts.onSelect?.(null, { edges: [], related: [] });
  }

  function setKinds(kinds) {
    kindFilter = new Set(kinds || []);
    paint();
  }

  function setClassifs(list) {
    classifFilter = new Set(list || []);
    paint();
  }

  function setZones(list) {
    zoneFilter = new Set(list || []);
    paint();
  }

  function setLayer(name) {
    if (name) root.dataset.layer = name;
    else delete root.dataset.layer;
  }

  function setStack(next = {}) {
    stack = { ...stack, ...next };
    paint();
    fit();
    opts.onStack?.(getStack());
  }

  function setLabels(mode) {
    labelMode = mode === 'all' || mode === 'pin' || mode === 'focus' ? mode : 'focus';
    syncLabelMode();
    opts.onStack?.(getStack());
  }

  function getStack() {
    return { ...stack, labels: labelMode, layers: model.layers };
  }

  function fit(padding = 88) {
    const raw = lastRaw.length ? lastRaw : visibleNodes();
    const hideDistricts = stacked();
    const put = lastRaw.length
      ? (n) => lastPlaced[n.id] || n
      : makePlacer(raw);
    const nodes = raw
      .filter((n) => !(hideDistricts && (n.kind === 'team' || n.kind === 'boundary')))
      .map(put);
    const plates = plateSet(raw);
    const hull = [...nodes, ...plates];
    if (!hull.length) return;
    const { width, height } = root.getBoundingClientRect();
    if (width < 40 || height < 40) return;
    const b = boundsOf(hull, tile);
    const gutter = labelMode === 'pin' ? 72 : 0;
    const z = Math.min(
      (width - padding * 2 - gutter * 2) / Math.max(1, b.w),
      (height - padding * 2) / Math.max(1, b.h),
      1.6,
    );
    cam.z = Math.max(0.2, z);
    cam.x = -((b.minX + b.maxX) / 2) * cam.z;
    cam.y = -((b.minY + b.maxY) / 2) * cam.z + 12;
    userCam = false;
    applyCam();
  }

  function onPointerDown(ev) {
    if (ev.target.closest('.cd-iso-node, .cd-iso-label, .cd-iso-edge, .cd-iso-plate-label')) return;
    dragging = { x: ev.clientX - cam.x, y: ev.clientY - cam.y };
    root.setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev) {
    if (!dragging) return;
    cam.x = ev.clientX - dragging.x;
    cam.y = ev.clientY - dragging.y;
    userCam = true;
    applyCam();
  }

  function onPointerUp() {
    dragging = null;
  }

  function onWheel(ev) {
    ev.preventDefault();
    const { width, height } = root.getBoundingClientRect();
    const mx = ev.clientX - root.getBoundingClientRect().left - width / 2;
    const my = ev.clientY - root.getBoundingClientRect().top - height / 2;
    const prev = cam.z;
    const next = Math.min(2.4, Math.max(0.2, cam.z * (ev.deltaY > 0 ? 0.92 : 1.08)));
    userCam = true;
    const k = next / prev;
    cam.x = mx - (mx - cam.x) * k;
    cam.y = my - (my - cam.y) * k;
    cam.z = next;
    applyCam();
  }

  function onBgClick(ev) {
    if (ev.target.closest('.cd-iso-node, .cd-iso-label, .cd-iso-edge, .cd-iso-plate-label')) return;
    select(null);
  }

  function tick(now) {
    const fx = world.querySelector('.cd-iso__fx');
    if (fx) {
      if (flow) stepFlow(now, fx);
      else renderAmbient(fx, now);
    }
    raf = requestAnimationFrame(tick);
  }

  function renderAmbient(fx, now) {
    const streams = [...world.querySelectorAll('.cd-iso-edge[data-kind="stream"], .cd-iso-edge[data-kind="report"], .cd-iso-edge[data-kind="settle"]')];
    if (!particles.length) {
      streams.forEach((path, i) => {
        particles.push({ path, t: (i * 0.27) % 1, speed: 0.00018 });
      });
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fx.innerHTML = particles.map((p) => {
      if (!p.path.isConnected) return '';
      if (!reduce) p.t = (p.t + p.speed * 16) % 1;
      const len = p.path.getTotalLength();
      const pt = p.path.getPointAtLength(p.t * len);
      return `<circle class="cd-iso-particle" data-kind="stream" r="3.2" cx="${pt.x}" cy="${pt.y}" />`;
    }).join('');
    void now;
  }

  function stepFlow(now, fx) {
    const elapsed = now - flow.started;
    const dur = 900;
    const hop = Math.min(flow.edgeIds.length - 1, Math.floor(elapsed / dur));
    const local = (elapsed % dur) / dur;
    const edgeId = flow.edgeIds[hop];
    const path = world.querySelector(`.cd-iso-edge[data-id="${edgeId}"]`);
    world.querySelectorAll('.cd-iso-edge').forEach((e) => e.classList.toggle('is-hot', e.dataset.id === edgeId));
    if (path) {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(local * len);
      fx.innerHTML = `<circle class="cd-iso-particle" data-kind="${path.dataset.kind}" r="4" cx="${pt.x}" cy="${pt.y}" />`;
      const edge = model.edges.find((e) => e.id === edgeId);
      if (edge && flow.lastHop !== hop) {
        flow.lastHop = hop;
        select(edge.to);
        opts.onFlow?.(flow.def, hop, edge);
      }
    }
    if (elapsed > dur * flow.edgeIds.length) {
      const done = flow.def;
      flow = null;
      opts.onFlow?.(done, -1, null);
    }
  }

  function playFlow(id) {
    const def = model.flows.find((f) => f.id === id);
    if (!def) return;
    if (stack.mode === 'isolate') {
      stack.mode = 'exploded';
      stack.isolate = null;
      paint();
      fit();
      opts.onStack?.(getStack());
    }
    particles.length = 0;
    flow = { def, edgeIds: def.edges, started: performance.now(), lastHop: -1 };
    if (def.edges[0]) {
      const e0 = model.edges.find((e) => e.id === def.edges[0]);
      if (e0) select(e0.from);
    }
  }

  function stopFlow() {
    flow = null;
    world.querySelectorAll('.is-hot').forEach((n) => n.classList.remove('is-hot'));
  }

  const ro = new ResizeObserver(() => {
    if (!userCam) fit();
    else applyCam();
  });
  ro.observe(root);
  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);
  root.addEventListener('wheel', onWheel, { passive: false });
  root.addEventListener('click', onBgClick);
  paint();
  requestAnimationFrame(() => {
    fit();
    opts.onStack?.(getStack());
  });
  raf = requestAnimationFrame(tick);

  return {
    select,
    fit,
    setScope,
    setKinds,
    setClassifs,
    setZones,
    setLayer,
    replaceModel(next = {}) {
      model.nodes = next.nodes || [];
      model.edges = next.edges || [];
      model.flows = next.flows || [];
      model.layers = next.layers || [];
      selected = null;
      scope = null;
      lastRaw = [];
      lastPlaced = {};
      if (next.stack) stack = { mode: 'flat', isolate: null, gap: 3.2, ...next.stack };
      if (next.labels) labelMode = next.labels;
      paint();
      fit();
      opts.onSelect?.(null, { edges: [], related: [] });
      opts.onScope?.(null);
      opts.onStack?.(getStack());
    },
    setStack,
    setLabels,
    getStack,
    playFlow,
    stopFlow,
    getSelection: () => selected,
    getScope: () => scope,
    getModel: () => model,
    node: (id) => byId()[id],
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerUp);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('click', onBgClick);
      root.innerHTML = '';
    },
  };
}
