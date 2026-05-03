export function Modal({ isOpen, onClose, title, children, width }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: width || 560 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 18, padding: 4 }} aria-label="Fermer">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '20px 28px 28px' }}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmColor }) {
  if (!isOpen) return null;
  const color = confirmColor || '#EF4444';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-solid fa-exclamation-triangle" style={{ color, fontSize: 20 }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button onClick={onConfirm} style={{ background: `${color}18`, border: `1px solid ${color}40`, color, fontWeight: 600, borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 14, transition: 'all 0.2s' }}>
              {confirmLabel || 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActionBtn({ icon, onClick, hoverColor, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = `${hoverColor}14`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.background = 'transparent'; }}
    >
      <i className={`fa-solid ${icon}`} style={{ fontSize: 11 }} />
    </button>
  );
}
