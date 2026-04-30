import { formatDZD } from '../../data/employees';

export default function TopProducts({ stock }) {
  const top = [...stock].sort((a, b) => (b.qty * b.price) - (a.qty * a.price)).slice(0, 5);

  return (
    <div className="rounded-2xl p-6 animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.3s' }}>
      <h3 className="font-display mb-4" style={{ fontSize: 15, fontWeight: 700 }}>Top Produits en Valeur</h3>
      <div className="flex flex-col gap-3.5">
        {top.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="font-display flex items-center justify-center rounded-md text-xs font-bold" style={{ width: 22, height: 22, background: i === 0 ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)', color: i === 0 ? '#F97316' : '#64748B' }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{p.name}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>{p.qty} unités</p>
            </div>
            <span className="font-display text-[13px] font-bold whitespace-nowrap" style={{ color: '#F97316' }}>{formatDZD(p.qty * p.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}