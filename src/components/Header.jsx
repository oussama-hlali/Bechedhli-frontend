const TITLES = {
  dashboard: 'Tableau de Bord',
  employees: 'Gestion des Employés',
  stock: 'Gestion du Stock',
  clients: 'Suivi Clients',
};

export default function Header({ activeView }) {
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <header style={{ height: 64, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(6,11,24,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{TITLES[activeView]}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{dateStr}</span>
        <button style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          aria-label="Notifications">
          <i className="fa-solid fa-bell" style={{ fontSize: 14 }} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--bg)' }} />
        </button>
      </div>
    </header>
  );
}
