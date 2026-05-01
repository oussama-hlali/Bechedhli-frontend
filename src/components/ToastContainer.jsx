export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={t.exiting ? 'animate-toast-out' : 'animate-toast-in'}
          style={{
            background: t.type === 'success'
              ? 'rgba(16,185,129,0.15)'
              : t.type === 'error'
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(59,130,246,0.15)',
            border: `1px solid ${
              t.type === 'success'
                ? 'rgba(16,185,129,0.3)'
                : t.type === 'error'
                ? 'rgba(239,68,68,0.3)'
                : 'rgba(59,130,246,0.3)'
            }`,
            borderRadius: 12, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            backdropFilter: 'blur(12px)', minWidth: 300,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <i
            className={`fa-solid ${
              t.type === 'success'
                ? 'fa-check-circle'
                : t.type === 'error'
                ? 'fa-exclamation-circle'
                : 'fa-info-circle'
            }`}
            style={{
              color: t.type === 'success' ? '#10B981' : t.type === 'error' ? '#EF4444' : '#3B82F6',
              fontSize: 16,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
