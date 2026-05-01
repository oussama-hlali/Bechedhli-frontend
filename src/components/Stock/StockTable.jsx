import { useState, useMemo } from 'react';
import { Search, Plus, List, LayoutGrid, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { CATEGORIES, getStockStatus, CAT_META } from '../../data/stock';
import { formatDZD } from '../../data/employees';
import Badge from '../UI/Badge';
import ConfirmModal from '../UI/ConfirmModal';
import StockForm from './StockForm';
import StockGrid from './StockGrid';
import { useToast } from '../../context/ToastContext';

const ICON_MAP = { SolarPanel: Pencil, Zap: Pencil, Battery: Pencil, Cable: Pencil, Wrench: Pencil };

export default function StockTable({ stock, setStock }) {
  const addToast = useToast();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const lowItems = useMemo(() => stock.filter(i => { const s = getStockStatus(i); return s === 'low' || s === 'empty'; }), [stock]);

  const filtered = useMemo(() => stock.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.supplier.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && item.category !== catFilter) return false;
    if (statusFilter !== 'all') {
      const s = getStockStatus(item);
      if (statusFilter === 'alert' && s !== 'low' && s !== 'empty') return false;
      if (statusFilter === 'ok' && s !== 'normal' && s !== 'warning') return false;
    }
    return true;
  }), [stock, search, catFilter, statusFilter]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };

  const handleSave = (data) => {
    if (editing) {
      setStock(prev => prev.map(i => i.id === editing.id ? { ...i, ...data } : i));
      addToast(`${data.name} mis à jour`);
    } else {
      setStock(prev => [...prev, { ...data, id: Date.now() }]);
      addToast(`${data.name} ajouté au stock`);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    setStock(prev => prev.filter(i => i.id !== selected.id));
    addToast(`${selected.name} supprimé du stock`);
    setDeleteOpen(false); setSelected(null);
  };

  const progressColor = (item) => {
    const s = getStockStatus(item);
    if (s === 'empty' || s === 'low') return '#EF4444';
    if (s === 'warning') return '#F59E0B';
    return '#10B981';
  };

  const getCatIcon = (cat) => { const meta = CAT_META[cat]; return meta ? ICON_MAP[meta.icon] || Pencil : Pencil; };
  const getCatColor = (cat) => CAT_META[cat]?.color || '#64748B';

  const stockBadgeStatus = (item) => {
    const s = getStockStatus(item);
    if (s === 'empty') return 'empty';
    if (s === 'low') return 'low';
    if (s === 'warning') return 'warning';
    return 'normal';
  };

  const inputStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', color: '#F1F5F9', fontSize: 14 };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Gestion du Stock</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>{stock.length} produits — {lowItems.length} alertes</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(249,115,22,0.35)]" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
          <Plus size={16} /> Nouveau Produit
        </button>
      </div>

      {lowItems.length > 0 && (
        <div className="animate-slide-up flex items-center gap-3 rounded-[14px] p-3.5 mb-5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={16} style={{ color: '#EF4444' }} />
          <span className="text-[13px] flex-1">
            <strong style={{ color: '#EF4444' }}>{lowItems.length} produit(s)</strong> nécessitent un réapprovisionnement :
            {lowItems.slice(0, 3).map((item, i) => <span key={item.id} style={{ color: '#94A3B8' }}>{i > 0 ? ', ' : ' '}{item.name} ({item.qty}/{item.minQty})</span>)}
            {lowItems.length > 3 && <span style={{ color: '#94A3B8' }}> et {lowItems.length - 3} autres...</span>}
          </span>
        </div>
      )}

      <div className="rounded-2xl p-4 mb-5 flex gap-3 flex-wrap items-center" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
          <input className="input-field w-full pl-10" placeholder="Rechercher par nom ou fournisseur..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field" style={{ ...inputStyle, width: 'auto', minWidth: 150, cursor: 'pointer' }}>
          <option value="all">Toutes catégories</option>{CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#131B2E' }}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ ...inputStyle, width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="all">Tous les statuts</option><option value="ok" style={{ background: '#131B2E' }}>Normal</option><option value="alert" style={{ background: '#131B2E' }}>En alerte</option>
        </select>
        <div className="flex gap-1 p-0.5 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'table', icon: List }, { id: 'grid', icon: LayoutGrid }
          ].map(v => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setViewMode(v.id)} className="flex items-center justify-center rounded-lg cursor-pointer transition-all" style={{ padding: '7px 12px', border: 'none', background: viewMode === v.id ? 'rgba(249,115,22,0.15)' : 'transparent', color: viewMode === v.id ? '#F97316' : '#64748B' }} aria-label={v.id}>
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['Produit', 'Catégorie', 'Quantité', 'Niveau', 'Prix Unitaire', 'Valeur Totale', 'Fournisseur', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b" style={{ color: '#64748B', fontFamily: 'Space Grotesk', borderColor: 'rgba(255,255,255,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10" style={{ color: '#64748B' }}>Aucun produit trouvé</td></tr>
                ) : filtered.map((item, i) => {
                  const CatIcon = getCatIcon(item.category);
                  const catColor = getCatColor(item.category);
                  const pct = Math.min(100, (item.qty / (item.minQty * 3)) * 100);
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-orange-500/[0.04]" style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}>
                      <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 flex items-center justify-center rounded-[10px]" style={{ width: 38, height: 38, background: `${catColor}15` }}><CatIcon size={14} style={{ color: catColor }} /></div>
                          <div><p className="font-semibold text-[13px]">{item.name}</p><p className="text-xs" style={{ color: '#64748B' }}>{item.location}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold border-b" style={{ color: catColor, borderColor: 'rgba(255,255,255,0.03)' }}>{item.category}</td>
                      <td className="px-4 py-3.5 font-display font-bold text-[15px] border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>{item.qty}</td>
                      <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <Badge status={stockBadgeStatus(item)} />
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: progressColor(item) }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-display text-[13px] border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>{formatDZD(item.price)}</td>
                      <td className="px-4 py-3.5 font-display font-bold text-[13px] border-b" style={{ color: '#F97316', borderColor: 'rgba(255,255,255,0.03)' }}>{formatDZD(item.qty * item.price)}</td>
                      <td className="px-4 py-3.5 text-[13px] border-b" style={{ color: '#94A3B8', borderColor: 'rgba(255,255,255,0.03)' }}>{item.supplier}</td>
                      <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex gap-1.5">
                          <ActionBtn icon={Pencil} onClick={() => openEdit(item)} hoverColor="#3B82F6" />
                          <ActionBtn icon={Trash2} onClick={() => { setSelected(item); setDeleteOpen(true); }} hoverColor="#EF4444" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <StockGrid stock={filtered} onEdit={openEdit} onDelete={(item) => { setSelected(item); setDeleteOpen(true); }} />
      )}

      <StockForm isOpen={formOpen} onClose={() => setFormOpen(false)} editing={editing} onSave={handleSave} addToast={addToast} />
      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Supprimer le produit" message={`Voulez-vous vraiment supprimer ${selected?.name} du stock ?`} />
    </div>
  );
}

function ActionBtn({ icon: Icon, onClick, hoverColor }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center rounded-lg transition-all cursor-pointer" style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#64748B' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = `${hoverColor}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
      aria-label="Action"><Icon size={11} /></button>
  );
}
