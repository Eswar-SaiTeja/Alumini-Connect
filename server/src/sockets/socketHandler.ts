import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;
const userSocketMap = new Map<string, string[]>(); // userId -> socketIds[]

export const initSocket = (server: HTTPServer, clientUrl: string) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join_user', (userId: string) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
      const sockets = userSocketMap.get(userId) || [];
      userSocketMap.set(userId, [...sockets, socket.id]);
      console.log(`[Socket] User ${userId} joined room user:${userId}`);
    });

    socket.on('leave_user', (userId: string) => {
      if (!userId) return;
      socket.leave(`user:${userId}`);
      const sockets = userSocketMap.get(userId) || [];
      userSocketMap.set(userId, sockets.filter((id) => id !== socket.id));
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      for (const [userId, sockets] of userSocketMap.entries()) {
        const filtered = sockets.filter((id) => id !== socket.id);
        if (filtered.length === 0) {
          userSocketMap.delete(userId);
        } else {
          userSocketMap.set(userId, filtered);
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const broadcastEvent = (eventType: string, payload: any) => {
  if (io) {
    io.emit('REALTIME_UPDATE', {
      type: eventType,
      payload,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Socket Broadcast] Emitted event: ${eventType}`);
  }
};

export const sendToUser = (userId: string, eventType: string, payload: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(eventType, {
      payload,
      timestamp: new Date().toISOString(),
    });
  }
};
