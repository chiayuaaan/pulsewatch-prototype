import { useEffect, useRef, useState } from 'react';
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
import useAutoTranslate from './hooks/useAutoTranslate';

function loadPreferredLanguage() {
  try {
    return window.localStorage.getItem('pulsewatch-language') === 'kh' ? 'kh' : 'en';
  } catch {
    return 'en';
  }
}

export default function App() {
  const [activePage, setActivePage] = useState(() => window.location.hash === '#authority' ? 'admin-login' : 'landing');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [language, setLanguage] = useState(loadPreferredLanguage);
  const [selectedStationId, setSelectedStationId] = useState('kampong-phluk');
  const shellRef = useRef(null);
  const translationStatus = useAutoTranslate(shellRef, language, activePage);

  const toggleLanguage = () => setLanguage((value) => value === 'en' ? 'kh' : 'en');

  useEffect(() => {
    try {
      window.localStorage.setItem('pulsewatch-language', language);
    } catch {
      // The selected language still works when browser storage is unavailable.
    }
  }, [language]);

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
    if (page !== 'admin-login' && page !== 'admin' && window.location.hash === '#authority') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
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
      case 'landing': return <LandingPage language={language} onToggleLanguage={toggleLanguage} onNavigate={navigate} />;
      case 'onboarding': return <OnboardingPage language="en" activeLanguage={language} onToggleLanguage={toggleLanguage} onNavigate={navigate} />;
      case 'admin-login': return <AdminLoginPage language={language} onToggleLanguage={toggleLanguage} onAuthenticate={enterAdmin} onNavigate={navigate} />;
      case 'admin': return adminAuthenticated
        ? <AdminPage language={language} onToggleLanguage={toggleLanguage} onSignOut={signOutAdmin} />
        : <AdminLoginPage language={language} onToggleLanguage={toggleLanguage} onAuthenticate={enterAdmin} onNavigate={navigate} />;
      case 'map': return <MapPage onNavigate={navigate} />;
      case 'station': return <StationPage stationId={selectedStationId} onNavigate={navigate} />;
      case 'forecast': return <ForecastPage onNavigate={navigate} />;
      case 'alerts': return <AlertsPage />;
      case 'ask': return <AskPage onNavigate={navigate} />;
      case 'more': return <MorePage onNavigate={navigate} />;
      case 'refuges': return <RefugesPage onNavigate={navigate} />;
      case 'report': return <ReportPage onNavigate={navigate} />;
      case 'impact': return <ImpactPage onNavigate={navigate} />;
      default: return <PulsePage language="en" onNavigate={navigate} />;
    }
  };

  const authorityPage = activePage === 'admin-login' || activePage === 'admin';
  const immersivePage = activePage === 'landing' || activePage === 'onboarding' || authorityPage;

  return (
    <div className="app-stage">
      <div ref={shellRef} lang={language === 'kh' ? 'km' : 'en'} className={`app-shell ${activePage === 'landing' ? 'landing-mode' : ''} ${activePage === 'onboarding' ? 'onboarding-mode' : ''} ${authorityPage ? 'admin-mode' : ''}`} data-page={activePage}>
        {!immersivePage && (
          <AppHeader
            activePage={activePage}
            language={language}
            onToggleLanguage={toggleLanguage}
            onNavigate={navigate}
          />
        )}
        <main className={`app-content ${activePage === 'landing' ? 'landing-content' : ''} ${activePage === 'onboarding' ? 'onboarding-content' : ''} ${authorityPage ? 'admin-content' : ''}`} key={activePage}>
          {renderPage()}
        </main>
        {!immersivePage && (
          <BottomNav activePage={activePage} language="en" onChange={navigate} />
        )}
      </div>
      {language === 'kh' && translationStatus === 'loading' && (
        <div className="translation-status" data-no-translate role="status">កំពុងបកប្រែជាភាសាខ្មែរ…</div>
      )}
      {language === 'kh' && translationStatus === 'unavailable' && (
        <div className="translation-status error" data-no-translate role="status">ការបកប្រែជាភាសាខ្មែរមិនទាន់ដំណើរការ។ សូមពិនិត្យការកំណត់ API។</div>
      )}
    </div>
  );
}
