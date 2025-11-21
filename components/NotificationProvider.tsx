import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  read?: boolean;
  timestamp?: Date;
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  history: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<Notification[]>([]);

  const addNotification = useCallback(({ type, title, message, duration = 5000 }: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      read: false,
      timestamp: new Date()
    };

    // Add to active toasts
    setActiveNotifications((prev) => [...prev, newNotification]);
    
    // Add to history
    setHistory((prev) => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setHistory(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setHistory(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const unreadCount = history.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      addNotification, 
      removeNotification, 
      history, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      clearHistory 
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {activeNotifications.map((notification) => (
          <Toast key={notification.id} notification={notification} onDismiss={removeNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const Toast: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    warning: <AlertCircle className="text-orange-400" size={20} />,
    info: <Info className="text-sky-400" size={20} />
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/90',
    error: 'border-red-500/30 bg-red-950/90',
    warning: 'border-orange-500/30 bg-orange-950/90',
    info: 'border-sky-500/30 bg-slate-900/90'
  };

  return (
    <div 
      className={`
        pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl shadow-black/80
        transition-all duration-300 ease-in-out transform
        ${borderColors[notification.type]}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100 animate-in slide-in-from-right-5'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white">{notification.title}</h4>
        <p className="text-sm text-slate-300 mt-1 leading-relaxed">{notification.message}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="flex-shrink-0 text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
};