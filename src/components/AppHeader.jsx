import { Languages, LayoutGrid } from 'lucide-react';
import BrandMark from './BrandMark';
import { pageTitles } from '../data/navigation';

export default function AppHeader({ activePage, language, onToggleLanguage, onNavigate }) {
  const pageTitle = pageTitles[activePage]?.[language] ?? pageTitles[activePage]?.en ?? '';

  return (
    <header className="app-header">
      <button className="brand-lockup brand-button" onClick={() => onNavigate('pulse')} type="button">
        <BrandMark />
        <span className="brand-copy">
          <strong>PulseWatch</strong>
          <span>{pageTitle}</span>
        </span>
      </button>
      <div className="header-actions">
        <button className="language-button" onClick={onToggleLanguage} type="button" aria-label={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}>
          <Languages size={16} strokeWidth={2.2} />
          {language === 'en' ? 'ខ្មែរ' : 'English'}
        </button>
        <button
          className={activePage === 'more' ? 'menu-button active' : 'menu-button'}
          onClick={() => onNavigate('more')}
          aria-label="More features"
          type="button"
        >
          <LayoutGrid size={18} />
          <span>{language === 'en' ? 'More' : 'បន្ថែម'}</span>
        </button>
      </div>
    </header>
  );
}
