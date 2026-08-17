/** Sample pins / areas / values for the atlas prototype. Not an API. */

export const PINS_WORLD = [
  { id: 'p-oc', lng: -117.83, lat: 33.72, label: 'Orange County', kind: 'sensor', fresh: 'today', mark: '', place: 'California' },
  { id: 'p-nyc', lng: -74.01, lat: 40.71, label: 'New York', kind: 'event', fresh: 'today', mark: '*', place: 'United States' },
  { id: 'p-lon', lng: -0.13, lat: 51.51, label: 'London', kind: 'air', fresh: 'recent', mark: '', place: 'United Kingdom' },
  { id: 'p-tyo', lng: 139.69, lat: 35.68, label: 'Tokyo', kind: 'default', fresh: 'today', mark: '', place: 'Japan' },
  { id: 'p-sao', lng: -46.63, lat: -23.55, label: 'São Paulo', kind: 'crime', fresh: 'recent', mark: '!', place: 'Brazil' },
  { id: 'p-cai', lng: 31.24, lat: 30.04, label: 'Cairo', kind: 'power', fresh: 'older', mark: '~', place: 'Egypt' },
];

export const PINS_US = [
  { id: 'p-lax', lng: -118.24, lat: 34.05, label: 'Los Angeles', kind: 'air', fresh: 'today', mark: '', place: 'California' },
  { id: 'p-oc', lng: -117.83, lat: 33.72, label: 'Orange County', kind: 'sensor', fresh: 'today', mark: '', place: 'California' },
  { id: 'p-sfo', lng: -122.42, lat: 37.77, label: 'San Francisco', kind: 'event', fresh: 'today', mark: '*', place: 'California' },
  { id: 'p-hou', lng: -95.37, lat: 29.76, label: 'Houston', kind: 'power', fresh: 'recent', mark: '!', place: 'Texas' },
  { id: 'p-chi', lng: -87.63, lat: 41.88, label: 'Chicago', kind: 'crime', fresh: 'today', mark: '^', place: 'Illinois' },
  { id: 'p-mia', lng: -80.19, lat: 25.76, label: 'Miami', kind: 'construction', fresh: 'older', mark: '#', place: 'Florida' },
  { id: 'p-sea', lng: -122.33, lat: 47.61, label: 'Seattle', kind: 'default', fresh: 'recent', mark: '', place: 'Washington' },
];

export const PINS_SIT = [
  { id: 'p-gg', lng: -117.94, lat: 33.77, label: 'Garden Grove PD', kind: 'crime', fresh: 'today', mark: '!', place: 'Garden Grove', summary: 'Domestic violence — just occurred.' },
  { id: 'p-cm', lng: -117.92, lat: 33.64, label: 'Costa Mesa outage', kind: 'power', fresh: 'today', mark: '~', place: 'Costa Mesa', summary: 'Scheduled pole upgrade. 86 customers.' },
  { id: 'p-sa', lng: -117.87, lat: 33.75, label: 'Santa Ana AQI', kind: 'air', fresh: 'today', mark: '', place: 'Santa Ana', summary: 'Sensor 38 — moderate.' },
  { id: 'p-nb', lng: -117.93, lat: 33.62, label: 'Newport event', kind: 'event', fresh: 'recent', mark: '*', place: 'Newport Beach', summary: 'Waterfront permit cluster.' },
  { id: 'p-irv', lng: -117.79, lat: 33.68, label: 'Irvine CCTV', kind: 'sensor', fresh: 'today', mark: '', place: 'Irvine', summary: 'I-405 / Jeffrey — live.' },
  { id: 'p-ana', lng: -117.91, lat: 33.84, label: 'Anaheim construction', kind: 'construction', fresh: 'older', mark: '#', place: 'Anaheim', summary: 'Harbor corridor lane closure.' },
];

function ring(lng, lat, km, steps = 48, aspect = 1) {
  const coords = [];
  const earth = 6371;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const dLat = (km / earth) * (180 / Math.PI) * Math.sin(a);
    const dLng = ((km * aspect) / earth) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180) * Math.cos(a);
    coords.push([lng + dLng, lat + dLat]);
  }
  return coords.reverse();
}

export const AREAS_SIT = [
  {
    id: 'a-origin',
    kind: 'origin',
    label: 'Yard / origin',
    source: 'SIT-OC-PLASTICS',
    geometry: { type: 'Polygon', coordinates: [ring(-117.918, 33.806, 1.4)] },
  },
  {
    id: 'a-plume',
    kind: 'plume',
    label: 'Plume (forecast)',
    source: 'HYSPLIT 6h',
    geometry: { type: 'Polygon', coordinates: [ring(-117.88, 33.78, 6.2, 56, 1.7)] },
  },
  {
    id: 'a-evac',
    kind: 'evacuation',
    label: 'Evacuation zone',
    source: 'OCFA',
    geometry: { type: 'Polygon', coordinates: [ring(-117.91, 33.80, 3.4)] },
  },
  {
    id: 'a-watch',
    kind: 'watch',
    label: 'Watch buffer',
    source: 'NWS',
    geometry: { type: 'Polygon', coordinates: [ring(-117.87, 33.76, 14, 64, 1.25)] },
  },
  {
    id: 'a-sensors',
    kind: 'sensor',
    label: 'Sensor coverage',
    source: 'PurpleAir',
    geometry: { type: 'Polygon', coordinates: [ring(-117.84, 33.72, 18, 64, 1.35)] },
  },
];

/** Deterministic 0–1 “signal” by US FIPS / world numeric ISO. */
export function demoValue(id) {
  const n = Number(String(id).replace(/\D/g, '')) || 0;
  const x = Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
  return x;
}

export const VALUES_US = {
  '06': 0.92, // CA
  '48': 0.74, // TX
  '36': 0.68, // NY
  '12': 0.61, // FL
  '17': 0.55, // IL
  '04': 0.48, // AZ
  '53': 0.42, // WA
  '08': 0.33, // CO
};

export const VALUES_WORLD = {
  840: 0.88, // US
  826: 0.62, // UK
  392: 0.54, // JP
  76: 0.47,  // BR
  818: 0.31, // EG
};
