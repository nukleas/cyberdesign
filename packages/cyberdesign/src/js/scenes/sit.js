/** OCINT Situation — aerospace plastics runaway (Anaheim / Garden Grove). */

import { R, info } from './refs.js';
import { city, via } from './scene-kit.js';

const A = 1.55;
const AH = 1.25;
const HERO = 1.75;
const CHIP = 1.25;

export const sit = {
  nodes: [
    ...city('response', 'Response', 12, 0, [
      { id: 'afr', kind: 'actor', label: 'AFR', i: 0.1, j: 0.1, w: 1.15, d: 1.15, h: 1.2, status: 'ok', meta: { unit: 'Anaheim Fire & Rescue' }, ...info('On-scene command. Set the evac perimeter.') },
      { id: 'hazmat', kind: 'actor', label: 'HazMat', i: 1.5, j: 0.1, w: 1.15, d: 1.15, h: 1.25, status: 'warn', meta: { unit: 'OCFA HazMat 64' }, ...info('HazMat 64. Polymer feedstock, cooling failure suspected.') },
      { id: 'apd', kind: 'actor', label: 'APD', i: 0.15, j: 1.55, w: 1.1, d: 1.1, h: 1.1, status: 'ok', meta: { unit: 'Anaheim PD' }, ...info('Traffic and perimeter. Coordinates the Katella closure.') },
    ], { zone: 'response', owner: 'afr', status: 'ok', meta: { who: 'AFR, OCFA HazMat 64, APD' }, ...info('Who is on it. First reported mid-afternoon.') }),

    ...city('origin', 'Origin', 10, 8, [
      { id: 'facility', kind: 'app', label: 'Yard', i: 0.1, j: 0.1, w: HERO, d: 1.55, h: 1.45, status: 'warn', role: 'hero', meta: { place: 'Katella & State College' }, ...info('Industrial parcel north of Katella. Thermal runaway in stored polymer feedstock. Visible smoke, no reported injuries.', [R.calfire]) },
      { id: 'feedstock', kind: 'store', label: 'Resin', i: 2.05, j: 0.15, w: 1.5, d: 1.5, h: 1.2, status: 'warn', meta: { holds: 'monomer / polymer' }, ...info('Aerospace composites feedstock. Bulk resin can decompose exothermically if cooling fails.') },
      { id: 'cooling', kind: 'app', label: 'Cool', i: 0.15, j: 1.9, w: A, d: 1.35, h: AH, status: 'warn', ...info('Suspected cooling failure. Batch self-heated past its decomposition threshold.') },
    ], { zone: 'origin', owner: 'facility', status: 'warn', meta: { kind: 'origin', severity: 4 }, ...info('Reported origin — facility yard. Operator-drawn point, not an official source.') }),

    ...city('evac', 'Evacuation', 0, 10, [
      { id: 'perimeter', kind: 'app', label: 'Zone', i: 0.1, j: 0.1, w: HERO, d: 1.5, h: 1.2, status: 'warn', meta: { cities: 'Anaheim, Garden Grove' }, ...info('One-block evac. Polygon crosses Anaheim into Garden Grove.') },
      { id: 'block', kind: 'actor', label: 'Block', i: 2.05, j: 0.2, w: 1.1, d: 1.1, h: 1.1, status: 'warn', ...info('Residents and plant staff inside the perimeter.') },
    ], { zone: 'evac', owner: 'afr', status: 'warn', meta: { kind: 'evacuation', severity: 4 }, ...info('Anaheim FD evacuation perimeter.') }),

    ...city('closure', 'Katella', 10, 18, [
      { id: 'katella', kind: 'app', label: 'Katella', i: 0.1, j: 0.1, w: 2.2, d: 1.35, h: 1.05, status: 'warn', meta: { span: 'Brookhurst → State College' }, ...info('Multi-hour closure on Katella Ave, Brookhurst to State College.', [R.chp, R.caltrans]) },
      { id: 'cms', kind: 'standard', label: 'CMS', i: 2.5, j: 0.15, w: 1.35, d: 1.25, h: 1.0, status: 'ok', ...info('Caltrans changeable-message signs on the corridor.', [R.caltrans]) },
    ], { zone: 'closure', owner: 'apd', status: 'warn', meta: { kind: 'closure', severity: 3 }, ...info('Katella Ave closure as a LineString in the Situation.') }),

    ...city('watch', 'Watch', 22, 9, [
      { id: 'plume', kind: 'broker', label: 'Plume', i: 0.1, j: 0.1, w: 1.7, d: 1.45, h: 1.15, status: 'warn', ...info('Downwind watch buffer. Unverified — used by the refresh cron to pull nearby items.', [R.airnow]) },
      { id: 'pa-downwind', kind: 'stream', label: 'PA', i: 2.05, j: 0.2, w: CHIP, d: CHIP, h: 0.55, status: 'warn', meta: { reading: 'elevated PM2.5' }, ...info('PurpleAir monitors downwind showing elevated PM2.5.', [R.purpleair, R.airnow]) },
      { id: 'sit-obj', kind: 'app', label: 'Sit', i: 0.15, j: 1.8, w: A, d: 1.4, h: AH, status: 'ok', meta: { slug: 'aerospace-plastics-reaction-2026-05' }, ...info('The Situation object. Areas: origin, evacuation, closure, watch. Cities: Anaheim, Garden Grove.', [], [R.ocintSits]) },
    ], { zone: 'watch', owner: 'ocint', status: 'warn', meta: { kind: 'watch', severity: 2 }, ...info('Downwind monitoring buffer. Severity 2 — watch, not evac.') }),
  ],

  edges: [
    { id: 'e-resin-yard', from: 'feedstock', to: 'facility', kind: 'data', label: 'runaway' },
    { id: 'e-cool-yard', from: 'cooling', to: 'facility', kind: 'sync', label: 'fail' },
    { id: 'e-yard-evac', from: 'facility', to: 'perimeter', kind: 'sync', label: 'evac', via: via([7, 12]) },
    { id: 'e-afr-evac', from: 'afr', to: 'perimeter', kind: 'certify', label: 'set', via: via([7, 6]) },
    { id: 'e-yard-plume', from: 'facility', to: 'plume', kind: 'data', label: 'smoke', via: via([18, 10]) },
    { id: 'e-plume-pa', from: 'plume', to: 'pa-downwind', kind: 'data', label: 'PM2.5' },
    { id: 'e-yard-katella', from: 'facility', to: 'katella', kind: 'sync', label: 'close', via: via([12, 16]) },
    { id: 'e-apd-katella', from: 'apd', to: 'katella', kind: 'sync', label: 'hold', via: via([13, 16]) },
    { id: 'e-haz-yard', from: 'hazmat', to: 'facility', kind: 'sync', label: 'on scene', via: via([14, 6]) },
    { id: 'e-pa-sit', from: 'pa-downwind', to: 'sit-obj', kind: 'report', label: 'evidence' },
    { id: 'e-evac-sit', from: 'perimeter', to: 'sit-obj', kind: 'report', label: 'area', via: via([18, 14]) },
    { id: 'e-kat-sit', from: 'katella', to: 'sit-obj', kind: 'report', label: 'area', via: via([18, 16]) },
    { id: 'e-cms-kat', from: 'cms', to: 'katella', kind: 'sync', label: 'sign' },
  ],

  flows: [
    { id: 'hazmat', title: 'Hazmat', edges: ['e-resin-yard', 'e-yard-evac', 'e-yard-katella', 'e-apd-katella'] },
    { id: 'air', title: 'Air watch', edges: ['e-yard-plume', 'e-plume-pa', 'e-pa-sit'] },
  ],

  layers: [],
};
