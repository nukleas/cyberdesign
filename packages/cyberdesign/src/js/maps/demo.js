/** Sample overlay data for examples/map.html. Not part of the CdMapScene API. */

import { circlePoly } from '../map.js';

export const PINS_WORLD = [
  { id: 'p-oc', lng: -117.83, lat: 33.72, label: 'Orange County', kind: 'sensor', fresh: 'today', place: 'California' },
  { id: 'p-nyc', lng: -74.01, lat: 40.71, label: 'New York', kind: 'event', fresh: 'today', glyph: '*', place: 'United States' },
  { id: 'p-lon', lng: -0.13, lat: 51.51, label: 'London', kind: 'air', fresh: 'recent', place: 'United Kingdom' },
  { id: 'p-tyo', lng: 139.69, lat: 35.68, label: 'Tokyo', kind: 'default', fresh: 'today', place: 'Japan' },
  { id: 'p-sao', lng: -46.63, lat: -23.55, label: 'São Paulo', kind: 'crime', fresh: 'recent', glyph: '!', place: 'Brazil' },
  { id: 'p-cai', lng: 31.24, lat: 30.04, label: 'Cairo', kind: 'power', fresh: 'older', glyph: '~', place: 'Egypt' },
];

export const PINS_US = [
  { id: 'p-lax', lng: -118.24, lat: 34.05, label: 'Los Angeles', kind: 'air', fresh: 'today', place: 'California' },
  { id: 'p-oc', lng: -117.83, lat: 33.72, label: 'Orange County', kind: 'sensor', fresh: 'today', place: 'California' },
  { id: 'p-sfo', lng: -122.42, lat: 37.77, label: 'San Francisco', kind: 'event', fresh: 'today', glyph: '*', place: 'California' },
  { id: 'p-hou', lng: -95.37, lat: 29.76, label: 'Houston', kind: 'power', fresh: 'recent', glyph: '!', place: 'Texas' },
  { id: 'p-chi', lng: -87.63, lat: 41.88, label: 'Chicago', kind: 'crime', fresh: 'today', glyph: '^', place: 'Illinois' },
  { id: 'p-mia', lng: -80.19, lat: 25.76, label: 'Miami', kind: 'construction', fresh: 'older', glyph: '#', place: 'Florida' },
  { id: 'p-sea', lng: -122.33, lat: 47.61, label: 'Seattle', kind: 'default', fresh: 'recent', place: 'Washington' },
];

export const PINS_SIT = [
  { id: 'p-gg', lng: -117.94, lat: 33.77, label: 'Garden Grove PD', kind: 'crime', fresh: 'today', glyph: '!', place: 'Garden Grove', summary: 'Domestic violence — just occurred.' },
  { id: 'p-cm', lng: -117.92, lat: 33.64, label: 'Costa Mesa outage', kind: 'power', fresh: 'today', glyph: '~', place: 'Costa Mesa', summary: 'Scheduled pole upgrade. 86 customers.' },
  { id: 'p-sa', lng: -117.87, lat: 33.75, label: 'Santa Ana AQI', kind: 'air', fresh: 'today', place: 'Santa Ana', summary: 'Sensor 38 — moderate.' },
  { id: 'p-nb', lng: -117.93, lat: 33.62, label: 'Newport event', kind: 'event', fresh: 'recent', glyph: '*', place: 'Newport Beach', summary: 'Waterfront permit cluster.' },
  { id: 'p-irv', lng: -117.79, lat: 33.68, label: 'Irvine CCTV', kind: 'sensor', fresh: 'today', place: 'Irvine', summary: 'I-405 / Jeffrey — live.' },
  { id: 'p-ana', lng: -117.91, lat: 33.84, label: 'Anaheim construction', kind: 'construction', fresh: 'older', glyph: '#', place: 'Anaheim', summary: 'Harbor corridor lane closure.' },
];

export const AREAS_SIT = [
  { id: 'a-origin', kind: 'origin', label: 'Yard / origin', source: 'SIT-OC-PLASTICS', geometry: circlePoly(-117.918, 33.806, 1.4) },
  { id: 'a-plume', kind: 'plume', label: 'Plume (forecast)', source: 'HYSPLIT 6h', geometry: circlePoly(-117.88, 33.78, 6.2, 56, 1.7) },
  { id: 'a-evac', kind: 'evacuation', label: 'Evacuation zone', source: 'OCFA', geometry: circlePoly(-117.91, 33.80, 3.4) },
  { id: 'a-watch', kind: 'watch', label: 'Watch buffer', source: 'NWS', geometry: circlePoly(-117.87, 33.76, 14, 64, 1.25) },
  { id: 'a-sensors', kind: 'sensor', label: 'Sensor coverage', source: 'PurpleAir', geometry: circlePoly(-117.84, 33.72, 18, 64, 1.35) },
];

export const VALUES_US = {
  '06': 0.92,
  '48': 0.74,
  '36': 0.68,
  '12': 0.61,
  '17': 0.55,
  '04': 0.48,
  '53': 0.42,
  '08': 0.33,
};

export const VALUES_WORLD = {
  '840': 0.88,
  '826': 0.62,
  '392': 0.54,
  '76': 0.47,
  '818': 0.31,
};

export function loadOcOutline() {
  return fetch(new URL('./oc-boundary.json', import.meta.url)).then((r) => {
    if (!r.ok) throw new Error('oc-boundary missing');
    return r.json();
  });
}
