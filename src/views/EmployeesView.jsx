import { useState, useMemo } from 'react';
import { Modal, ConfirmModal } from '../components/Modal';
import { DEPARTMENTS, ROLES, getAvatarColor, getInitials, formatDA } from '../data';

export default function EmployeesView({ employees, setEmployees, addToast }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', dept: '', status: 'active', phone: '', email: '', salary: '', joinDate: '' });

  const filtered = useMemo(() => employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.role.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== 'all' && e.dept !== deptFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  }), [employees, search, deptFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', role: '', dept: '', status: 'active', phone: '', email: '', salary: '', joinDate: new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({ name: emp.name, role: emp.role, dept: emp.dept, status: emp.status, phone: emp.phone, email: emp.email, salary: String(emp.salary), joinDate: emp.joinDate });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role || !form.dept) { addToast('Veuillez remplir tous les champs obligatoires', 'error'); return; }
    if (editing) {
      setEmployees(prev => prev.map(e => e.id === editing.id ? { ...e, ...form, salary: Number(form.salary) } : e));
      addToast(`${form.name} mis à jour avec succès`, 'success');
    } else {
      setEmployees(prev => [...prev, { ...form, id: Date.now(), salary: Number(form.salary) }]);
      addToast(`${form.name} ajouté avec succès`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    setEmployees(prev => prev.filter(e => e.id !== selected.id));
    addToast(`${selected.name} supprimé`, 'success');
    setDeleteOpen(false);
    setSelected(null);
  };

  const statusBadge = (s) => {
    if (s === 'active') return <span className="badge badge-active"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Actif</span>;
    if (s === 'inactive') return <span className="badge badge-inactive"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />Inactif</span>;
    return <span className="badge badge-leave"><i className="fa-solid fa-circle" style={{ fontSize: 5 }} />En congé</span>;
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Gestion des Employés</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>{employees.length} employés — {employees.filter(e => e.status === 'active').length} actifs</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><i className="fa-solid fa-plus" />Nouvel Employé</button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} />
          <input className="input-field" placeholder="Rechercher par nom ou rôle..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: 170 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="all">Tous les départements</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="input-field" style={{ width: 'auto', minWidth: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="leave">En congé</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th><th>Rôle</th><th>Département</th><th>Statut</th><th>Salaire</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucun employé trouvé</td></tr>
              ) : filtered.map((emp, i) => (
                <tr key={emp.id} onClick={() => { setSelected(emp); setDetailOpen(true); }} style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ background: `${getAvatarColor(emp.id)}20`, color: getAvatarColor(emp.id) }}>{getInitials(emp.name)}</div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--fg-muted)', fontSize: 13 }}>{emp.role}</td>
                  <td style={{ fontSize: 13, color: '#94A3B8' }}>{emp.dept}</td>
                  <td>{statusBadge(emp.status)}</td>
                  <td style={{ fontWeight: 600, fontFamily: 'Space Grotesk', fontSize: 13 }}>{formatDA(emp.salary)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      <ActionBtn type="edit" onClick={() => openEdit(emp)} label="Modifier" />
                      <ActionBtn type="delete" onClick={() => { setSelected(emp); setDeleteOpen(true); }} label="Supprimer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'Employé" : 'Nouvel Employé'} width={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nom complet *</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Ahmed Benali" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Rôle *</label>
              <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="">Sélectionner...</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Département *</label>
              <select className="input-field" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                <option value="">Sélectionner...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Téléphone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+216 555 000 000" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="nom@bechedhli.tn" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Salaire (TND)</label>
              <input className="input-field" type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="80000" />
            </div>
            <div>
              <label style={labelStyle}>Statut</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="leave">En congé</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Date d'embauche</label>
            <input className="input-field" type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Fiche Employé" width={480}>
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 14 }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, background: `${getAvatarColor(selected.id)}20`, color: getAvatarColor(selected.id) }}>{getInitials(selected.name)}</div>
              <div>
                <h4 style={{ fontSize: 17, fontWeight: 700 }}>{selected.name}</h4>
                <p style={{ color: 'var(--fg-muted)', fontSize: 13 }}>{selected.role}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>{statusBadge(selected.status)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ["Département", selected.dept, 'fa-building'],
                ["Téléphone", selected.phone, 'fa-phone'],
                ["Email", selected.email, 'fa-envelope'],
                ["Salaire", formatDA(selected.salary), 'fa-money-bill'],
                ["Date d'embauche", new Date(selected.joinDate).toLocaleDateString('fr-FR'), 'fa-calendar'],
                ["Ancienneté", `${Math.floor((Date.now() - new Date(selected.joinDate).getTime()) / (1000*60*60*24*365))} ans`, 'fa-clock'],
              ].map(([label, val, icon], i) => (
                <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                  <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={`fa-solid ${icon}`} style={{ fontSize: 10 }} />{label}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => { setDetailOpen(false); openEdit(selected); }}><i className="fa-solid fa-pen" />Modifier</button>
              <button className="btn-danger" onClick={() => { setDetailOpen(false); setDeleteOpen(true); }}><i className="fa-solid fa-trash" />Supprimer</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Supprimer l'employé"
        message={`Voulez-vous vraiment supprimer ${selected?.name} ? Cette action est irréversible.`} />
    </div>
  );
}

function ActionBtn({ type, onClick, label }) {
  const [hovered, setHovered] = useState(false);
  const colors = { edit: { border: '#3B82F6', bg: 'rgba(59,130,246,0.08)' }, delete: { border: '#EF4444', bg: 'rgba(239,68,68,0.08)' } };
  const icons = { edit: 'fa-pen', delete: 'fa-trash' };
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: `1px solid ${hovered ? colors[type].border : 'var(--border)'}`,
        background: hovered ? colors[type].bg : 'transparent',
        color: hovered ? colors[type].border : 'var(--fg-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}
    >
      <i className={`fa-solid ${icons[type]}`} style={{ fontSize: 11 }} />
    </button>
  );
}
