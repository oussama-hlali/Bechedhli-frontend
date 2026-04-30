import { useState, useEffect } from 'react';
import { CATEGORIES, LOCATIONS } from '../../data/stock';
import Modal from '../UI/Modal';

const emptyForm = { name: '', category: '', qty: '', minQty: '', price: '', supplier: '', location: '' };

export default function StockForm({ isOpen, onClose, editing, onSave, addToast }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editing) setForm({ name: editing.name, category: editing.category, qty: String(editing.qty), minQty: String(editing.minQty), price: String(editing.price), supplier: editing.supplier, location: editing.location });
    else setForm(emptyForm);
  }, [editing, isOpen]);

  const handleSave = () => {
    if (!form.name || !form.category || !form.qty || !form.price) { addToast('Veuillez remplir tous les champs obligatoires', 'error'); return; }
    onSave({ ...form, qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price) });
  };

  const fs = "w-full rounded-[10px] px-3.5 py-2.5 text-sm outline-none transition-all";
  const fst = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' };
  const ls = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const lst = { color: '#64748B' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editing ? 'Modifier le Produit' : 'Nouveau Produit'} width={540}>
      <div className="flex flex-col gap-4">
        <div><label className={ls} style={lst}>Désignation *</label><input className={`${fs} input-field`} style={fst} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Panneau Solaire 400W" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={ls} style={lst}>Catégorie *</label>
            <select className={`${fs} input-field`} style={{ ...fst, cursor: 'pointer' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Sélectionner...</option>{CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#131B2E' }}>{c}</option>)}
            </select></div>
          <div><label className={ls} style={lst}>Emplacement</label>
            <select className={`${fs} input-field`} style={{ ...fst, cursor: 'pointer' }} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
              <option value="">Sélectionner...</option>{LOCATIONS.map(l => <option key={l} value={l} style={{ background: '#131B2E' }}>{l}</option>)}
            </select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={ls} style={lst}>Quantité *</label><input className={`${fs} input-field`} style={fst} type="number" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="0" /></div>
          <div><label className={ls} style={lst}>Stock minimum</label><input className={`${fs} input-field`} style={fst} type="number" min="0" value={form.minQty} onChange={e => setForm({ ...form, minQty: e.target.value })} placeholder="10" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={ls} style={lst}>Prix unitaire (DA) *</label><input className={`${fs} input-field`} style={fst} type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" /></div>
          <div><label className={ls} style={lst}>Fournisseur</label><input className={`${fs} input-field`} style={fst} value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Ex: Jinko Solar" /></div>
        </div>
        <div className="flex gap-3 justify-end mt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>Annuler</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
        </div>
      </div>
    </Modal>
  );
}