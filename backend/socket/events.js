// All socket events handling
import prisma from "../config/prisma.js";

// Track online users as a simple in-memory map: userId -> socketId
const onlineUsers = new Map();

export default (io, socket) => {
	// Mark user online
	onlineUsers.set(socket.userId, socket.id);
	io.emit("online-users", Array.from(onlineUsers.keys()));

	// Handle sending a message
	socket.on("send-message", async ({ to, content }) => {
		if (!to || !content) return; // basic guard

		const message = await prisma.message.create({
			data: {
				senderId: socket.userId,
				receiverId: to,
				content,
			},
		});

		const receiverSocketId = onlineUsers.get(to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("receive-message", message);
		}
	});

	// Handle disconnects
	socket.on("disconnect", () => {
		onlineUsers.delete(socket.userId);
		io.emit("online-users", Array.from(onlineUsers.keys()));
	});
};