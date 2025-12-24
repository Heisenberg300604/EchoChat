// Socket.IO setup (ESM)
import { Server } from "socket.io";
import socketAuth from "./auth.js";
import registerEvents from "./events.js";

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
  });

  // Attach auth middleware to validate JWT and set socket.userId
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("Connected:", socket.userId);
    registerEvents(io, socket);
  });
}

export default initSocket;