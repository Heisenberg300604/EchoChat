// All socket events handling
import prisma from "../config/prisma.js";

// Track online users as a simple in-memory map: userId -> socketId
const onlineUsers = new Map();

export default (io, socket) => {
	// Mark user online
	onlineUsers.set(socket.userId, socket.id);
	io.emit("online-users", Array.from(onlineUsers.keys()));

	// Handle sending a message
	socket.on("send-message", async ({ to, content, clientId }, callback) => {
		if (!to || !content || !content.trim()) {
			if (typeof callback === "function") callback({ error: "Invalid message" });
			return;
		}

		try {
			const message = await prisma.message.create({
				data: {
					senderId: socket.userId,
					receiverId: to,
					content: content.trim(),
				},
			});

			const receiverSocketId = onlineUsers.get(to);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("receive-message", message);
			}

			// Acknowledge back to the sender with the persisted message so it
			// can replace the optimistic placeholder (matched via clientId).
			if (typeof callback === "function") {
				callback({ message, clientId });
			}
		} catch (err) {
			console.error("send-message error:", err);
			if (typeof callback === "function") callback({ error: "Failed to send message" });
		}
	});

	// Typing indicator
	socket.on("typing", ({ to }) => {
		if (!to) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("typing", { from: socket.userId });
		}
	});

	socket.on("stop-typing", ({ to }) => {
		if (!to) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("stop-typing", { from: socket.userId });
		}
	});

	// WebRTC call signaling
	socket.on("call:initiate", ({ to, from, offer }) => {
		if (!to || !offer) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call:incoming", { from, offer });
		}
	});

	socket.on("call:answer", ({ to, answer }) => {
		if (!to || !answer) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call:answered", { answer });
		}
	});

	socket.on("call:ice-candidate", ({ to, candidate }) => {
		if (!to || !candidate) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call:ice-candidate", { candidate });
		}
	});

	socket.on("call:end", ({ to }) => {
		if (!to) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call:ended");
		}
	});

	socket.on("call:reject", ({ to }) => {
		if (!to) return;
		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call:rejected");
		}
	});

	// Handle disconnects
	socket.on("disconnect", () => {
		onlineUsers.delete(socket.userId);
		io.emit("online-users", Array.from(onlineUsers.keys()));
	});
};