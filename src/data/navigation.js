import {
  Bell,
  ChartNoAxesCombined,
  Map as MapIcon,
  MessageCircle,
  Waves,
} from 'lucide-react';

export const navItems = [
  { id: 'pulse', label: 'Home', kh: 'ទំព័រដើម', icon: Waves },
  { id: 'map', label: 'Map', kh: 'ផែនទី', icon: MapIcon },
  { id: 'forecast', label: 'Forecast', kh: 'ព្យាករណ៍', icon: ChartNoAxesCombined },
  { id: 'alerts', label: 'Alerts', kh: 'ការជូនដំណឹង', icon: Bell, badge: true },
  { id: 'ask', label: 'Help', kh: 'ជំនួយ', icon: MessageCircle },
];

export const pageTitles = {
  pulse: { en: 'Home', kh: 'ទំព័រដើម' },
  map: { en: 'Live map', kh: 'ផែនទីទឹក' },
  station: { en: 'Station details', kh: 'ព័ត៌មានស្ថានីយ' },
  forecast: { en: 'Water forecast', kh: 'ការព្យាករណ៍ទឹក' },
  alerts: { en: 'Alerts and actions', kh: 'ការជូនដំណឹង និងសកម្មភាព' },
  ask: { en: 'Help', kh: 'ជំនួយ' },
  more: { en: 'More', kh: 'បន្ថែម' },
  refuges: { en: 'Fish refuges', kh: 'ជម្រកត្រី' },
  report: { en: 'Community report', kh: 'របាយការណ៍សហគមន៍' },
  impact: { en: 'Impact evidence', kh: 'ភស្តុតាងផលប៉ះពាល់' },
  admin: { en: 'Authority dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
};

export const rootTabs = {
  station: 'map',
};
