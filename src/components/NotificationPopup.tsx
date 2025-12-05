// Component - Notification Popup System
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationPopupProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, onDismiss]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-emerald-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
        return 'text-blue-600';
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 space-y-3 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`${getColors(notification.type)} border rounded-xl p-4 shadow-xl backdrop-blur-sm flex items-start gap-3`}
          >
            <div className={getIconColor(notification.type)}>
              {getIcon(notification.type)}
            </div>
            <p className="flex-1 text-sm pr-6">{notification.message}</p>
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36);
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    addNotification('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    addNotification('error', message, duration);
  };

  const showWarning = (message: string, duration?: number) => {
    addNotification('warning', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    addNotification('info', message, duration);
  };

  return {
    notifications,
    dismissNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
