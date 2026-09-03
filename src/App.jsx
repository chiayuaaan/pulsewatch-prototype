import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import AlertsPage from './pages/AlertsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AskPage from './pages/AskPage';
import ForecastPage from './pages/ForecastPage';
import ImpactPage from './pages/ImpactPage';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import MorePage from './pages/MorePage';
import OnboardingPage from './pages/OnboardingPage';
import PulsePage from './pages/PulsePage';
import RefugesPage from './pages/RefugesPage';
import ReportPage from './pages/ReportPage';
import StationPage from './pages/StationPage';

export default function App() {
  const [activePage, setActivePage] = useState(() => window.location.hash === '#authority' ? 'admin-login' : 'landing');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedStationId, setSelectedStationId] = useState('kampong-phluk');

  useEffect(() => {
    const followAuthorityUrl = () => {
      if (window.location.hash === '#authority') {
        setActivePage(adminAuthenticated ? 'admin' : 'admin-login');
      }
    };
    window.addEventListener('hashchange', followAuthorityUrl);
    return () => window.removeEventListener('hashchange', followAuthorityUrl);
  }, [adminAuthenticated]);

  const navigate = (page, options = {}) => {
    if (options.stationId) setSelectedStationId(options.stationId);
    if (page === 'admin-login') window.history.replaceState(null, '', '#authority');
    setActivePage(page);
  };

  const enterAdmin = () => {
    setAdminAuthenticated(true);
    window.history.replaceState(null, '', '#authority');
    setActivePage('admin');
  };

  const signOutAdmin = () => {
    setAdminAuthenticated(false);
    setActivePage('admin-login');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'landing': return <LandingPage onNavigate={navigate} />;
      case 'onboarding': return <OnboardingPage language={language} onToggleLanguage={() => setLanguage((value) => value === 'en' ? 'kh' : 'en')} onNavigate={navigate} />;
      case 'admin-login': return <AdminLoginPage onAuthenticate={enterAdmin} />;
      case 'admin': return adminAuthenticated
        ? <AdminPage onSignOut={signOutAdmin} />
        : <AdminLoginPage onAuthenticate={enterAdmin} />;
      case 'map': return <MapPage onNavigate={navigate} />;
      case 'station': return <StationPage stationId={selectedStationId} onNavigate={navigate} />;
      case 'forecast': return <ForecastPage onNavigate={navigate} />;
      case 'alerts': return <AlertsPage />;
      case 'ask': return <AskPage onNavigate={navigate} />;
      case 'more': return <MorePage onNavigate={navigate} />;
      case 'refuges': return <RefugesPage onNavigate={navigate} />;
      case 'report': return <ReportPage onNavigate={navigate} />;
      case 'impact': return <ImpactPage onNavigate={navigate} />;
      default: return <PulsePage language={language} onNavigate={navigate} />;
    }
  };

  const authorityPage = activePage === 'admin-login' || activePage === 'admin';
  const immersivePage = activePage === 'landing' || activePage === 'onboarding' || authorityPage;

  return (
    <div className="app-stage">
      <div className={`app-shell ${activePage === 'landing' ? 'landing-mode' : ''} ${activePage === 'onboarding' ? 'onboarding-mode' : ''} ${authorityPage ? 'admin-mode' : ''}`} data-page={activePage}>
        {!immersivePage && (
          <AppHeader
            activePage={activePage}
            language={language}
            onToggleLanguage={() => setLanguage((value) => value === 'en' ? 'kh' : 'en')}
            onNavigate={navigate}
          />
        )}
        <main className={`app-content ${activePage === 'landing' ? 'landing-content' : ''} ${activePage === 'onboarding' ? 'onboarding-content' : ''} ${authorityPage ? 'admin-content' : ''}`} key={activePage}>
          {renderPage()}
        </main>
        {!immersivePage && (
          <BottomNav activePage={activePage} language={language} onChange={navigate} />
        )}
      </div>
    </div>
  );
}
