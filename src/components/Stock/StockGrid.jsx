import { Pencil, Trash2 } from 'lucide-react';
import { getStockStatus, CAT_META } from '../../data/stock';
import { formatDZD } from '../../data/employees';
import Badge from '../UI/Badge';

const ICON_MAP = {
  SolarPanel: Pencil,
  Zap: Pencil,
  Battery: Pencil,
  Cable: Pencil,
  Wrench: Pencil,
};

function progressColor(item) {
  const s = getStockStatus(item);
  if (s === 'empty' || s === 'low') return '#EF4444';
  if (s === 'warning') return '#F59E0B';
  return '#10B981';
}

function stockBadgeStatus(item) {
  const s = getStockStatus(item);
  if (s === 'empty') return 'empty';
  if (s === 'low') return 'low';
  if (s === 'warning') return 'warning';
  return 'normal';
}

export default function StockGrid({ stock, onEdit, onDelete }) {
  const getCatColor = (cat) => CAT_META[cat]?.color || '#64748B';

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {stock.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ color: '#64748B', background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', border: '1px solid rgba(255,255,255,0.06)', gridColumn: '1/-1' }}>Aucun produit trouvé</div>
      ) : stock.map((item, i) => {
        const catColor = getCatColor(item.category);
        const pct = Math.min(100, (item.qty / (item.minQty * 3)) * 100);
        return (
          <div key={item.id} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}>
            <div className="flex justify-between items-start mb-3.5">
              <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: `${catColor}15` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {item.category === 'Panneaux' && <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></>}
                  {item.category === 'Onduleurs' && <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>}
                  {item.category === 'Batteries' && <><rect x="6" y="7" width="12" height="14" rx="2" /><line x1="10" y1="3" x2="10" y2="7" /><line x1="14" y1="3" x2="14" y2="7" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="6" y1="17" x2="18" y2="17" /></>}
                  {item.category === 'Câblage' && <><path d="M12 2v6" /><path d="M12 22v-6" /><circle cx="12" cy="12" r="4" /><path d="M8 12H2" /><path d="M22 12h-6" /></>}
                  {item.category === 'Accessoires' && <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>}
                </svg>
              </div>
              <Badge status={stockBadgeStatus(item)} />
            </div>
            <h4 className="font-display text-sm font-bold mb-1 leading-snug">{item.name}</h4>
            <p className="text-xs mb-3.5" style={{ color: '#64748B' }}>{item.supplier} — {item.location}</p>
            <div className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs" style={{ color: '#64748B' }}>Stock</span>
                <span className="text-xs font-display font-bold" style={{ color: progressColor(item) }}>{item.qty} / min {item.minQty}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${progressColor(item)}, ${progressColor(item)}88)` }} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-display text-[15px] font-bold" style={{ color: '#F97316' }}>{formatDZD(item.price)}</span>
              <div className="flex gap-1.5">
                <StockActionBtn onClick={() => onEdit(item)} hoverColor="#3B82F6" label="Modifier" />
                <StockActionBtn onClick={() => onDelete(item)} hoverColor="#EF4444" label="Supprimer" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StockActionBtn({ onClick, hoverColor, label }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center rounded-lg cursor-pointer transition-all" style={{ width: 30, height: 30, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#64748B', fontSize: 11 }}
      onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.borderColor = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
      aria-label={label}>
      {label === 'Modifier' ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
      )}
    </button>
  );
}
