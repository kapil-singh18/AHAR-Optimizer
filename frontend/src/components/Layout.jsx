import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { UserButton } from '@clerk/clerk-react';

const navItems = [
  {
    label: 'INTELLIGENCE',
    items: [
      { path: '/', label: 'Overview', icon: 'grid' },
      { path: '/prediction', label: 'Demand Forecasting', icon: 'trend' },
      { path: '/analytics', label: 'Analytics', icon: 'chart' }
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { path: '/menu', label: 'Menu Management', icon: 'menu' },
      { path: '/inventory', label: 'Inventory', icon: 'inventory' },
      { path: '/consumption', label: 'Consumption', icon: 'plate' },
      { path: '/donations', label: 'Surpluses & Donations', icon: 'donation' }
    ]
  }
];

const pageLabels = {
  '/': 'Overview',
  '/prediction': 'Demand Forecasting',
  '/analytics': 'Analytics',
  '/menu': 'Menu Management',
  '/inventory': 'Inventory',
  '/consumption': 'Consumption',
  '/expiry': 'Expiry & Images',
  '/donations': 'Surpluses & Donations',
  '/recommendations': 'Recommendations',
  '/guide': 'Guide',
  '/payment': 'Payment'
};

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    trend: <><path d="M3 17l5-5 4 3 7-8" /><path d="M14 7h5v5" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    inventory: <><path d="M3 6l9-3 9 3-9 3-9-3z" /><path d="M3 6v12l9 3 9-3V6M12 9v12" /></>,
    plate: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /></>,
    donation: <><path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z" /></>,
    menuOpen: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="M6 6l12 12M18 6L6 18" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 118.5 4a7 7 0 0011.5 11.5z" />
  };

  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Layout({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'eco-light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'eco-dark' ? 'dark' : 'light');
    document.body.setAttribute('data-theme', theme === 'eco-dark' ? 'eco-dark' : 'eco-light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const currentTitle = pageLabels[location.pathname] || 'AHAR';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`} aria-label="Primary navigation">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="" />
          <div>
            <strong>AHAR</strong>
            <span>Food Intelligence</span>
          </div>
          <button className="sidebar-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon name={item.icon} />
                    <span>{t(item.label)}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="language-toggle" onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
            {language === 'hi' ? 'EN' : 'हिं'}
            <span>{language === 'hi' ? 'English' : 'Hindi'}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Icon name="menuOpen" />
          </button>
          <div className="topbar-title">
            <span>AHAR /</span>
            <strong>{t(currentTitle)}</strong>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((prev) => (prev === 'eco-dark' ? 'eco-light' : 'eco-dark'))}
              aria-label={theme === 'eco-dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <Icon name={theme === 'eco-dark' ? 'sun' : 'moon'} />
              <span>{theme === 'eco-dark' ? 'Light' : 'Dark'}</span>
            </button>
            <div className="account-control"><UserButton /></div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
