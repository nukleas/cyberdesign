/**
 * cyberdesign/charts.js
 * Lightweight canvas + SVG chart helpers. No dependencies.
 * All colors read from --cd-* CSS variables so they respond to .theme-orange / .theme-cyan.
 */

// ── Utility ──────────────────────────────────────────────

function css(el, prop) {
  return getComputedStyle(el).getPropertyValue(prop).trim();
}

function colors(canvas) {
  const el = canvas.closest('[class*="theme-"]') || document.documentElement;
  return {
    bg:       css(el, '--cd-bg-panel')    || '#0b0f18',
    bgDark:   css(el, '--cd-bg')          || '#05060a',
    border:   css(el, '--cd-border')      || '#26324c',
    borderDim:css(el, '--cd-border-dim')  || '#1e1e24',
    text:     css(el, '--cd-text')        || '#e8e4e0',
    muted:    css(el, '--cd-text-muted')  || '#8a8078',
    accent:   css(el, '--cd-accent')      || '#ff8800',
    secondary:css(el, '--cd-accent-secondary') || '#ff2bd6',
    green:    css(el, '--cd-neon-green')  || '#52ff9f',
    red:      css(el, '--cd-neon-red')    || '#ff456c',
    yellow:   css(el, '--cd-neon-yellow') || '#f7ff5a',
    blue:     css(el, '--cd-neon-blue')   || '#6aa8ff',
  };
}

function dpr() { return window.devicePixelRatio || 1; }

function setupCanvas(canvas) {
  const parent = canvas.parentElement;
  const rect = parent.getBoundingClientRect();
  const ratio = dpr();
  const w = rect.width || 300;
  const h = rect.height || 200;
  canvas.width  = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  return { ctx, w, h };
}

// ── Line / Area Chart ────────────────────────────────────
/**
 * CdLineChart(canvas, opts) → { update(opts), destroy() }
 *
 * opts: {
 *   series: [{ data: number[], color?: string, fill?: boolean, label?: string }]
 *   min?: number,   // y-axis min (auto if null)
 *   max?: number,   // y-axis max (auto if null)
 *   gridLines?: number,
 *   xLabels?: string[],
 *   yFormat?: (v: number) => string,
 *   pad?: { top, right, bottom, left }
 * }
 */
export function CdLineChart(canvas, opts = {}) {
  let o = {
    series: [],
    min: null,
    max: null,
    gridLines: 4,
    xLabels: [],
    yFormat: v => Math.round(v),
    pad: { top: 16, right: 12, bottom: 28, left: 36 },
    ...opts,
  };

  let { ctx, w, h } = setupCanvas(canvas);
  const font = `700 10px ${css(document.documentElement, '--cd-font-mono') || 'monospace'}`;

  function draw() {
    const c = colors(canvas);
    const { top, right, bottom, left } = o.pad;
    const pw = w - left - right;
    const ph = h - top - bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    if (!o.series.length || !o.series[0].data.length) return;

    const allVals = o.series.flatMap(s => s.data).filter(Number.isFinite);
    let lo = o.min ?? Math.min(...allVals);
    let hi = o.max ?? Math.max(...allVals);
    if (lo === hi) { lo -= 1; hi += 1; }
    const range = hi - lo;
    const maxLen = Math.max(...o.series.map(s => s.data.length));

    function xp(i) { return left + (i / Math.max(maxLen - 1, 1)) * pw; }
    function yp(v) { return top + ph - ((v - lo) / range) * ph; }

    // Grid
    ctx.setLineDash([2, 5]);
    ctx.lineWidth = 1;
    ctx.font = font;
    ctx.textAlign = 'right';
    for (let g = 0; g <= o.gridLines; g++) {
      const y = top + (g / o.gridLines) * ph;
      const v = hi - (g / o.gridLines) * range;
      ctx.strokeStyle = c.borderDim;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + pw, y);
      ctx.stroke();
      ctx.fillStyle = c.muted;
      ctx.fillText(o.yFormat(v), left - 5, y + 3);
    }
    ctx.setLineDash([]);

    // X labels
    if (o.xLabels.length) {
      ctx.textAlign = 'center';
      ctx.fillStyle = c.muted;
      const every = Math.ceil(o.xLabels.length / 8);
      for (let i = 0; i < o.xLabels.length; i += every) {
        ctx.fillText(o.xLabels[i], xp(i), top + ph + 16);
      }
    }

    // Plot border
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, pw, ph);

    // Clip to plot area
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, pw, ph);
    ctx.clip();

    for (const s of o.series) {
      if (s.data.length < 2) continue;
      const col = s.color || c.accent;

      // Build smooth bezier path
      function buildPath() {
        ctx.beginPath();
        ctx.moveTo(xp(0), yp(s.data[0]));
        for (let i = 1; i < s.data.length; i++) {
          const cpx = (xp(i - 1) + xp(i)) / 2;
          ctx.bezierCurveTo(cpx, yp(s.data[i - 1]), cpx, yp(s.data[i]), xp(i), yp(s.data[i]));
        }
      }

      // Fill
      if (s.fill) {
        buildPath();
        ctx.lineTo(xp(s.data.length - 1), top + ph);
        ctx.lineTo(xp(0), top + ph);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, top, 0, top + ph);
        grad.addColorStop(0, col + '40');
        grad.addColorStop(1, col + '00');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Glow pass
      buildPath();
      ctx.strokeStyle = col + '28';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Main line
      buildPath();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // End-point dot
      const ex = xp(s.data.length - 1);
      const ey = yp(s.data[s.data.length - 1]);
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      // dot glow
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = col + '30';
      ctx.fill();
    }

    ctx.restore();
  }

  const ro = new ResizeObserver(() => {
    ({ ctx, w, h } = setupCanvas(canvas));
    draw();
  });
  ro.observe(canvas.parentElement);
  draw();

  return {
    update(newOpts) { o = { ...o, ...newOpts }; draw(); },
    redraw() { draw(); },
    destroy() { ro.disconnect(); },
  };
}

// ── Waveform / Oscilloscope ──────────────────────────────
/**
 * CdWaveform(canvas) → { push(Float32Array | Uint8Array), demo(), destroy() }
 *
 * push() feeds a time-domain sample buffer (Web Audio AnalyserNode).
 * demo() starts an animated sine wave for testing without audio.
 */
export function CdWaveform(canvas) {
  let { ctx, w, h } = setupCanvas(canvas);
  let buf = null;
  let rafId = null;
  let demoPhase = 0;
  let demoActive = false;

  function drawBuf(data, isFloat) {
    const c = colors(canvas);
    const col = c.yellow;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = c.bgDark;
    ctx.fillRect(0, 0, w, h);

    // Centre line
    ctx.strokeStyle = c.borderDim;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Waveform
    const step = Math.max(1, Math.floor(data.length / w));
    ctx.beginPath();
    for (let i = 0; i < w; i++) {
      const idx = i * step;
      const raw = isFloat ? data[idx] : (data[idx] / 128) - 1;
      const y = (h / 2) + raw * (h / 2) * 0.85;
      i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
    }

    // Glow stroke
    ctx.strokeStyle = col + '35';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Main stroke
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function demoTick(ts) {
    if (!demoActive) return;
    demoPhase = (ts / 1200) * Math.PI * 2;
    const samples = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const t = i / 512;
      samples[i] =
        Math.sin(demoPhase + t * Math.PI * 4) * 0.55 +
        Math.sin(demoPhase * 2.3 + t * Math.PI * 12) * 0.2 +
        Math.sin(demoPhase * 0.7 + t * Math.PI * 1.5) * 0.25;
    }
    drawBuf(samples, true);
    rafId = requestAnimationFrame(demoTick);
  }

  const ro = new ResizeObserver(() => {
    ({ ctx, w, h } = setupCanvas(canvas));
    if (buf) drawBuf(buf.data, buf.isFloat);
  });
  ro.observe(canvas.parentElement);

  return {
    push(data) {
      demoActive = false;
      cancelAnimationFrame(rafId);
      const isFloat = data instanceof Float32Array;
      buf = { data, isFloat };
      drawBuf(data, isFloat);
    },
    demo() {
      demoActive = true;
      rafId = requestAnimationFrame(demoTick);
    },
    destroy() {
      demoActive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    },
  };
}

// ── Radar / Spider Chart (SVG) ───────────────────────────
/**
 * CdRadar(svgEl, opts) → { update(opts), destroy() }
 *
 * opts: {
 *   axes: string[],
 *   series: [{ values: number[], color?: string, label?: string }],
 *   max?: number,   // defaults to 1.0
 *   rings?: number, // concentric grid rings (default 4)
 * }
 */
export function CdRadar(svg, opts = {}) {
  let o = { axes: [], series: [], max: 1, rings: 4, ...opts };

  function draw() {
    const c = colors(svg);
    const W = svg.clientWidth  || 240;
    const H = svg.clientHeight || 240;
    const cx = W / 2;
    const cy = H / 2;
    const r  = Math.min(cx, cy) * 0.72;
    const n  = o.axes.length;
    if (n < 3) return;

    function angle(i) { return (i / n) * Math.PI * 2 - Math.PI / 2; }
    function pt(i, frac) {
      const a = angle(i);
      return [cx + Math.cos(a) * r * frac, cy + Math.sin(a) * r * frac];
    }
    function polygon(fracs) {
      return fracs.map((f, i) => pt(i, f).join(',')).join(' ');
    }

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, parent = svg) {
      const e = document.createElementNS(ns, tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      parent.appendChild(e);
      return e;
    }

    // Grid rings
    for (let ring = 1; ring <= o.rings; ring++) {
      const frac = ring / o.rings;
      el('polygon', {
        points: polygon(Array(n).fill(frac)),
        fill: 'none',
        stroke: c.borderDim,
        'stroke-width': '1',
      });
    }

    // Spokes
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(i, 1);
      el('line', { x1: cx, y1: cy, x2: x, y2: y, stroke: c.borderDim, 'stroke-width': '1' });
    }

    // Axis labels
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(i, 1.14);
      const t = el('text', {
        x, y,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        fill: c.muted,
        'font-size': '10',
        'font-family': 'monospace',
        'font-weight': '700',
        'letter-spacing': '0.1em',
        'text-transform': 'uppercase',
      });
      t.textContent = o.axes[i].toUpperCase();
    }

    // Series
    for (const s of o.series) {
      const col = s.color || c.accent;
      const fracs = s.values.map(v => Math.min(v / o.max, 1));

      // Fill
      el('polygon', {
        points: polygon(fracs),
        fill: col + '22',
        stroke: 'none',
      });

      // Stroke
      el('polygon', {
        points: polygon(fracs),
        fill: 'none',
        stroke: col,
        'stroke-width': '1.5',
      });

      // Glow stroke
      el('polygon', {
        points: polygon(fracs),
        fill: 'none',
        stroke: col + '30',
        'stroke-width': '5',
      });

      // Data point dots
      for (let i = 0; i < n; i++) {
        const [x, y] = pt(i, fracs[i]);
        el('circle', { cx: x, cy: y, r: '3', fill: col });
        el('circle', { cx: x, cy: y, r: '6', fill: col + '30' });
      }
    }
  }

  const ro = new ResizeObserver(draw);
  ro.observe(svg);
  draw();

  return {
    update(newOpts) { o = { ...o, ...newOpts }; draw(); },
    destroy() { ro.disconnect(); },
  };
}

// ── Bar Chart (canvas) ───────────────────────────────────
/**
 * CdBarChart(canvas, opts) → { update(opts), destroy() }
 *
 * opts: {
 *   bars: [{ label: string, value: number, color?: string }],
 *   max?: number,   // y-axis max (auto if null)
 *   pad?: { top, right, bottom, left }
 *   barGap?: number,  // 0–1, fraction of bar width that is gap
 * }
 */
export function CdBarChart(canvas, opts = {}) {
  let o = {
    bars: [],
    max: null,
    pad: { top: 16, right: 12, bottom: 28, left: 36 },
    barGap: 0.25,
    yFormat: v => Math.round(v),
    gridLines: 4,
    ...opts,
  };

  let { ctx, w, h } = setupCanvas(canvas);
  const font = `700 10px ${css(document.documentElement, '--cd-font-mono') || 'monospace'}`;

  function draw() {
    const c = colors(canvas);
    const { top, right, bottom, left } = o.pad;
    const pw = w - left - right;
    const ph = h - top - bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    if (!o.bars.length) return;

    const hi = o.max ?? Math.max(...o.bars.map(b => b.value));
    const lo = 0;
    const range = hi - lo || 1;

    function yp(v) { return top + ph - ((v - lo) / range) * ph; }

    // Grid
    ctx.font = font;
    ctx.textAlign = 'right';
    for (let g = 0; g <= o.gridLines; g++) {
      const y = top + (g / o.gridLines) * ph;
      const v = hi - (g / o.gridLines) * range;
      ctx.strokeStyle = c.borderDim;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + pw, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = c.muted;
      ctx.fillText(o.yFormat(v), left - 5, y + 3);
    }

    ctx.strokeStyle = c.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, pw, ph);

    const n = o.bars.length;
    const slotW = pw / n;
    const gap = slotW * o.barGap;
    const barW = slotW - gap;

    for (let i = 0; i < n; i++) {
      const bar = o.bars[i];
      const col = bar.color || c.accent;
      const bx = left + i * slotW + gap / 2;
      const by = yp(bar.value);
      const bh = top + ph - by;

      // Bar fill
      const grad = ctx.createLinearGradient(0, by, 0, by + bh);
      grad.addColorStop(0, col + 'cc');
      grad.addColorStop(1, col + '44');
      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, barW, bh);

      // Top glow line
      ctx.fillStyle = col;
      ctx.fillRect(bx, by, barW, 2);

      // Label
      ctx.textAlign = 'center';
      ctx.fillStyle = c.muted;
      ctx.fillText(bar.label.toUpperCase().slice(0, 8), bx + barW / 2, top + ph + 16);
    }
  }

  const ro = new ResizeObserver(() => {
    ({ ctx, w, h } = setupCanvas(canvas));
    draw();
  });
  ro.observe(canvas.parentElement);
  draw();

  return {
    update(newOpts) { o = { ...o, ...newOpts }; draw(); },
    redraw() { draw(); },
    destroy() { ro.disconnect(); },
  };
}
