const variants = {
  active:  { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Actif' },
  inactive:{ bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Inactif' },
  leave:   { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'En congé' },
  normal:  { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Normal' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Attention' },
  low:     { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Stock bas' },
  empty:   { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Rupture' },
};

export default function Badge({ status }) {
  const v = variants[status];
  if (!v) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide" style={{ padding: '4px 10px', borderRadius: 20, background: v.bg, color: v.color }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
      {v.label}
    </span>
  );
}