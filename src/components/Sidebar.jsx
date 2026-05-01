import SolarLogo from './SolarLogo';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: 'fa-chart-line' },
  { id: 'employees', label: 'Gestion des Employés', icon: 'fa-users' },
  { id: 'stock', label: 'Gestion du Stock', icon: 'fa-warehouse' },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside style={{
      width: 260, height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SolarLogo size={42} />
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.2 }}>Bechedhli</h2>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--solar-orange)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Solar Energy</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '8px 16px', marginBottom: 4,
        }}>Navigation</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <i className={`fa-solid ${item.icon}`} style={{ width: 18, textAlign: 'center', fontSize: 14 }} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile */}
      <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 12,
        }}>
          <div className="avatar" style={{ width: 38, height: 38, background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 13 }}>DC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Directeur Commercial</p>
            <p style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Espace de gestion</p>
          </div>
          <i className="fa-solid fa-ellipsis-vertical" style={{ color: 'var(--fg-muted)', fontSize: 12 }} />
        </div>
      </div>
    </aside>
  );
}
