import prisma from "../config/prisma.js";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // Fetch messages between logged-in user and selected user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: currentUserId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
