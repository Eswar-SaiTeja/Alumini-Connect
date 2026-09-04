import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { RealtimeUpdatePayload } from '../types';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastEvent: RealtimeUpdatePayload | null;
  subscribe: (eventType: string, callback: (payload: any) => void) => () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<RealtimeUpdatePayload | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { user } = useAuth();

  const [subscribers, setSubscribers] = useState<{ [event: string]: ((payload: any) => void)[] }>({});

  useEffect(() => {
    // Determine socket endpoint
    const socketUrl =
      import.meta.env.VITE_API_URL ||
      (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
    const socketClient = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketClient.on('connect', () => {
      console.log('⚡ [Real-time] Connected to GCRJY WebSocket server:', socketClient.id);
      setIsConnected(true);

      if (user?.id) {
        socketClient.emit('join_user', user.id);
      }
    });

    socketClient.on('disconnect', () => {
      console.log('⚡ [Real-time] Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socketClient.on('REALTIME_UPDATE', (data: RealtimeUpdatePayload) => {
      console.log('⚡ [Real-time Event Received]:', data.type, data.payload);
      setLastEvent(data);

      // Trigger non-intrusive live toast notification for public user feedback
      let toastTitle = 'Real-time Update';
      let toastMessage = 'New updates are available.';
      let toastType: 'info' | 'success' | 'warning' = 'info';

      if (data.type === 'NEWS_PUBLISHED') {
        toastTitle = '📢 New Announcement';
        toastMessage = data.payload.title || 'A new announcement has been published.';
        toastType = 'info';
      } else if (data.type === 'EVENT_CREATED') {
        toastTitle = '🗓️ New Event Announced';
        toastMessage = data.payload.title || 'A new alumni event is open for registrations.';
        toastType = 'success';
      } else if (data.type === 'EVENT_REGISTERED') {
        toastTitle = '🎟️ Event Registration';
        toastMessage = `Someone registered for an event! (Ticket: ${data.payload.ticketNumber})`;
        toastType = 'success';
      } else if (data.type === 'SETTINGS_CHANGED') {
        toastTitle = '🎨 Branding Updated';
        toastMessage = 'College branding and theme settings updated by administrator.';
        toastType = 'info';
      } else if (data.type === 'STORY_PUBLISHED') {
        toastTitle = '🌟 New Success Story';
        toastMessage = `New story published: ${data.payload.achievementTitle || data.payload.alumniName}`;
        toastType = 'info';
      } else if (data.type === 'ALUMNI_VERIFIED') {
        toastTitle = '🎓 Alumni Verified';
        toastMessage = `${data.payload.name} has been verified by the alumni office.`;
        toastType = 'success';
      }

      // Add toast
      const newToast: ToastMessage = {
        id: Math.random().toString(36).substring(2, 9),
        title: toastTitle,
        message: toastMessage,
        type: toastType,
        timestamp: new Date().toLocaleTimeString(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, []);

  // Update room when user changes
  useEffect(() => {
    if (socket && isConnected) {
      if (user?.id) {
        socket.emit('join_user', user.id);
      }
    }
  }, [user, socket, isConnected]);

  // Subscribe mechanism for components to listen to real-time events
  const subscribe = useCallback((eventType: string, callback: (payload: any) => void) => {
    setSubscribers((prev) => {
      const existing = prev[eventType] || [];
      return { ...prev, [eventType]: [...existing, callback] };
    });

    return () => {
      setSubscribers((prev) => {
        const existing = prev[eventType] || [];
        return {
          ...prev,
          [eventType]: existing.filter((cb) => cb !== callback),
        };
      });
    };
  }, []);

  // When lastEvent changes, notify subscribers
  useEffect(() => {
    if (lastEvent) {
      const callbacks = subscribers[lastEvent.type] || [];
      callbacks.forEach((cb) => cb(lastEvent.payload));

      // Also trigger wildcards
      const wildcardCallbacks = subscribers['*'] || [];
      wildcardCallbacks.forEach((cb) => cb(lastEvent));
    }
  }, [lastEvent, subscribers]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastEvent,
        subscribe,
        toasts,
        removeToast,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
