import { Bell } from 'lucide-react';

const titles = { dashboard: 'Tableau de Bord', employees: 'Gestion des Employés', stock: 'Gestion du Stock' };

export default function Header({ activeView }) {
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8" style={{ height: 64, borderBottom: '1px solid var(--border)', background: 'var(--header-bg)', backdropFilter: 'blur(12px)' }}>
      <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{titles[activeView]}</h2>
      <div className="flex items-center gap-5">
        <span className="text-sm capitalize" style={{ color: 'var(--fg-muted)' }}>{dateStr}</span>
        <button className="relative flex items-center justify-center rounded-[10px] transition-all cursor-pointer" style={{ width: 38, height: 38, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)' }} aria-label="Notifications">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" style={{ border: '2px solid var(--bg)' }} />
        </button>
      </div>
    </header>
  );
}