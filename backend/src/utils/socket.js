"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);
        // Client registers with their user ID to receive targeted events
        socket.on('join', ({ userId, shopId }) => {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.IO not initialized');
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map