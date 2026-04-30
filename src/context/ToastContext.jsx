import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-6 right-6 z-[2000] flex flex-col gap-2.5">
        {toasts.map(t => {
          const colors = {
            success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: 'CheckCircle', iconColor: '#10B981' },
            error:   { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: 'AlertCircle', iconColor: '#EF4444' },
            info:    { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: 'Info', iconColor: '#3B82F6' },
          };
          const c = colors[t.type] || colors.info;
          const Icon = { CheckCircle: () => <span style={{ color: c.iconColor }}>✓</span>, AlertCircle: () => <span style={{ color: c.iconColor }}>!</span>, Info: () => <span style={{ color: c.iconColor }}>i</span> }[c.icon];
          return (
            <div key={t.id} className={t.exiting ? 'animate-toast-out' : 'animate-toast-in'}
              style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(12px)', minWidth: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <Icon />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}