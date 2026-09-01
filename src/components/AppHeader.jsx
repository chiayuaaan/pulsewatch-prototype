import { Languages, LayoutGrid } from 'lucide-react';
import BrandMark from './BrandMark';
import { pageTitles } from '../data/navigation';

export default function AppHeader({ activePage, language, onToggleLanguage, onNavigate }) {
  return (
    <header className="app-header">
      <button className="brand-lockup brand-button" onClick={() => onNavigate('pulse')} type="button">
        <BrandMark />
        <span className="brand-copy">
          <strong>PulseWatch</strong>
          <span>{pageTitles[activePage]}</span>
        </span>
      </button>
      <div className="header-actions">
        <button className="language-button" onClick={onToggleLanguage} type="button">
          <Languages size={16} strokeWidth={2.2} />
          {language === 'en' ? 'ខ្មែរ' : 'EN'}
        </button>
        <button
          className={activePage === 'more' ? 'menu-button active' : 'menu-button'}
          onClick={() => onNavigate('more')}
          aria-label="More features"
          type="button"
        >
          <LayoutGrid size={18} />
        </button>
      </div>
    </header>
  );
}
