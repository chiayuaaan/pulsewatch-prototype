import { navItems, rootTabs } from '../data/navigation';

export default function BottomNav({ activePage, language, onChange }) {
  const activeTab = rootTabs[activePage] ?? activePage;
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={active ? 'nav-button active' : 'nav-button'}
            onClick={() => onChange(item.id)}
            type="button"
            aria-current={active ? 'page' : undefined}
          >
            <span className="nav-icon-wrap">
              <Icon size={21} strokeWidth={active ? 2.5 : 2} />
              {item.badge && <i className="nav-badge" />}
            </span>
            <span>{language === 'en' ? item.label : item.kh}</span>
          </button>
        );
      })}
    </nav>
  );
}
