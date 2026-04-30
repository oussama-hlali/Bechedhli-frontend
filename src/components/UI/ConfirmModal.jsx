import { Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} width={420}>
      <div className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)' }}>
          <Trash2 size={20} style={{ color: '#EF4444' }} />
        </div>
        <h3 className="font-display mb-2" style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <p className="mb-6" style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>Annuler</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>Supprimer</button>
        </div>
      </div>
    </Modal>
  );
}