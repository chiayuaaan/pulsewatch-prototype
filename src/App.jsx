import { useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import AlertsPage from './pages/AlertsPage';
import AskPage from './pages/AskPage';
import ForecastPage from './pages/ForecastPage';
import ImpactPage from './pages/ImpactPage';
import MapPage from './pages/MapPage';
import MorePage from './pages/MorePage';
import PulsePage from './pages/PulsePage';
import RefugesPage from './pages/RefugesPage';
import ReportPage from './pages/ReportPage';
import StationPage from './pages/StationPage';

export default function App() {
  const [activePage, setActivePage] = useState('pulse');
  const [language, setLanguage] = useState('en');
  const [selectedStationId, setSelectedStationId] = useState('kampong-phluk');

  const navigate = (page, options = {}) => {
    if (options.stationId) setSelectedStationId(options.stationId);
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'map': return <MapPage onNavigate={navigate} />;
      case 'station': return <StationPage stationId={selectedStationId} onNavigate={navigate} />;
      case 'forecast': return <ForecastPage onNavigate={navigate} />;
      case 'alerts': return <AlertsPage />;
      case 'ask': return <AskPage onNavigate={navigate} />;
      case 'more': return <MorePage onNavigate={navigate} />;
      case 'refuges': return <RefugesPage onNavigate={navigate} />;
      case 'report': return <ReportPage onNavigate={navigate} />;
      case 'impact': return <ImpactPage onNavigate={navigate} />;
      default: return <PulsePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-stage">
      <div className="app-shell">
        <AppHeader
          activePage={activePage}
          language={language}
          onToggleLanguage={() => setLanguage((value) => value === 'en' ? 'kh' : 'en')}
          onNavigate={navigate}
        />
        <main className="app-content" key={activePage}>{renderPage()}</main>
        <BottomNav activePage={activePage} language={language} onChange={navigate} />
      </div>
    </div>
  );
}
