import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const socket: Socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (userId: string, role: string) => {
  socket.auth = { userId, role };
  socket.connect();
  
  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket.emit('join', { userId, role });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
