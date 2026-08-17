/**
 * cyberdesign/map.js
 * SVG atlas projector. Geometry via vendored d3-geo + topojson-client.
 * Fills/strokes come from .cd-map-* CSS (token-only). JS owns projection + interaction.
 *
 * Atlases are basemaps (`world`, `us`, or none). Jurisdiction, pins, and areas
 * are data — the same way iso keeps model off the projector.
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
};

const cache = new Map();

const PIN_SPEC = {
  default: { glow: 14, core: 5.5 },
  crime: { glow: 18, core: 6.5 },
  power: { glow: 20, core: 7 },
  event: { glow: 14, core: 5.5 },
  air: { glow: 14, core: 5.5 },
  sensor: { glow: 12, core: 4.5 },
  construction: { glow: 12, core: 5 },
};

const EMPTY_ATLAS = { name: 'none', units: [], land: null, mesh: null };

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function isFinitePt(xy) {
  return Array.isArray(xy) && Number.isFinite(xy[0]) && Number.isFinite(xy[1]);
}

async function loadJson(url) {
  const key = String(url);
  if (!cache.has(key)) {
    cache.set(key, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`atlas ${r.status}: ${key}`);
      return r.json();
    }));
  }
  return cache.get(key);
}

function makeProjection(name) {
  if (name === 'albersUsa') return geoAlbersUsa();
  if (name === 'orthographic') return geoOrthographic().clipAngle(90).precision(0.5);
  if (name === 'mercator') return geoMercator();
  return geoNaturalEarth1();
}

function defaultProjection(atlas) {
  if (atlas === 'us') return 'albersUsa';
  if (atlas === 'none' || !atlas) return 'mercator';
  return 'naturalEarth';
}

function unitName(f) {
  return f.properties?.name || f.id || '';
}

function unitId(f) {
  return String(f.id ?? unitName(f));
}

function levelOf(id, values) {
  if (!values) return 0;
  const v = Number(values[id] ?? values[String(id)]);
  if (!Number.isFinite(v) || v <= 0) return 0;
  return Math.max(1, Math.min(4, Math.ceil(v * 4)));
}

/** Closed polygon around a point. `km` is radius. Exterior is CCW for d3-geo. */
export function circlePoly(lng, lat, km, steps = 48, aspect = 1) {
  const coords = [];
  const earth = 6371;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const dLat = (km / earth) * (180 / Math.PI) * Math.sin(a);
    const dLng = ((km * aspect) / earth) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180) * Math.cos(a);
    coords.push([lng + dLng, lat + dLat]);
  }
  coords.reverse();
  return { type: 'Polygon', coordinates: [coords] };
}

/** Load a named basemap. `none` is outline-only (no units). */
export async function loadAtlas(name) {
  if (!name || name === 'none') return { ...EMPTY_ATLAS };
  if (name === 'us') {
    const topo = await loadJson(ATLAS_URL.us);
    return {
      name: 'us',
      units: feature(topo, topo.objects.states).features,
      land: feature(topo, topo.objects.nation),
      mesh: mesh(topo, topo.objects.states, (a, b) => a !== b),
    };
  }
  if (name !== 'world') throw new Error(`CdMapScene: unknown atlas "${name}"`);
  const topo = await loadJson(ATLAS_URL.world);
  return {
    name: 'world',
    units: feature(topo, topo.objects.countries).features,
    land: feature(topo, topo.objects.land),
    mesh: mesh(topo, topo.objects.countries, (a, b) => a !== b),
  };
}

function itemOf(type, rec, extras = {}) {
  return {
    type,
    id: String(rec.id),
    kind: rec.kind || type,
    label: rec.label || rec.name || String(rec.id),
    lng: rec.lng,
    lat: rec.lat,
    data: rec,
    ...extras,
  };
}

/**
 * CdMapScene(root, opts) → scene
 *
 * @param {Element|string} root
 * @param {object} [opts]
 * @param {'world'|'us'|'none'} [opts.atlas='world']
 * @param {'naturalEarth'|'albersUsa'|'orthographic'|'mercator'} [opts.projection]
 * @param {object|null} [opts.outline] GeoJSON Feature — dashed jurisdiction
 * @param {'atlas'|'outline'} [opts.fit] frame target; outline if set, else atlas
 * @param {object[]} [opts.pins]  { id, lng, lat, label, kind?, fresh?, glyph? }
 * @param {object[]} [opts.areas] { id, kind, label?, geometry }
 * @param {Record<string, number>|null} [opts.values] 0–1 by unit id (string)
 * @param {'focus'|'all'|'pin'} [opts.labels='focus']
 * @param {string[]} [opts.kinds] area-kind allowlist; empty = all
 * @param {boolean} [opts.showPins=true]
 * @param {(item: object|null) => void} [opts.onSelect]
 * @param {(ll: {lng:number, lat:number}) => void} [opts.onPointer]
 */
export function CdMapScene(root, opts = {}) {
  const host = typeof root === 'string' ? document.querySelector(root) : root;
  if (!host) throw new Error('CdMapScene: root not found');

  host.classList.add('cd-map');
  host.innerHTML = `
    <svg class="cd-map__svg" role="img" aria-label="Atlas map">
      <g class="cd-map__world"></g>
    </svg>
    <svg class="cd-map__leaders" aria-hidden="true"></svg>
    <div class="cd-map__labels"></div>
    <div class="cd-map-tip" hidden></div>
  `;

  const svg = host.querySelector('.cd-map__svg');
  const world = host.querySelector('.cd-map__world');
  const leaders = host.querySelector('.cd-map__leaders');
  const labels = host.querySelector('.cd-map__labels');
  const tip = host.querySelector('.cd-map-tip');

  let atlasName = opts.atlas || 'world';
  let projName = opts.projection || defaultProjection(atlasName);
  let atlas = null;
  let outline = opts.outline || null;
  let fitMode = opts.fit || (opts.outline ? 'outline' : 'atlas');
  let pins = opts.pins || [];
  let areas = opts.areas || [];
  let values = opts.values || null;
  let labelMode = opts.labels === 'all' || opts.labels === 'pin' ? opts.labels : 'focus';
  let kindFilter = new Set(opts.kinds || []);
  let showPins = opts.showPins !== false;
  let selected = null;
  let ready = false;
  let cam = { x: 0, y: 0, z: 1 };
  let userCam = false;
  let dragging = null;
  let rotate = [-20, -15];
  const path = geoPath();

  let resolveReady;
  const readyPromise = new Promise((r) => { resolveReady = r; });

  host.classList.toggle('cd-map--labels-focus', labelMode === 'focus');
  host.classList.toggle('cd-map--labels-pin', labelMode === 'pin');

  function projection() {
    const p = makeProjection(projName);
    if (projName === 'orthographic') p.rotate(rotate);
    return p;
  }

  function geoForFit() {
    if (fitMode === 'outline' && outline) return outline;
    if (atlas?.land) return atlas.land;
    if (outline) return outline;
    const units = atlas?.units || [];
    if (!units.length) return null;
    return { type: 'FeatureCollection', features: units };
  }

  function sizedProjection() {
    const { width, height } = host.getBoundingClientRect();
    const p = projection();
    const pad = fitMode === 'outline' ? 36 : 28;
    const geo = geoForFit();
    if (width > 40 && height > 40 && geo) {
      try {
        p.fitExtent([[pad, pad], [width - pad, height - pad]], geo);
      } catch { /* empty geometry */ }
    }
    return p;
  }

  function areaVisible(a) {
    return !kindFilter.size || kindFilter.has(a.kind);
  }

  function paint() {
    if (!atlas) return;
    const { width, height } = host.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
    leaders.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);

    const proj = sizedProjection();
    path.projection(proj);

    const sphere = projName === 'orthographic'
      ? `<path class="cd-map__sphere" d="${path({ type: 'Sphere' }) || ''}"></path>`
      : '';
    const graticule = atlas.name === 'none'
      ? ''
      : `<path class="cd-map__graticule" d="${path(geoGraticule()()) || ''}"></path>`;
    const land = atlas.land
      ? `<path class="cd-map__land" d="${path(atlas.land) || ''}"></path>`
      : '';
    const unitMarkup = atlas.units.map((f) => {
      const id = unitId(f);
      const d = path(f);
      if (!d || d.includes('NaN')) return '';
      return `<path class="cd-map__unit" data-id="${esc(id)}" data-kind="unit" data-name="${esc(unitName(f))}" data-level="${levelOf(id, values)}" d="${d}"></path>`;
    }).join('');
    const meshMarkup = atlas.mesh
      ? `<path class="cd-map__mesh" d="${path(atlas.mesh) || ''}"></path>`
      : '';
    const outlineD = outline ? path(outline) : '';
    const outlineMarkup = outlineD && !outlineD.includes('NaN')
      ? `<path class="cd-map__boundary" d="${outlineD}"></path>`
      : '';

    const areaMarkup = areas.filter(areaVisible).map((a) => {
      const d = path(a.geometry);
      if (!d || d.includes('NaN')) return '';
      return `<path class="cd-map-area" data-id="${esc(a.id)}" data-kind="${esc(a.kind)}" data-name="${esc(a.label || a.kind)}" d="${d}"></path>`;
    }).join('');

    const visiblePins = showPins ? pins : [];
    const pinMarkup = visiblePins.map((p) => {
      const xy = proj([p.lng, p.lat]);
      if (!isFinitePt(xy)) return '';
      const spec = PIN_SPEC[p.kind] || PIN_SPEC.default;
      const glyph = p.glyph
        ? `<text class="cd-map-pin__mark" x="0" y="0.4">${esc(p.glyph)}</text>`
        : `<circle class="cd-map-pin__dot" r="1.8"></circle>`;
      return `
        <g class="cd-map-pin" data-id="${esc(p.id)}" data-kind="${esc(p.kind || 'default')}" data-fresh="${esc(p.fresh || 'today')}" data-name="${esc(p.label)}" transform="translate(${xy[0].toFixed(2)},${xy[1].toFixed(2)})">
          <circle class="cd-map-pin__glow" r="${spec.glow}"></circle>
          <circle class="cd-map-pin__core" r="${spec.core}"></circle>
          ${glyph}
        </g>`;
    }).join('');

    world.innerHTML = `
      ${sphere}
      ${graticule}
      ${land}
      <g class="cd-map__units">${unitMarkup}</g>
      ${meshMarkup}
      ${outlineMarkup}
      <g class="cd-map__areas">${areaMarkup}</g>
      <g class="cd-map__pins">${pinMarkup}</g>
    `;

    labels.innerHTML = visiblePins.map((p) => {
      const xy = proj([p.lng, p.lat]);
      if (!isFinitePt(xy)) return '';
      return `
        <button type="button" class="cd-map-label" data-id="${esc(p.id)}" data-kind="${esc(p.kind || 'pin')}">
          <span class="cd-map-label__kind">${esc(p.kind || 'pin')}</span>
          <span class="cd-map-label__name">${esc(p.label)}</span>
        </button>`;
    }).join('');

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
    const { width } = host.getBoundingClientRect();
    const proj = sizedProjection();
    const pinMode = labelMode === 'pin';
    const items = [...labels.querySelectorAll('.cd-map-label')].map((el) => {
      const pin = pins.find((p) => p.id === el.dataset.id);
      if (!pin) return null;
      const xy = proj([pin.lng, pin.lat]);
      if (!isFinitePt(xy)) return null;
      return { el, ...toScreen(xy[0], xy[1]), id: pin.id };
    }).filter(Boolean);

    if (pinMode) {
      items.sort((a, b) => a.y - b.y);
      items.forEach((it, i) => {
        it.el.style.left = `${width - 168}px`;
        it.el.style.top = `${12 + i * 22}px`;
        it.el.style.transform = 'none';
      });
      leaders.innerHTML = items.map((it, i) => {
        const x0 = width - 168;
        const y0 = 12 + i * 22 + 10;
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
  }

  function bindEvents() {
    host.querySelectorAll('.cd-map__unit, .cd-map-area, .cd-map-pin, .cd-map-label').forEach((el) => {
      const id = el.dataset.id;
      el.addEventListener('pointerenter', () => setHover(id));
      el.addEventListener('pointerleave', () => setHover(null));
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        select(id);
      });
    });
  }

  function featureOf(id) {
    if (id == null) return null;
    const pin = pins.find((p) => String(p.id) === String(id));
    if (pin) return itemOf('pin', pin);
    const area = areas.find((a) => String(a.id) === String(id));
    if (area) return itemOf('area', area);
    const unit = atlas?.units.find((f) => unitId(f) === String(id));
    if (unit) return itemOf('unit', { id: unitId(unit), kind: 'unit', label: unitName(unit) }, { feature: unit });
    return null;
  }

  function setHover(id) {
    host.querySelectorAll('.is-hovered').forEach((n) => n.classList.remove('is-hovered'));
    if (!id) {
      tip.hidden = true;
      return;
    }
    host.querySelectorAll(`[data-id="${CSS.escape(id)}"]`).forEach((n) => n.classList.add('is-hovered'));
    const feat = featureOf(id);
    if (!feat) return;
    tip.innerHTML = `<strong>${esc(feat.kind.toUpperCase())}</strong> ${esc(feat.label)}`;
    tip.hidden = false;
  }

  function syncSelection() {
    host.classList.toggle('is-focusing', Boolean(selected));
    host.querySelectorAll('.is-selected').forEach((n) => n.classList.remove('is-selected'));
    if (!selected) return;
    host.querySelectorAll(`[data-id="${CSS.escape(selected)}"]`).forEach((n) => n.classList.add('is-selected'));
  }

  function select(id) {
    selected = id == null ? null : String(id);
    syncSelection();
    opts.onSelect?.(selected ? featureOf(selected) : null);
  }

  function setTipPos(ev) {
    if (tip.hidden) return;
    const r = host.getBoundingClientRect();
    tip.style.left = `${ev.clientX - r.left + 12}px`;
    tip.style.top = `${ev.clientY - r.top - 10}px`;
  }

  function invert(ev) {
    const r = host.getBoundingClientRect();
    const x = (ev.clientX - r.left - cam.x) / cam.z;
    const y = (ev.clientY - r.top - cam.y) / cam.z;
    const proj = sizedProjection();
    return proj.invert ? proj.invert([x, y]) : null;
  }

  function onPointerDown(ev) {
    if (ev.target.closest('.cd-map-pin, .cd-map-label, .cd-map-area')) return;
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
      opts.onPointer?.({ lng: ll[0], lat: ll[1] });
    }
    if (!dragging) return;
    const dx = ev.clientX - dragging.x;
    const dy = ev.clientY - dragging.y;
    if (projName === 'orthographic') {
      rotate = [dragging.rot[0] + dx * 0.35, Math.max(-80, Math.min(80, dragging.rot[1] - dy * 0.25))];
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
    if (ev.target.closest('.cd-map-pin, .cd-map__unit, .cd-map-area, .cd-map-label')) return;
    select(null);
  }

  function fit() {
    cam = { x: 0, y: 0, z: 1 };
    userCam = false;
    if (projName === 'orthographic') rotate = atlasName === 'us' ? [96, -38] : [-20, -15];
    paint();
  }

  async function replace(next = {}) {
    if ('atlas' in next) atlasName = next.atlas || 'none';
    if ('projection' in next) projName = next.projection || defaultProjection(atlasName);
    else if ('atlas' in next) projName = defaultProjection(atlasName);
    if ('outline' in next) outline = next.outline || null;
    if ('fit' in next) fitMode = next.fit;
    else if ('outline' in next) fitMode = next.outline ? 'outline' : 'atlas';
    if ('pins' in next) pins = next.pins || [];
    if ('areas' in next) areas = next.areas || [];
    if ('values' in next) values = next.values;
    if ('labels' in next) setLabels(next.labels);
    if ('kinds' in next) kindFilter = new Set(next.kinds || []);
    if ('showPins' in next) showPins = next.showPins !== false;
    selected = null;
    if ('atlas' in next || !atlas) atlas = await loadAtlas(atlasName);
    ready = true;
    fit();
    resolveReady();
    opts.onSelect?.(null);
  }

  function setAtlas(name) {
    return replace({ atlas: name });
  }

  function setProjection(name) {
    projName = name;
    fit();
  }

  function setOutline(feature) {
    outline = feature || null;
    if (outline && fitMode !== 'atlas') fitMode = 'outline';
    fit();
  }

  function setFit(mode) {
    fitMode = mode === 'outline' ? 'outline' : 'atlas';
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

  function setKinds(list) {
    kindFilter = new Set(list || []);
    paint();
  }

  function setShowPins(on) {
    showPins = on !== false;
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

  replace({
    atlas: atlasName,
    projection: projName,
    outline,
    fit: fitMode,
    pins,
    areas,
    values,
  });

  return {
    ready: readyPromise,
    replace,
    setAtlas,
    setProjection,
    setOutline,
    setFit,
    setPins,
    setAreas,
    setValues,
    setLabels,
    setKinds,
    setShowPins,
    select,
    fit,
    getSelection: () => featureOf(selected),
    getAtlas: () => atlasName,
    destroy() {
      ro.disconnect();
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('wheel', onWheel);
      host.removeEventListener('click', onClickBg);
      host.innerHTML = '';
    },
  };
}
