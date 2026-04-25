function NotificationToast({ toasts }) {
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast show align-items-center text-bg-dark border-0 mb-2" role="alert">
          <div className="d-flex"><div className="toast-body">{toast.message}</div></div>
        </div>
      ))}
    </div>
  );
}

export default NotificationToast;
