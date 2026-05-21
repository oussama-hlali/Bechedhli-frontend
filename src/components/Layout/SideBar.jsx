import { LayoutDashboard, Users, Warehouse, ChevronRight } from 'lucide-react';
import SolarLogo from '../SolarLogo';

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'employees', label: 'Gestion des Employés', icon: Users },
  { id: 'stock',     label: 'Gestion du Stock', icon: Warehouse },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="fixed left-0 top-0 z-[100] flex flex-col" style={{ width: 260, height: '100vh', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3" style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <SolarLogo size={120} />
        <div>
          <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.2 }}>Bechedhli</h2>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#F97316', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Solar Energy</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1" style={{ padding: '16px 12px' }}>
        <p className="text-xs font-bold uppercase tracking-widest px-4 py-2 mb-1" style={{ color: 'var(--fg-muted)' }}>Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button key={item.id} onClick={() => setActiveView(item.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive ? 'nav-active' : ''}`}
              style={{ color: isActive ? 'var(--solar-orange)' : 'var(--fg-muted)', background: isActive ? 'var(--solar-orange-glow)' : 'transparent' }}>
              <Icon size={16} className="w-[18px] text-center" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      {/* Profil */}
      <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--sidebar-user-bg)' }}>
          <div className="flex items-center justify-center shrink-0 rounded-[10px] font-display font-bold text-sm" style={{ width: 38, height: 38, background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>DC</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>Directeur Commercial</p>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Espace de gestion</p>
          </div>
        </div>
      </div>
    </aside>
  );
}