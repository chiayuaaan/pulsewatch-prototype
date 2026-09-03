import { useEffect, useRef, useState } from 'react';
import { BookOpenText, House, Languages, LayoutGrid, Menu, ShieldCheck, X } from 'lucide-react';
import BrandMark from './BrandMark';
import { pageTitles } from '../data/navigation';

export default function AppHeader({ activePage, language, onToggleLanguage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const pageTitle = pageTitles[activePage]?.en ?? '';

  useEffect(() => setMenuOpen(false), [activePage]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnOutsidePress = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const goTo = (page) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="app-header" ref={headerRef}>
      <button
        className={menuOpen ? 'brand-lockup brand-button menu-open' : 'brand-lockup brand-button'}
        onClick={() => setMenuOpen((value) => !value)}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <BrandMark />
        <span className="brand-copy">
          <strong>PulseWatch</strong>
          <span>{pageTitle}</span>
        </span>
        <span className="brand-menu-indicator" aria-hidden="true">{menuOpen ? <X size={19} /> : <Menu size={19} />}</span>
      </button>
      <div className="header-actions">
        <button className="language-button" data-no-translate onClick={onToggleLanguage} type="button" aria-label={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}>
          <Languages size={16} strokeWidth={2.2} />
          {language === 'en' ? 'ខ្មែរ' : 'English'}
        </button>
        <button
          className={menuOpen ? 'menu-button active' : 'menu-button'}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          type="button"
        >
          <LayoutGrid size={18} />
          <span>Menu</span>
        </button>
      </div>
      {menuOpen && (
        <nav className="app-menu-panel" aria-label="Application menu" role="menu">
          <span className="app-menu-heading">Where would you like to go?</span>
          <button onClick={() => goTo('pulse')} type="button" role="menuitem"><House size={19} /><span><strong>Home</strong><small>Current water and guidance</small></span></button>
          <button onClick={() => goTo('more')} type="button" role="menuitem"><LayoutGrid size={19} /><span><strong>More features</strong><small>Reports, refuges and evidence</small></span></button>
          <button onClick={() => goTo('landing')} type="button" role="menuitem"><BookOpenText size={19} /><span><strong>Back to the story</strong><small>How PulseWatch works</small></span></button>
          <button className="authority-menu-link" onClick={() => goTo('admin-login')} type="button" role="menuitem"><ShieldCheck size={19} /><span><strong>Authority sign in</strong><small>Restricted operations workspace</small></span></button>
        </nav>
      )}
    </header>
  );
}
