import { useState, useMemo } from 'react';
import { Modal, ConfirmModal } from '../components/Modal';
import { CATEGORIES, LOCATIONS, getStockStatus, formatDA, CAT_ICONS, CAT_COLORS } from '../data';

export default function StockView({ stock, setStock, addToast }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [form, setForm] = useState({ name: '', category: '', qty: '', minQty: '', price: '', supplier: '', location: '' });

  const filtered = useMemo(() => stock.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.supplier.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && item.category !== catFilter) return false;
    const st = getStockStatus(item);
    if (statusFilter === 'alert' && st !== 'low' && st !== 'empty') return false;
    if (statusFilter === 'ok' && st !== 'normal' && st !== 'warning') return false;
    return true;
  }), [stock, search, catFilter, statusFilter]);

  const lowStockItems = useMemo(() => stock.filter(i => ['low', 'empty'].includes(getStockStatus(i))), [stock]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: '', qty: '', minQty: '', price: '', supplier: '', location: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category, qty: String(item.qty), minQty: String(item.minQty), price: String(item.price), supplier: item.supplier, location: item.location });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.qty || !form.price) { addToast('Veuillez remplir tous les champs obligatoires', 'error'); return; }
    if (editing) {
      setStock(prev => prev.map(i => i.id === editing.id ? { ...i, ...form, qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price) } : i));
      addToast(`${form.name} mis à jour`, 'success');
    } else {
      setStock(prev => [...prev, { ...form, id: Date.now(), qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price) }]);
      addToast(`${form.name} ajouté au stock`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setStock(prev => prev.filter(i => i.id !== selected.id));
    addToast(`${selected.name} supprimé du stock`, 'success');
    setDeleteOpen(false);
    setSelected(null);
  };

  const stockBadge = (item) => {
    const s = getStockStatus(item);
    if (s === 'empty') return <span className="badge badge-low"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Rupture</span>;
    if (s === 'low') return <span className="badge badge-low"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Stock bas</span>;
    if (s === 'warning') return <span className="badge badge-warning"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Attention</span>;
    return <span className="badge badge-normal"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Normal</span>;
  };

  const progressColor = (item) => {
    const s = getStockStatus(item);
    if (s === 'empty' || s === 'low') return '#EF4444';
    if (s === 'warning') return '#F59E0B';
    return '#10B981';
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Gestion du Stock</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>{stock.length} produits — {lowStockItems.length} alertes</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><i className="fa-solid fa-plus" />Nouveau Produit</button>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="animate-slide-down" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#EF4444', fontSize: 16 }} />
          <span style={{ fontSize: 13, flex: 1 }}>
            <strong style={{ color: '#EF4444' }}>{lowStockItems.length} produit(s)</strong> nécessitent un réapprovisionnement immédiat :
            {lowStockItems.slice(0, 3).map((item, i) => (
              <span key={item.id} style={{ color: '#94A3B8' }}>{i > 0 ? ', ' : ' '}{item.name} ({item.qty}/{item.minQty})</span>
            ))}
            {lowStockItems.length > 3 && <span style={{ color: '#94A3B8' }}> et {lowStockItems.length - 3} autres...</span>}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} />
          <input className="input-field" placeholder="Rechercher par nom ou fournisseur..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: 150 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field" style={{ width: 'auto', minWidth: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="ok">Normal / Attention</option>
          <option value="alert">Stock bas / Rupture</option>
        </select>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
          {['table', 'grid'].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{
                padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: viewMode === mode ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: viewMode === mode ? '#F97316' : 'var(--fg-muted)', fontSize: 13,
              }}>
              <i className={`fa-solid ${mode === 'table' ? 'fa-list' : 'fa-grip'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produit</th><th>Catégorie</th><th>Quantité</th><th>Niveau</th>
                  <th>Prix Unitaire</th><th>Valeur Totale</th><th>Fournisseur</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucun produit trouvé</td></tr>
                ) : filtered.map((item, i) => {
                  const color = CAT_COLORS[item.category] || '#64748B';
                  return (
                    <tr key={item.id} style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={`fa-solid ${CAT_ICONS[item.category] || 'fa-box'}`} style={{ color, fontSize: 14 }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</p>
                            <p style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{item.location}</p>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontSize: 12, color, fontWeight: 600 }}>{item.category}</span></td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15 }}>{item.qty}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 100 }}>
                          {stockBadge(item)}
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, (item.qty / (item.minQty * 3)) * 100)}%`, background: progressColor(item) }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'Space Grotesk', fontSize: 13 }}>{formatDA(item.price)}</td>
                      <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#F97316' }}>{formatDA(item.qty * item.price)}</td>
                      <td style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{item.supplier}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ActionBtn type="edit" onClick={() => openEdit(item)} label="Modifier" />
                          <ActionBtn type="delete" onClick={() => { setSelected(item); setDeleteOpen(true); }} label="Supprimer" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--fg-muted)', gridColumn: '1/-1' }}>Aucun produit trouvé</div>
          ) : filtered.map((item, i) => {
            const color = CAT_COLORS[item.category] || '#64748B';
            return (
              <div key={item.id} className="glass-card" style={{ padding: 20, animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`fa-solid ${CAT_ICONS[item.category] || 'fa-box'}`} style={{ color, fontSize: 18 }} />
                  </div>
                  {stockBadge(item)}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.4 }}>{item.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 14 }}>{item.supplier} — {item.location}</p>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Stock</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk', color: progressColor(item) }}>{item.qty} / min {item.minQty}</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, (item.qty / (item.minQty * 3)) * 100)}%`, background: `linear-gradient(90deg, ${progressColor(item)}, ${progressColor(item)}88)` }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Space Grotesk', color: '#F97316' }}>{formatDA(item.price)}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ActionBtn type="edit" onClick={() => openEdit(item)} label="Modifier" small />
                    <ActionBtn type="delete" onClick={() => { setSelected(item); setDeleteOpen(true); }} label="Supprimer" small />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le Produit' : 'Nouveau Produit'} width={540}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Désignation *</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Panneau Solaire 400W" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Catégorie *</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Sélectionner...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Emplacement</label>
              <select className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                <option value="">Sélectionner...</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Quantité *</label>
              <input className="input-field" type="number" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Stock minimum</label>
              <input className="input-field" type="number" min="0" value={form.minQty} onChange={e => setForm({ ...form, minQty: e.target.value })} placeholder="10" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Prix unitaire (TND) *</label>
              <input className="input-field" type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Fournisseur</label>
              <input className="input-field" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Ex: Jinko Solar" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer ${selected?.name} du stock ? Cette action est irréversible.`} />
    </div>
  );
}

function ActionBtn({ type, onClick, label, small }) {
  const [hovered, setHovered] = useState(false);
  const size = small ? 30 : 32;
  const colors = { edit: { border: '#3B82F6', bg: 'rgba(59,130,246,0.08)' }, delete: { border: '#EF4444', bg: 'rgba(239,68,68,0.08)' } };
  const icons = { edit: 'fa-pen', delete: 'fa-trash' };
  return (
    <button onClick={onClick} aria-label={label}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: size, height: size, borderRadius: 8,
        border: `1px solid ${hovered ? colors[type].border : 'var(--border)'}`,
        background: hovered ? colors[type].bg : 'transparent',
        color: hovered ? colors[type].border : 'var(--fg-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}>
      <i className={`fa-solid ${icons[type]}`} style={{ fontSize: 11 }} />
    </button>
  );
}
