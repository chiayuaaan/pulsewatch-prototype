import {
  AlertTriangle,
  Construction,
  Droplets,
  Fish,
  Radio,
  ShieldAlert,
  Waves,
  Wrench,
} from 'lucide-react';

export const stations = [
  {
    id: 'kampong-phluk',
    name: 'Kampong Phluk',
    code: 'KPF-02',
    status: 'Weak pulse',
    level: '4.2 m',
    levelValue: 4.2,
    expected: '6.5 m',
    delta: '35% below expected',
    lastSeen: '2 min ago',
    battery: 88,
    signal: 'Strong',
    installed: '12 Jun 2026',
    x: 56,
    y: 67,
    tone: 'amber',
  },
  {
    id: 'prek-toal',
    name: 'Prek Toal',
    code: 'PRT-01',
    status: 'On schedule',
    level: '5.8 m',
    levelValue: 5.8,
    expected: '6.3 m',
    delta: '8% below expected',
    lastSeen: '6 min ago',
    battery: 94,
    signal: 'Strong',
    installed: '03 Jun 2026',
    x: 37,
    y: 43,
    tone: 'green',
  },
  {
    id: 'kampong-luong',
    name: 'Kampong Luong',
    code: 'KPL-03',
    status: 'Critical',
    level: '3.7 m',
    levelValue: 3.7,
    expected: '6.6 m',
    delta: '44% below expected',
    lastSeen: '4 min ago',
    battery: 63,
    signal: 'Fair',
    installed: '19 Jun 2026',
    x: 24,
    y: 71,
    tone: 'red',
  },
  {
    id: 'kampong-chhnang',
    name: 'Kampong Chhnang',
    code: 'KPC-01',
    status: 'Weak pulse',
    level: '4.5 m',
    levelValue: 4.5,
    expected: '6.5 m',
    delta: '31% below expected',
    lastSeen: '9 min ago',
    battery: 76,
    signal: 'Strong',
    installed: '27 Jun 2026',
    x: 67,
    y: 26,
    tone: 'amber',
  },
];

export const alertHistory = [
  {
    icon: Droplets,
    date: '28 Aug',
    title: 'Water rise slower than expected',
    area: 'Kampong Phluk · 3 villages',
    tone: 'blue',
  },
  {
    icon: Fish,
    date: '22 Aug',
    title: 'Low oxygen at Refuge 03',
    area: 'Prek Toal sanctuary',
    tone: 'green',
  },
  {
    icon: Radio,
    date: '19 Aug',
    title: 'Gauge maintenance completed',
    area: 'Kampong Chhnang station',
    tone: 'neutral',
  },
];

export const suggestionPrompts = [
  'Why is the pulse weak?',
  'Should I plant this week?',
  'Which station is nearest?',
];

export const refuges = [
  {
    id: 'refuge-prek-toal',
    name: 'Prek Toal Refuge A',
    area: 'Core sanctuary · Zone 1',
    status: 'Healthy',
    tone: 'green',
    oxygen: 6.8,
    temperature: 29.1,
    habitat: 82,
    updated: '5 min ago',
    recommendation: 'No action required',
  },
  {
    id: 'refuge-kampong-luong',
    name: 'Kampong Luong Refuge B',
    area: 'Shallow nursery · Zone 4',
    status: 'Watch',
    tone: 'amber',
    oxygen: 4.3,
    temperature: 30.8,
    habitat: 61,
    updated: '11 min ago',
    recommendation: 'Inspect within 48 hours',
  },
  {
    id: 'refuge-kampong-phluk',
    name: 'Kampong Phluk Refuge C',
    area: 'Proposed deployment · Zone 2',
    status: 'Planned',
    tone: 'blue',
    oxygen: null,
    temperature: null,
    habitat: 0,
    updated: 'Forecast recommendation',
    recommendation: 'Deploy before 14 September',
  },
];

export const reportCategories = [
  { id: 'low-water', label: 'Unusually low water', icon: Waves, tone: 'blue' },
  { id: 'fish', label: 'Fish mortality', icon: Fish, tone: 'red' },
  { id: 'mining', label: 'Possible sand mining', icon: Construction, tone: 'amber' },
  { id: 'sensor', label: 'Damaged station', icon: Wrench, tone: 'neutral' },
  { id: 'pollution', label: 'Polluted water', icon: ShieldAlert, tone: 'green' },
  { id: 'other', label: 'Other observation', icon: AlertTriangle, tone: 'neutral' },
];

export const impactMetrics = [
  { value: '−29.4%', label: 'Reverse-flow volume since 2018', tone: 'blue' },
  { value: '−48%', label: 'Fish catch from 2018–2022', tone: 'amber' },
  { value: '−1.8 m', label: 'Peak water-level difference', tone: 'red' },
  { value: '1.7M+', label: 'People depending on the pulse', tone: 'green' },
];

export function getStation(stationId) {
  return stations.find((station) => station.id === stationId) ?? stations[0];
}
