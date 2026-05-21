import { useTheme } from '../context/ThemeContext';

const TITLES = {
  dashboard: 'Tableau de Bord',
  employees: 'Gestion des Employés',
  stock: 'Gestion du Stock',
  clients: 'Suivi Clients',
};

export default function Header({ activeView }) {
  const { theme, toggleTheme } = useTheme();
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <header style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--header-bg)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{TITLES[activeView]}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{dateStr}</span>
        <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          aria-label={theme === 'light' ? 'Mode sombre' : 'Mode clair'}>
          <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} style={{ fontSize: 14 }} />
        </button>
        <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }}
          aria-label="Notifications">
          <i className="fa-solid fa-bell" style={{ fontSize: 14 }} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--bg)' }} />
        </button>
      </div>
    </header>
  );
}
