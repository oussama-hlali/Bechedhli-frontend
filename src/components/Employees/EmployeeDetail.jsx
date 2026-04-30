import { Building2, Phone, Mail, DollarSign, Calendar, Clock, Pencil, Trash2 } from 'lucide-react';
import { getAvatarColor, getInitials, formatDZD } from '../../data/employees';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';

export default function EmployeeDetail({ isOpen, onClose, employee, onEdit, onDelete }) {
  if (!isOpen) return null;
  const e = employee;
  const years = Math.floor((Date.now() - new Date(e.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365));

  const fields = [
    [Building2, 'Département', e.dept],
    [Phone, 'Téléphone', e.phone],
    [Mail, 'Email', e.email],
    [DollarSign, 'Salaire', formatDZD(e.salary)],
    [Calendar, "Date d'embauche", new Date(e.joinDate).toLocaleDateString('fr-FR')],
    [Clock, 'Ancienneté', `${years} ans`],
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fiche Employé" width={480}>
      <div>
        <div className="flex items-center gap-4 mb-6 p-4 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="shrink-0 flex items-center justify-center rounded-[14px] font-display font-bold text-lg" style={{ width: 56, height: 56, background: `${getAvatarColor(e.id)}20`, color: getAvatarColor(e.id) }}>{getInitials(e.name)}</div>
          <div className="flex-1">
            <h4 className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>{e.name}</h4>
            <p className="text-sm" style={{ color: '#64748B' }}>{e.role}</p>
          </div>
          <Badge status={e.status} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(([Icon, label, val], i) => (
            <div key={i} className="p-3 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-xs mb-1 flex items-center gap-1.5" style={{ color: '#64748B' }}><Icon size={10} />{label}</p>
              <p className="font-semibold text-sm">{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}><Pencil size={13} />Modifier</button>
          <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}><Trash2 size={13} />Supprimer</button>
        </div>
      </div>
    </Modal>
  );
}