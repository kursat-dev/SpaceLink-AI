import { useNotifications } from '../context/NotificationContext';
import './NotificationToast.css';

export default function NotificationToast() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'new_message': return 'chat';
      case 'new_match': return 'handshake';
      default: return 'notifications';
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.toastId} className={`notification-toast notification-toast--${toast.type}`}>
          <div className="notification-toast__icon">
            <span className="material-symbols-outlined">{getIcon(toast.type)}</span>
          </div>
          <div className="notification-toast__content">
            <strong className="notification-toast__title">{toast.title}</strong>
            <p className="notification-toast__body">{toast.body}</p>
          </div>
          <button className="notification-toast__close" onClick={() => removeToast(toast.toastId)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
