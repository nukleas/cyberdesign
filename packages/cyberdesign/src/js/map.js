/**
 * cyberdesign/map.js
 * SVG atlas projector. Geometry via vendored d3-geo + topojson-client.
 * Fills/strokes come from .cd-map-* CSS (token-only). JS owns projection + interaction.
 */

import {
  feature,
  geoAlbersUsa,
  geoGraticule,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
  mesh,
} from './vendor/geo-kit.js';

const ATLAS_URL = {
  world: new URL('./maps/countries-110m.json', import.meta.url),
  us: new URL('./maps/states-10m.json', import.meta.url),
  oc: new URL('./maps/oc-boundary.json', import.meta.url),
};

const cache = new Map();

const PIN = {
  default: { glow: 14, core: 5.5 },
  crime: { glow: 18, core: 6.5 },
  power: { glow: 20, core: 7 },
  event: { glow: 14, core: 5.5 },
  air: { glow: 14, core: 5.5 },
  sensor: { glow: 12, core: 4.5 },
  construction: { glow: 12, core: 5 },
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

async function loadJson(url) {
  const key = String(url);
  if (cache.has(key)) return cache.get(key);
  const data = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`atlas ${r.status}: ${key}`);
    return r.json();
  });
  cache.set(key, data);
  return data;
}

function makeProjection(name) {
  if (name === 'albersUsa') return geoAlbersUsa();
  if (name === 'orthographic') return geoOrthographic().clipAngle(90).precision(0.5);
  if (name === 'mercator') return geoMercator();
  return geoNaturalEarth1();
}

function defaultProjection(atlas) {
  if (atlas === 'us') return 'albersUsa';
  if (atlas === 'sit') return 'mercator';
  return 'naturalEarth';
}

function unitName(f) {
  return f.properties?.name || f.id || '';
}

function levelOf(id, values) {
  if (!values || values[id] == null && values[String(id)] == null) return 0;
  const v = Number(values[id] ?? values[String(id)]);
  if (!Number.isFinite(v) || v <= 0) return 0;
  return Math.max(1, Math.min(4, Math.ceil(v * 4)));
}

function circlePoly(lng, lat, km, steps = 48) {
  const coords = [];
  const earth = 6371;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const dLat = (km / earth) * (180 / Math.PI) * Math.sin(a);
    const dLng = ((km / earth) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180)) * Math.cos(a);
    coords.push([lng + dLng, lat + dLat]);
  }
  return { type: 'Polygon', coordinates: [coords] };
}

export { circlePoly };

export async function loadAtlas(name) {
  if (name === 'us') {
    const topo = await loadJson(ATLAS_URL.us);
    return {
      name: 'us',
      units: feature(topo, topo.objects.states).features,
      land: feature(topo, topo.objects.nation),
      mesh: mesh(topo, topo.objects.states, (a, b) => a !== b),
      outline: null,
    };
  }
  if (name === 'sit') {
    const oc = await loadJson(ATLAS_URL.oc);
    return {
      name: 'sit',
      units: [],
      land: null,
      mesh: null,
      outline: oc,
    };
  }
  const topo = await loadJson(ATLAS_URL.world);
  return {
    name: 'world',
    units: feature(topo, topo.objects.countries).features,
    land: feature(topo, topo.objects.land),
    mesh: mesh(topo, topo.objects.countries, (a, b) => a !== b),
    outline: null,
  };
}

export function CdMapScene(root, opts = {}) {
  const host = typeof root === 'string' ? document.querySelector(root) : root;
  if (!host) throw new Error('CdMapScene: root not found');

  host.classList.add('cd-map');
  host.innerHTML = `
    <svg class="cd-map__svg" aria-label="Atlas map">
      <g class="cd-map__world"></g>
    </svg>
    <svg class="cd-map__leaders" aria-hidden="true"></svg>
    <div class="cd-map__labels"></div>
    <div class="cd-map-tip" hidden></div>
    <div class="cd-map-hud cd-map-hud--coords" data-coords>— // —</div>
  `;

  const svg = host.querySelector('.cd-map__svg');
  const world = host.querySelector('.cd-map__world');
  const leaders = host.querySelector('.cd-map__leaders');
  const labels = host.querySelector('.cd-map__labels');
  const tip = host.querySelector('.cd-map-tip');
  const coordsEl = host.querySelector('[data-coords]');

  let atlasName = opts.atlas || 'world';
  let projName = opts.projection || defaultProjection(atlasName);
  let atlas = null;
  let pins = opts.pins || [];
  let areas = opts.areas || [];
  let values = opts.values || null;
  let labelMode = opts.labels === 'all' || opts.labels === 'pin' ? opts.labels : 'focus';
  let hiddenKinds = new Set(opts.hiddenKinds || []);
  let selected = null;
  let hovered = null;
  let ready = false;
  let cam = { x: 0, y: 0, z: 1 };
  let userCam = false;
  let dragging = null;
  let rotate = [-20, -15];
  const path = geoPath();

  host.classList.toggle('cd-map--labels-focus', labelMode === 'focus');
  host.classList.toggle('cd-map--labels-pin', labelMode === 'pin');

  function projection() {
    const p = makeProjection(projName);
    if (projName === 'orthographic') p.rotate(rotate);
    return p;
  }

  function geoForFit() {
    if (atlas?.name === 'sit' && atlas.outline) return atlas.outline;
    if (atlas?.land) return atlas.land;
    if (atlas?.outline) return atlas.outline;
    const units = atlas?.units || [];
    if (!units.length) return null;
    return { type: 'FeatureCollection', features: units };
  }

  function sizedProjection() {
    const { width, height } = host.getBoundingClientRect();
    const p = projection();
    const pad = atlas?.name === 'sit' ? 36 : 28;
    const geo = geoForFit();
    if (width > 40 && height > 40 && geo) {
      try {
        p.fitExtent([[pad, pad], [width - pad, height - pad]], geo);
      } catch {
        /* empty geometry */
      }
    }
    return p;
  }

  function paint() {
    if (!atlas || atlas.name !== atlasName) return;
    const { width, height } = host.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    leaders.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);

    const proj = sizedProjection();
    path.projection(proj);

    const sphere = projName === 'orthographic'
      ? `<path class="cd-map__sphere" d="${path({ type: 'Sphere' }) || ''}"></path>`
      : '';
    const graticule = atlasName === 'sit'
      ? ''
      : `<path class="cd-map__graticule" d="${path(geoGraticule()()) || ''}"></path>`;
    const land = atlas.land
      ? `<path class="cd-map__land" d="${path(atlas.land) || ''}"></path>`
      : '';
    const unitMarkup = atlas.units.map((f) => {
      const id = String(f.id ?? unitName(f));
      const d = path(f);
      if (!d) return '';
      const lvl = levelOf(f.id, values);
      return `<path class="cd-map__unit" data-id="${esc(id)}" data-kind="unit" data-name="${esc(unitName(f))}" data-level="${lvl}" d="${d}"></path>`;
    }).join('');
    const meshMarkup = atlas.mesh
      ? `<path class="cd-map__mesh" d="${path(atlas.mesh) || ''}"></path>`
      : '';
    const outline = atlas.outline
      ? `<path class="cd-map__boundary" d="${path(atlas.outline) || ''}"></path>`
      : '';

    const areaMarkup = areas.filter((a) => !hiddenKinds.has(a.kind)).map((a) => {
      const d = path(a.geometry);
      if (!d || d.includes('NaN')) return '';
      return `<path class="cd-map-area" data-id="${esc(a.id)}" data-kind="${esc(a.kind)}" data-name="${esc(a.label || a.kind)}" d="${d}"></path>`;
    }).join('');

    const pinMarkup = pins.filter((p) => !hiddenKinds.has(p.kind) && !hiddenKinds.has('pin')).map((p) => {
      const xy = proj([p.lng, p.lat]);
      if (!xy || !Number.isFinite(xy[0]) || !Number.isFinite(xy[1])) return '';
      const spec = PIN[p.kind] || PIN.default;
      const mark = p.mark
        ? `<text class="cd-map-pin__mark" x="0" y="0.4">${esc(p.mark)}</text>`
        : `<circle class="cd-map-pin__dot" r="1.8"></circle>`;
      return `
        <g class="cd-map-pin" data-id="${esc(p.id)}" data-kind="${esc(p.kind || 'default')}" data-fresh="${esc(p.fresh || 'today')}" data-name="${esc(p.label)}" transform="translate(${xy[0].toFixed(2)},${xy[1].toFixed(2)})">
          <circle class="cd-map-pin__glow" r="${spec.glow}"></circle>
          <circle class="cd-map-pin__core" r="${spec.core}"></circle>
          ${mark}
        </g>`;
    }).join('');

    world.innerHTML = `
      ${sphere}
      ${graticule}
      ${land}
      <g class="cd-map__units">${unitMarkup}</g>
      ${meshMarkup}
      ${outline}
      <g class="cd-map__areas">${areaMarkup}</g>
      <g class="cd-map__pins">${pinMarkup}</g>
    `;

    const labelItems = [
      ...pins.filter((p) => !hiddenKinds.has(p.kind) && !hiddenKinds.has('pin')).map((p) => {
        const xy = proj([p.lng, p.lat]);
        return xy && Number.isFinite(xy[0]) && Number.isFinite(xy[1])
          ? { id: p.id, kind: p.kind || 'pin', name: p.label, x: xy[0], y: xy[1], pin: true }
          : null;
      }),
    ].filter(Boolean);

    labels.innerHTML = labelItems.map((it) => `
      <button type="button" class="cd-map-label" data-id="${esc(it.id)}" data-kind="${esc(it.kind)}">
        <span class="cd-map-label__kind">${esc(it.kind)}</span>
        <span class="cd-map-label__name">${esc(it.name)}</span>
      </button>
    `).join('');

    bindEvents();
    syncSelection();
    applyCam();
  }

  function applyCam() {
    world.setAttribute('transform', `translate(${cam.x},${cam.y}) scale(${cam.z})`);
    positionLabels();
  }

  function toScreen(x, y) {
    return { x: cam.x + x * cam.z, y: cam.y + y * cam.z };
  }

  function positionLabels() {
    const { width, height } = host.getBoundingClientRect();
    const proj = sizedProjection();
    const buttons = [...labels.querySelectorAll('.cd-map-label')];
    const pinMode = labelMode === 'pin';
    const items = buttons.map((el) => {
      const pin = pins.find((p) => p.id === el.dataset.id);
      if (!pin) return null;
      const xy = proj([pin.lng, pin.lat]);
      if (!xy) return null;
      const s = toScreen(xy[0], xy[1]);
      return { el, ...s, id: pin.id };
    }).filter(Boolean);

    if (pinMode) {
      items.sort((a, b) => a.y - b.y);
      items.forEach((it, i) => {
        const ly = 12 + i * 22;
        it.el.style.left = `${width - 168}px`;
        it.el.style.top = `${ly}px`;
        it.el.style.transform = 'none';
      });
      leaders.innerHTML = items.map((it) => {
        const x0 = width - 168;
        const y0 = 12 + items.indexOf(it) * 22 + 10;
        return `<path class="cd-map-leader${it.id === selected ? ' is-hot' : ''}" d="M${x0},${y0} H${(it.x + 8).toFixed(1)} V${it.y.toFixed(1)}" />`;
      }).join('');
      return;
    }

    leaders.innerHTML = '';
    for (const it of items) {
      it.el.style.left = `${it.x + 10}px`;
      it.el.style.top = `${it.y - 10}px`;
      it.el.style.transform = 'none';
    }
    void height;
  }

  function bindEvents() {
    host.querySelectorAll('.cd-map__unit, .cd-map-area, .cd-map-pin, .cd-map-label').forEach((el) => {
      const id = el.dataset.id;
      el.addEventListener('pointerenter', () => setHover(id, el));
      el.addEventListener('pointerleave', () => setHover(null));
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        select(id);
      });
    });
  }

  function featureOf(id) {
    const pin = pins.find((p) => p.id === id);
    if (pin) return { type: 'pin', ...pin };
    const area = areas.find((a) => a.id === id);
    if (area) return { type: 'area', ...area };
    const unit = atlas?.units.find((f) => String(f.id) === String(id));
    if (unit) return { type: 'unit', id: String(unit.id), label: unitName(unit), feature: unit };
    return null;
  }

  function setHover(id, el) {
    hovered = id;
    host.querySelectorAll('.is-hovered').forEach((n) => n.classList.remove('is-hovered'));
    if (!id) {
      tip.hidden = true;
      return;
    }
    host.querySelectorAll(`[data-id="${CSS.escape(id)}"]`).forEach((n) => n.classList.add('is-hovered'));
    const feat = featureOf(id);
    if (feat && el) {
      const name = feat.label || feat.name || id;
      const kind = (feat.type === 'unit' ? 'REGION' : feat.kind || feat.type || '').toUpperCase();
      tip.innerHTML = `<strong>${esc(kind)}</strong> ${esc(name)}`;
      tip.hidden = false;
    }
  }

  function syncSelection() {
    host.classList.toggle('is-focusing', Boolean(selected));
    host.querySelectorAll('.is-selected').forEach((n) => n.classList.remove('is-selected'));
    if (!selected) return;
    host.querySelectorAll(`[data-id="${CSS.escape(selected)}"]`).forEach((n) => n.classList.add('is-selected'));
  }

  function select(id) {
    selected = id;
    syncSelection();
    opts.onSelect?.(id ? featureOf(id) : null);
  }

  function setTipPos(ev) {
    if (tip.hidden) return;
    const r = host.getBoundingClientRect();
    tip.style.left = `${ev.clientX - r.left + 12}px`;
    tip.style.top = `${ev.clientY - r.top - 10}px`;
  }

  function invert(ev) {
    const r = host.getBoundingClientRect();
    const sx = ev.clientX - r.left;
    const sy = ev.clientY - r.top;
    const x = (sx - cam.x) / cam.z;
    const y = (sy - cam.y) / cam.z;
    const proj = sizedProjection();
    return proj.invert ? proj.invert([x, y]) : null;
  }

  function onPointerDown(ev) {
    if (ev.target.closest('.cd-map-pin, .cd-map-label, .cd-map-hud, .cd-map-area')) return;
    dragging = {
      x: ev.clientX,
      y: ev.clientY,
      camX: cam.x,
      camY: cam.y,
      rot: rotate.slice(),
    };
    host.setPointerCapture(ev.pointerId);
  }

  function onPointerMove(ev) {
    setTipPos(ev);
    const ll = invert(ev);
    if (ll && Number.isFinite(ll[0]) && Number.isFinite(ll[1])) {
      const place = atlasName === 'sit' ? 'ORANGE COUNTY, CA' : atlasName === 'us' ? 'UNITED STATES' : 'WORLD';
      coordsEl.textContent = `${ll[1].toFixed(4)}, ${ll[0].toFixed(4)} // ${place}`;
      opts.onPointer?.({ lng: ll[0], lat: ll[1] });
    }
    if (!dragging) return;
    const dx = ev.clientX - dragging.x;
    const dy = ev.clientY - dragging.y;
    if (projName === 'orthographic') {
      rotate = [dragging.rot[0] + dx * 0.35, dragging.rot[1] - dy * 0.25];
      rotate[1] = Math.max(-80, Math.min(80, rotate[1]));
      userCam = true;
      paint();
      return;
    }
    cam.x = dragging.camX + dx;
    cam.y = dragging.camY + dy;
    userCam = true;
    applyCam();
  }

  function onPointerUp() {
    dragging = null;
  }

  function onWheel(ev) {
    ev.preventDefault();
    const r = host.getBoundingClientRect();
    const mx = ev.clientX - r.left;
    const my = ev.clientY - r.top;
    const next = Math.max(0.4, Math.min(8, cam.z * (ev.deltaY < 0 ? 1.12 : 0.89)));
    const k = next / cam.z;
    cam.x = mx - (mx - cam.x) * k;
    cam.y = my - (my - cam.y) * k;
    cam.z = next;
    userCam = true;
    applyCam();
  }

  function onClickBg(ev) {
    if (ev.target.closest('.cd-map-pin, .cd-map__unit, .cd-map-area, .cd-map-label, .cd-map-hud')) return;
    select(null);
  }

  function fit() {
    cam = { x: 0, y: 0, z: 1 };
    userCam = false;
    if (projName === 'orthographic') rotate = atlasName === 'world' ? [-20, -15] : [117, -34];
    paint();
  }

  async function setAtlas(name, extra = {}) {
    atlasName = name;
    if (extra.projection) projName = extra.projection;
    else projName = defaultProjection(name);
    if ('pins' in extra) pins = extra.pins || [];
    if ('areas' in extra) areas = extra.areas || [];
    if ('values' in extra) values = extra.values;
    atlas = await loadAtlas(name);
    ready = true;
    fit();
    opts.onAtlas?.(atlasName, atlas);
  }

  function setProjection(name) {
    projName = name;
    fit();
  }

  function setPins(next) {
    pins = next || [];
    paint();
  }

  function setAreas(next) {
    areas = next || [];
    paint();
  }

  function setValues(next) {
    values = next;
    paint();
  }

  function setLabels(mode) {
    labelMode = mode === 'all' || mode === 'pin' ? mode : 'focus';
    host.classList.toggle('cd-map--labels-focus', labelMode === 'focus');
    host.classList.toggle('cd-map--labels-pin', labelMode === 'pin');
    positionLabels();
  }

  function setHiddenKinds(list) {
    hiddenKinds = new Set(list || []);
    paint();
  }

  const ro = new ResizeObserver(() => {
    if (!ready) return;
    if (!userCam) fit();
    else paint();
  });
  ro.observe(host);

  host.addEventListener('pointerdown', onPointerDown);
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerup', onPointerUp);
  host.addEventListener('pointercancel', onPointerUp);
  host.addEventListener('wheel', onWheel, { passive: false });
  host.addEventListener('click', onClickBg);

  setAtlas(atlasName, { projection: projName, pins, areas, values });

  return {
    setAtlas,
    setProjection,
    setPins,
    setAreas,
    setValues,
    setLabels,
    setHiddenKinds,
    select,
    fit,
    getSelection: () => featureOf(selected),
    destroy() {
      ro.disconnect();
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('wheel', onWheel);
      host.removeEventListener('click', onClickBg);
    },
  };
}
