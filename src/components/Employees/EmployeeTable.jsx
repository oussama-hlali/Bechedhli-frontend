import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { DEPARTMENTS, ROLES, getAvatarColor, getInitials, formatDZD } from '../../data/employees';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import ConfirmModal from '../UI/ConfirmModal';
import EmployeeDetail from './EmployeeDetail';
import EmployeeForm from './EmployeeForm';
import { useToast } from '../../context/ToastContext';

export default function EmployeeTable({ employees, setEmployees }) {
  const addToast = useToast();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.role.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== 'all' && e.dept !== deptFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  }), [employees, search, deptFilter, statusFilter]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setFormOpen(true); };
  const openDetail = (emp) => { setSelected(emp); setDetailOpen(true); };

  const handleSave = (data) => {
    if (editing) {
      setEmployees(prev => prev.map(e => e.id === editing.id ? { ...e, ...data } : e));
      addToast(`${data.name} mis à jour avec succès`);
    } else {
      setEmployees(prev => [...prev, { ...data, id: Date.now() }]);
      addToast(`${data.name} ajouté avec succès`);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== selected.id));
    addToast(`${selected.name} supprimé`);
    setDeleteOpen(false); setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Gestion des Employés</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>{employees.length} employés — {employees.filter(e => e.status === 'active').length} actifs</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(249,115,22,0.35)]" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
          <Plus size={16} /> Nouvel Employé
        </button>
      </div>

      {/* Filtres */}
      <div className="rounded-2xl p-4 mb-5 flex gap-3 flex-wrap items-center" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
          <input className="input-field w-full pl-10" placeholder="Rechercher par nom ou rôle..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', color: '#F1F5F9', fontSize: 14 }} />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field" style={{ width: 'auto', minWidth: 170, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', color: '#F1F5F9', fontSize: 14, cursor: 'pointer' }}>
          <option value="all">Tous les départements</option>
          {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#131B2E' }}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ width: 'auto', minWidth: 140, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', color: '#F1F5F9', fontSize: 14, cursor: 'pointer' }}>
          <option value="all">Tous les statuts</option>
          <option value="active" style={{ background: '#131B2E' }}>Actif</option>
          <option value="inactive" style={{ background: '#131B2E' }}>Inactif</option>
          <option value="leave" style={{ background: '#131B2E' }}>En congé</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Employé', 'Rôle', 'Département', 'Statut', 'Salaire', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b" style={{ color: '#64748B', fontFamily: 'Space Grotesk', borderColor: 'rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10" style={{ color: '#64748B' }}>Aucun employé trouvé</td></tr>
              ) : filtered.map((emp, i) => (
                <tr key={emp.id} onClick={() => openDetail(emp)} className="cursor-pointer transition-colors hover:bg-orange-500/[0.04]" style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}>
                  <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex items-center justify-center rounded-[10px] font-display font-bold text-[13px]" style={{ width: 38, height: 38, background: `${getAvatarColor(emp.id)}20`, color: getAvatarColor(emp.id) }}>{getInitials(emp.name)}</div>
                      <div>
                        <p className="font-semibold text-sm">{emp.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] border-b" style={{ color: '#94A3B8', borderColor: 'rgba(255,255,255,0.03)' }}>{emp.role}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b" style={{ color: '#94A3B8', borderColor: 'rgba(255,255,255,0.03)' }}>{emp.dept}</td>
                  <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}><Badge status={emp.status} /></td>
                  <td className="px-4 py-3.5 text-[13px] font-display font-semibold border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>{formatDZD(emp.salary)}</td>
                  <td className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                      <ActionBtn icon={Pencil} onClick={() => openEdit(emp)} hoverColor="#3B82F6" />
                      <ActionBtn icon={Trash2} onClick={() => { setSelected(emp); setDeleteOpen(true); }} hoverColor="#EF4444" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeForm isOpen={formOpen} onClose={() => setFormOpen(false)} editing={editing} onSave={handleSave} addToast={addToast} />
      {selected && <EmployeeDetail isOpen={detailOpen} onClose={() => setDetailOpen(false)} employee={selected} onEdit={() => { setDetailOpen(false); openEdit(selected); }} onDelete={() => { setDetailOpen(false); setDeleteOpen(true); }} />}
      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Supprimer l'employé" message={`Voulez-vous vraiment supprimer ${selected?.name} ? Cette action est irréversible.`} />
    </div>
  );
}

function ActionBtn({ icon: Icon, onClick, hoverColor }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center rounded-lg transition-all cursor-pointer" style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: '#64748B' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = `${hoverColor}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
      aria-label="Action">
      <Icon size={11} />
    </button>
  );
}