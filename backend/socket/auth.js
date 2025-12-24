// Socket auth middleware
import jwt from "jsonwebtoken";

export default (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId; // token payload uses userId
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
