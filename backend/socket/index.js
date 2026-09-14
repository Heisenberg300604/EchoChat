// Socket.IO setup (ESM)
import { Server } from "socket.io";
import socketAuth from "./auth.js";
import registerEvents from "./events.js";
import { allowedOrigins } from "../config/corsOrigins.js";

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: allowedOrigins },
  });

  // Attach auth middleware to validate JWT and set socket.userId
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("Connected:", socket.userId);
    registerEvents(io, socket);
  });
}

export default initSocket;