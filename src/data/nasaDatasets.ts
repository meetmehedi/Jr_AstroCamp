export interface NasaDatasetInfo {
  id: string;
  name: string;
  category: 'LIFE_SUPPORT' | 'TOPOGRAPHY' | 'SPACE_WEATHER' | 'POWER_ENERGY';
  citationDoc: string;
  missionOrCenter: string;
  applicationInOutpost: string;
  link: string;
}

export const NASA_DATASETS: NasaDatasetInfo[] = [
  {
    id: 'bvad-eclss',
    name: 'Baseline Values and Assumptions Document (BVAD)',
    category: 'LIFE_SUPPORT',
    citationDoc: 'NASA/TP-2015-218570',
    missionOrCenter: 'NASA Johnson Space Center (JSC) & Office of the Chief Technologist',
    applicationInOutpost: 'Defines stoichiometric consumption constants: 0.84 kg O2/crew/day, 3.0 L H2O/crew/day, and 1.0 kg CO2/crew/day.',
    link: 'https://ntrs.nasa.gov/citations/20150003001'
  },
  {
    id: 'lro-lola',
    name: 'Lunar Reconnaissance Orbiter LOLA Elevation Models',
    category: 'TOPOGRAPHY',
    citationDoc: 'LRO-L-LOLA-4-GDR-V1.0',
    missionOrCenter: 'NASA Goddard Space Flight Center',
    applicationInOutpost: 'Authentic 3D topographic models of Shackleton Crater rim and Malapert Mountain for solar line-of-sight and eternal sunlight simulation.',
    link: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm'
  },
  {
    id: 'donki-swpc',
    name: 'NASA Space Weather Database of Notifications (DONKI)',
    category: 'SPACE_WEATHER',
    citationDoc: 'NASA DONKI API & NOAA SWPC Archive',
    missionOrCenter: 'NASA GSFC Community Coordinated Modeling Center (CCMC)',
    applicationInOutpost: 'Simulates Coronal Mass Ejection (CME) shock fronts, Solar Energetic Particle (SEP) alerts, and proton flux dosage in mSv.',
    link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'
  },
  {
    id: 'kilopower-fission',
    name: 'Kilopower Fission Surface Power System Specs',
    category: 'POWER_ENERGY',
    citationDoc: 'NASA-TM-2018-219801',
    missionOrCenter: 'NASA Glenn Research Center & Los Alamos National Lab',
    applicationInOutpost: 'Provides exact 1–10 kWe continuous power curves and sodium heat-pipe Stirling engine thermal models for surviving lunar night.',
    link: 'https://ntrs.nasa.gov/citations/20180002166'
  }
];
