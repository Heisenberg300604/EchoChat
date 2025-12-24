import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import initSocket from "./socket/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket setup
initSocket(server);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

