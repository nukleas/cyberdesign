/** OCINT CORE — civic intel platform as distant product cities. */

import { R, info } from './refs.js';
import { city, via } from './scene-kit.js';

const A = 1.55;
const AH = 1.25;
const HERO = 1.75;
const CHIP = 1.25;

export const ocint = {
  nodes: [
    ...city('surfaces', 'Surfaces', 12, 0, [
      { id: 'map', kind: 'app', label: 'Map', i: 0.1, j: 0.1, w: HERO, d: 1.5, h: 1.35, status: 'ok', role: 'hero', meta: { client: 'Mapbox GL' }, ...info('County map with overlays, cameras, and situation areas.', [R.caltrans], [R.ocint]) },
      { id: 'feed', kind: 'stream', label: 'Feed', i: 2.05, j: 0.15, w: CHIP, d: CHIP, h: 0.55, status: 'ok', meta: { poll: '60s' }, ...info('Live intel feed. Browser polls /api/items every 60 seconds.', [], [R.ocint]) },
      { id: 'newsroom', kind: 'app', label: 'News', i: 0.15, j: 1.85, w: A, d: 1.35, h: AH, status: 'ok', ...info('Newsroom surface over RSS + dispatch briefs.', [], [R.ocint]) },
      { id: 'status', kind: 'app', label: 'Status', i: 1.9, j: 1.85, w: A, d: 1.35, h: 1.05, status: 'ok', ...info('Source health grid — last fetch, stale, down.', [], [R.ocintStatus]) },
    ], { zone: 'hud', owner: 'ocint', layer: 'hud', status: 'ok', meta: { mission: 'What operators see' }, ...info('HUD surfaces: map, feed, newsroom, source status.', [], [R.ocint]) }),

    ...city('ledger', 'Ledger', 10, 9, [
      { id: 'items', kind: 'store', label: 'Items', i: 0.1, j: 0.1, w: 1.7, d: 1.65, h: 1.4, status: 'ok', meta: { db: 'PostGIS' }, ...info('items table. PostGIS points, tsvector search, unique (source, source_id).') },
      { id: 'overlays', kind: 'standard', label: 'Overlays', i: 2.05, j: 0.15, w: 1.45, d: 1.4, h: 1.1, status: 'ok', ...info('GeoJSON overlay cache — crime, crashes, PurpleAir, construction.') },
      { id: 'gazetteer', kind: 'standard', label: 'Places', i: 0.15, j: 2.0, w: 1.45, d: 1.35, h: 1.05, status: 'ok', ...info('OC city gazetteer. Resolves situation areas to Anaheim, Garden Grove, …') },
      { id: 'search', kind: 'app', label: 'Search', i: 1.85, j: 2.0, w: A, d: 1.35, h: AH, status: 'ok', ...info('Full-text + geo-radius RPC over items_with_coords.') },
    ], { zone: 'store', owner: 'ocint', layer: 'store', status: 'ok', meta: { mission: 'System of record' }, ...info('Ledger city — items, overlays, places, search.', [], [R.ocint]) }),

    ...city('ingest', 'Ingest', 0, 10, [
      { id: 'crons', kind: 'rack', label: 'Crons', i: 0.1, j: 0.1, w: 1.6, d: 1.85, h: 1.45, status: 'ok', slots: 5, meta: { routes: '32' }, ...info('32 cron routes. Traffic at 5 min, meetings at 24 h, housing monthly.', [R.nws, R.calfire, R.chp]) },
      { id: 'upsert', kind: 'app', label: 'Upsert', i: 1.95, j: 0.15, w: A, d: A, h: AH, status: 'ok', ...info('upsert_item RPC. Builds the PostGIS point, coalesces location, conflicts on source+id.') },
      { id: 'src-health', kind: 'stream', label: 'Health', i: 0.2, j: 2.15, w: CHIP, d: CHIP, h: 0.55, status: 'ok', ...info('Per-source last success / fail. Feeds the status grid.') },
    ], { zone: 'cron', owner: 'ocint', layer: 'cron', status: 'ok', meta: { mission: 'Pull the county' }, ...info('Ingest plant. Crons fetch public APIs and upsert into items.', [], [R.ocintStatus]) }),

    ...city('synth', 'Synthesis', 22, 9, [
      { id: 'situations', kind: 'app', label: 'Sits', i: 0.1, j: 0.1, w: HERO, d: 1.55, h: 1.4, status: 'ok', role: 'hero', meta: { proto: 'aerospace-plastics-2026-05' }, ...info('Situation objects: narrative, factoids, multi-area geometry, watch config.', [], [R.ocintSits]) },
      { id: 'dispatch', kind: 'broker', label: 'Dispatch', i: 2.05, j: 0.15, w: 1.65, d: 1.4, h: 1.15, status: 'ok', ...info('Daily AI dispatch. Claude reads the day and writes the briefing.', [], [R.ocintDispatch]) },
      { id: 'dossiers', kind: 'store', label: 'Dossiers', i: 0.15, j: 1.9, w: 1.5, d: 1.45, h: 1.15, status: 'ok', ...info('Subject dossiers — crime, crashes, airport, housing, property.', [], [R.ocint]) },
    ], { zone: 'synth', owner: 'ocint', layer: 'synth', status: 'ok', meta: { mission: 'Turn items into stories' }, ...info('Synthesis city — situations, daily dispatch, dossiers.', [], [R.ocintSits, R.ocintDispatch]) }),

    ...city('field', 'Field', 0, 20, [
      { id: 'cameras', kind: 'rack', label: 'CCTV', i: 0.1, j: 0.1, w: 1.55, d: 1.8, h: 1.3, status: 'ok', slots: 4, meta: { plant: 'Caltrans D12' }, ...info('376 OC highway cameras. Snapshots + HLS.', [R.caltrans]) },
      { id: 'purpleair', kind: 'stream', label: 'Air', i: 1.9, j: 0.2, w: CHIP, d: CHIP, h: 0.55, status: 'warn', meta: { trigger: 'AQI > 100' }, ...info('Hyperlocal PM2.5. Feed items only when AQI exceeds 100.', [R.purpleair, R.airnow]) },
      { id: 'chp-cad', kind: 'stream', label: 'CHP', i: 1.9, j: 1.6, w: CHIP, d: CHIP, h: 0.55, status: 'ok', ...info('CHP CAD incidents + Caltrans CMS, every 5 minutes.', [R.chp]) },
    ], { zone: 'field', owner: 'ocint', layer: 'field', status: 'ok', meta: { mission: 'Sensors on the ground' }, ...info('Field rim — cameras, PurpleAir, CHP.', [R.caltrans, R.purpleair]) }),

    ...city('port', 'Port', 22, 19, [
      { id: 'harbor', kind: 'store', label: 'Harbor', i: 0.1, j: 0.1, w: 1.55, d: 1.5, h: 1.25, status: 'ok', meta: { holds: 'CO-OPS' }, ...info('Four NOAA harbor stations: water level, wind, pressure.', [R.noaaCoops]) },
      { id: 'buoys', kind: 'stream', label: 'Buoys', i: 1.9, j: 0.15, w: CHIP, d: CHIP, h: 0.55, status: 'ok', ...info('NDBC wave buoys off San Pedro Bay.', [R.ndbc]) },
      { id: 'teu', kind: 'standard', label: 'TEU', i: 1.85, j: 1.55, w: 1.4, d: 1.3, h: 1.05, status: 'ok', ...info('Port of LA container throughput.', [R.pola]) },
    ], { zone: 'field', owner: 'ocint', layer: 'field', status: 'ok', meta: { mission: 'San Pedro Bay' }, ...info('Port city — harbor sensors, buoys, TEU. Lives in port_data, not items.', [R.pola, R.noaaCoops], [R.ocintPorts]) }),
  ],

  edges: [
    { id: 'e-cam-cron', from: 'cameras', to: 'crons', kind: 'data', label: 'D12', via: via([6, 18]) },
    { id: 'e-air-cron', from: 'purpleair', to: 'crons', kind: 'data', label: 'PM2.5', via: via([6, 17]) },
    { id: 'e-chp-cron', from: 'chp-cad', to: 'crons', kind: 'data', label: 'CAD', via: via([6, 16]) },
    { id: 'e-cron-up', from: 'crons', to: 'upsert', kind: 'sync', label: 'fetch' },
    { id: 'e-up-items', from: 'upsert', to: 'items', kind: 'data', label: 'write', via: via([7, 12]) },
    { id: 'e-cron-health', from: 'crons', to: 'src-health', kind: 'sync', label: 'ok/fail' },
    { id: 'e-health-status', from: 'src-health', to: 'status', kind: 'report', label: 'grid', via: via([6, 6]) },
    { id: 'e-items-search', from: 'items', to: 'search', kind: 'sync', label: 'rpc' },
    { id: 'e-items-feed', from: 'items', to: 'feed', kind: 'data', label: 'poll', via: via([14, 6]) },
    { id: 'e-items-sit', from: 'items', to: 'situations', kind: 'data', label: 'evidence', via: via([18, 12]) },
    { id: 'e-items-doss', from: 'items', to: 'dossiers', kind: 'report', label: 'roll-up', via: via([18, 14]) },
    { id: 'e-sit-disp', from: 'situations', to: 'dispatch', kind: 'sync', label: 'brief' },
    { id: 'e-disp-news', from: 'dispatch', to: 'newsroom', kind: 'report', label: 'daily', via: via([20, 6]) },
    { id: 'e-ov-map', from: 'overlays', to: 'map', kind: 'sync', label: 'tiles', via: via([15, 6]) },
    { id: 'e-gaz-search', from: 'gazetteer', to: 'search', kind: 'sync', label: 'city' },
    { id: 'e-sit-gaz', from: 'situations', to: 'gazetteer', kind: 'sync', label: 'areas', via: via([18, 11]) },
    { id: 'e-harb-teu', from: 'harbor', to: 'teu', kind: 'data', label: 'cache' },
    { id: 'e-buoy-harb', from: 'buoys', to: 'harbor', kind: 'data', label: 'sea' },
    { id: 'e-port-doss', from: 'teu', to: 'dossiers', kind: 'report', label: 'ports', via: via([24, 16]) },
  ],

  flows: [
    { id: 'ingest', title: 'Ingest tick', edges: ['e-air-cron', 'e-cron-up', 'e-up-items', 'e-items-feed'] },
    { id: 'spin', title: 'Spin-up', edges: ['e-items-sit', 'e-sit-disp', 'e-disp-news'] },
  ],

  layers: [
    { id: 'field', title: 'Field' },
    { id: 'cron', title: 'Cron' },
    { id: 'store', title: 'Store' },
    { id: 'synth', title: 'Synthesis' },
    { id: 'hud', title: 'HUD' },
  ],
};
