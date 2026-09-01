import {
  Bell,
  ChartNoAxesCombined,
  Map as MapIcon,
  MessageCircle,
  Waves,
} from 'lucide-react';

export const navItems = [
  { id: 'pulse', label: 'Pulse', kh: 'ជីពចរ', icon: Waves },
  { id: 'map', label: 'Map', kh: 'ផែនទី', icon: MapIcon },
  { id: 'forecast', label: 'Forecast', kh: 'ព្យាករណ៍', icon: ChartNoAxesCombined },
  { id: 'alerts', label: 'Alerts', kh: 'ជូនដំណឹង', icon: Bell, badge: true },
  { id: 'ask', label: 'Ask', kh: 'សួរ', icon: MessageCircle },
];

export const pageTitles = {
  pulse: 'Your pulse',
  map: 'Live map',
  station: 'Station detail',
  forecast: '3-month outlook',
  alerts: 'Alerts & actions',
  ask: 'Ask PulseWatch',
  more: 'Explore',
  refuges: 'Adaptive refuges',
  report: 'Community report',
  impact: 'Impact evidence',
};

export const rootTabs = {
  station: 'map',
};
