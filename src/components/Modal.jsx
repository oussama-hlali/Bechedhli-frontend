export function Modal({ isOpen, onClose, title, children, width }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: width || 560 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 18, padding: 4 }}
            aria-label="Fermer"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '20px 28px 28px' }}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 28, textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(239,68,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <i className="fa-solid fa-trash" style={{ color: '#EF4444', fontSize: 20 }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-danger" onClick={onConfirm} style={{ fontWeight: 600 }}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
