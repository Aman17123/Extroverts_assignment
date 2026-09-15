import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="alert" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
          {toast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
          {toast.type === 'success' && <CheckCircle size={18} color="#34D399" />}
          {(!toast.type || toast.type === 'info') && <Info size={18} color="#A855F7" />}
          <div style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</div>
          <button 
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 2 }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
