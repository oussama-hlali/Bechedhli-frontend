import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getStockStatus } from '../data';

const TITLES = {
  dashboard: 'Tableau de Bord',
  employees: 'Gestion des Employés',
  stock: 'Gestion du Stock',
  clients: 'Suivi Clients',
  livraison: 'Livraison & Facturation',
  steg: 'Suivi Doc STEG',
  facturation: 'Facturation Client',
};

export default function Header({ activeView, stock, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const notifRef = useRef(null);
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const lowStockItems = (stock || []).filter(i => ['low', 'empty'].includes(getStockStatus(i)));
  const activeNotifs = lowStockItems.filter(i => !dismissed.has(i.id));

  const dismissNotif = (id) => setDismissed(prev => new Set([...prev, id]));
  const clearAll = () => setDismissed(new Set(lowStockItems.map(i => i.id)));

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--header-bg)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{TITLES[activeView] || activeView}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{dateStr}</span>
        <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          aria-label={theme === 'light' ? 'Mode sombre' : 'Mode clair'}>
          <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} style={{ fontSize: 14 }} />
        </button>
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: notifOpen ? 'rgba(249,115,22,0.08)' : 'transparent', color: lowStockItems.length > 0 ? '#F97316' : 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }}
            aria-label="Notifications">
            <i className="fa-solid fa-bell" style={{ fontSize: 14 }} />
            {activeNotifs.length > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, background: '#EF4444', borderRadius: 8, border: '2px solid var(--header-bg)', fontSize: 9, fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
                {activeNotifs.length > 9 ? '9+' : activeNotifs.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="animate-scale-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340, maxHeight: 380, background: 'var(--bg-sidebar)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,.4)', zIndex: 200 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {activeNotifs.length > 0 && (
                    <span onClick={clearAll} style={{ fontSize: 11, color: '#EF4444', cursor: 'pointer', fontWeight: 600 }}>Tout effacer</span>
                  )}
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 10, background: activeNotifs.length > 0 ? 'rgba(239,68,68,.12)' : 'rgba(148,163,184,.08)', color: activeNotifs.length > 0 ? '#EF4444' : 'var(--fg-muted)', fontWeight: 600 }}>{activeNotifs.length} alerte{activeNotifs.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {activeNotifs.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--fg-muted)' }}>
                    <i className="fa-solid fa-circle-check" style={{ fontSize: 28, color: '#10B981', marginBottom: 12, opacity: 0.5 }} /><br />
                    <span style={{ fontSize: 13 }}>Aucune alerte stock</span>
                  </div>
                ) : (
                  activeNotifs.map((item, i) => {
                    const isRupture = item.qty === 0;
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < activeNotifs.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: isRupture ? 'rgba(239,68,68,.12)' : 'rgba(245,158,11,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="fa-solid fa-box" style={{ color: isRupture ? '#EF4444' : '#F59E0B', fontSize: 13 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ fontSize: 11, color: isRupture ? '#EF4444' : '#F59E0B', marginTop: 1 }}>
                            <strong>{item.qty}</strong> / min {item.minQty} — {isRupture ? 'Rupture de stock' : 'Stock bas'}
                          </p>
                        </div>
                        <button onClick={() => dismissNotif(item.id)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.5, transition: 'opacity .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                          aria-label="Ignorer">
                          <i className="fa-solid fa-xmark" style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {lowStockItems.length > 0 && (
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                  <span style={{ fontSize: 12, color: '#F97316', fontWeight: 600, cursor: 'pointer' }} onClick={() => { if (onNavigate) onNavigate('stock'); setNotifOpen(false); }}>
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: 10, marginRight: 6 }} />Voir le stock
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
