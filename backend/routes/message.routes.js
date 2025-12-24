import express from "express";
import { getMessages } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getMessages);

export default router;
