import { env } from './config/env.js';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket/index.js';
import app from './app.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
