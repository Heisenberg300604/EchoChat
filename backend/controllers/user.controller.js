import prisma from "../config/prisma.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.userId, // Exclude logged-in user
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
