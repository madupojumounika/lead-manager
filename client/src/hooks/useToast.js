import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toastSuccess = useCallback(
    (message) => addToast({ message, type: 'success' }),
    [addToast]
  );

  const toastError = useCallback(
    (message) => addToast({ message, type: 'error', duration: 5000 }),
    [addToast]
  );

  const toastInfo = useCallback(
    (message) => addToast({ message, type: 'info' }),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    toastSuccess,
    toastError,
    toastInfo
  };
};

