/** Shared inspector refs for public demo scenes. */

export const R = {
  ocint: { title: 'OCINT', href: 'https://ocint.app/' },
  ocintPorts: { title: 'OCINT ports', href: 'https://ocint.app/ports' },
  ocintDispatch: { title: 'OCINT dispatch', href: 'https://ocint.app/dispatch' },
  ocintStatus: { title: 'OCINT status', href: 'https://ocint.app/status' },
  ocintSits: { title: 'OCINT situations', href: 'https://ocint.app/situations' },

  nws: { title: 'National Weather Service', href: 'https://www.weather.gov/' },
  nwsFire: { title: 'NWS Fire Weather', href: 'https://www.weather.gov/fire/' },
  usgs: { title: 'USGS Earthquakes', href: 'https://earthquake.usgs.gov/' },
  usgsWater: { title: 'USGS Water Data', href: 'https://waterdata.usgs.gov/' },
  noaaCoops: { title: 'NOAA CO-OPS', href: 'https://tidesandcurrents.noaa.gov/' },
  ndbc: { title: 'NDBC buoys', href: 'https://www.ndbc.noaa.gov/' },
  caltrans: { title: 'Caltrans QuickMap', href: 'https://quickmap.dot.ca.gov/' },
  chp: { title: 'CHP traffic incidents', href: 'https://cad.chp.ca.gov/' },
  purpleair: { title: 'PurpleAir map', href: 'https://map.purpleair.com/' },
  airnow: { title: 'AirNow', href: 'https://www.airnow.gov/' },
  calfire: { title: 'CAL FIRE incidents', href: 'https://www.fire.ca.gov/incidents' },
  faa: { title: 'FAA NASSTATUS', href: 'https://nasstatus.faa.gov/' },
  pola: { title: 'Port of Los Angeles', href: 'https://www.portoflosangeles.org/' },
  beaches: { title: 'CA Beach Watch', href: 'https://www.waterboards.ca.gov/water_issues/programs/beaches/' },
};

export function info(summary, docs = [], links = []) {
  return { summary, docs, links };
}
