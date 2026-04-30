import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, width = 560 }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }} onClick={onClose}>
      <div className="animate-scale-in" onClick={e => e.stopPropagation()}
        style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, width: '90%', maxWidth: width, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between" style={{ padding: '24px 28px 0' }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 28px 28px' }}>{children}</div>
      </div>
    </div>
  );
}