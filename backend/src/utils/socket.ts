import { Server as SocketServer } from 'socket.io';

let io: SocketServer;

export const initSocket = (server: any): SocketServer => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Client registers with their user ID to receive targeted events
    socket.on('join', ({ userId, shopId }: { userId?: string; shopId?: string }) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
      }
      if (shopId) {
        socket.join(`shop_${shopId}`);
        console.log(`Shop owner ${shopId} joined room shop_${shopId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};
