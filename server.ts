import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './lib/prisma.ts';
import { verifyToken } from './lib/auth.ts';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true,
  },
});

// --- Socket.IO JWT authentication ---
// io.use((socket, next) => {
//   try {
//     const token = socket.handshake.auth.token;
//     const user = verifyToken(token);
//     if (!user) throw new Error('Authentication error');
//     socket.data.user = user;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// --- Socket.IO connection handler ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  
  socket.on("send_message", async (content: string) => {
    console.log(`Received message: ${content}`);
    io.emit("receive_message", { content });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the EchoChat API');
});

// --- Global error handlers ---
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// --- Start server ---
try {
  server.listen(3001, () => console.log('Socket.IO server running on port 3001'));
} catch (err) {
  console.error('Failed to start server:', err);
}
