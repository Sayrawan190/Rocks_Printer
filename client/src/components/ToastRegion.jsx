import { useApp } from '../AppContext.jsx';

export default function ToastRegion() {
  const { toasts } = useApp();
  return (
    <div className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.kind}`}>{toast.message}</div>
      ))}
    </div>
  );
}
