export default function StatCard({ label, value, suffix, icon: Icon, color, trend, trendUp, delay }) {
  return (
    <div className="glass-card animate-slide-up relative overflow-hidden" style={{ padding: '22px 24px', animationDelay: `${delay}s` }}>
      <div className="stat-accent" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex justify-between items-start mb-3.5">
        <div>
          <p className="uppercase tracking-wide" style={{ color: '#64748B', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>{label}</p>
          <p className="font-display font-bold leading-none" style={{ fontSize: 28 }}>
            {value}<span className="font-normal" style={{ fontSize: 14, fontWeight: 500, color: '#64748B', marginLeft: 4 }}>{suffix}</span>
          </p>
        </div>
        <div className="flex items-center justify-center rounded-xl" style={{ width: 42, height: 42, background: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-xs flex items-center gap-1" style={{ color: trendUp ? '#10B981' : '#F59E0B' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          {trendUp
            ? <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
            : <circle cx="5" cy="5" r="3" fill="currentColor" />
          }
        </svg>
        {trend}
      </p>
    </div>
  );
}
