import { useState, useEffect } from 'react';
import { DEPARTMENTS, ROLES } from '../../data/employees';
import Modal from '../UI/Modal';

const emptyForm = { name: '', role: '', dept: '', status: 'active', phone: '', email: '', salary: '', joinDate: new Date().toISOString().split('T')[0] };

export default function EmployeeForm({ isOpen, onClose, editing, onSave, addToast }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editing) setForm({ name: editing.name, role: editing.role, dept: editing.dept, status: editing.status, phone: editing.phone, email: editing.email, salary: String(editing.salary), joinDate: editing.joinDate });
    else setForm({ ...emptyForm, joinDate: new Date().toISOString().split('T')[0] });
  }, [editing, isOpen]);

  const handleSave = () => {
    if (!form.name || !form.role || !form.dept) { addToast('Veuillez remplir tous les champs obligatoires', 'error'); return; }
    onSave({ ...form, salary: Number(form.salary) });
  };

  const fieldClass = "w-full rounded-[10px] px-3.5 py-2.5 text-sm outline-none transition-all";
  const fieldStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' };
  const labelClass = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: '#64748B' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editing ? "Modifier l'Employé" : 'Nouvel Employé'} width={520}>
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Nom complet *</label>
          <input className={`${fieldClass} input-field`} style={fieldStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Ahmed Benali" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass} style={labelStyle}>Rôle *</label>
            <select className={`${fieldClass} input-field`} style={{ ...fieldStyle, cursor: 'pointer' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="">Sélectionner...</option>{ROLES.map(r => <option key={r} value={r} style={{ background: '#131B2E' }}>{r}</option>)}
            </select></div>
          <div><label className={labelClass} style={labelStyle}>Département *</label>
            <select className={`${fieldClass} input-field`} style={{ ...fieldStyle, cursor: 'pointer' }} value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
              <option value="">Sélectionner...</option>{DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#131B2E' }}>{d}</option>)}
            </select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass} style={labelStyle}>Téléphone</label><input className={`${fieldClass} input-field`} style={fieldStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+213 555 000 000" /></div>
          <div><label className={labelClass} style={labelStyle}>Email</label><input className={`${fieldClass} input-field`} style={fieldStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="nom@bechedhli.dz" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass} style={labelStyle}>Salaire (DA)</label><input className={`${fieldClass} input-field`} style={fieldStyle} type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="80000" /></div>
          <div><label className={labelClass} style={labelStyle}>Statut</label>
            <select className={`${fieldClass} input-field`} style={{ ...fieldStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active" style={{ background: '#131B2E' }}>Actif</option>
              <option value="inactive" style={{ background: '#131B2E' }}>Inactif</option>
              <option value="leave" style={{ background: '#131B2E' }}>En congé</option>
            </select></div>
        </div>
        <div><label className={labelClass} style={labelStyle}>Date d'embauche</label><input className={`${fieldClass} input-field`} style={fieldStyle} type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} /></div>
        <div className="flex gap-3 justify-end mt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>Annuler</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
        </div>
      </div>
    </Modal>
  );
}