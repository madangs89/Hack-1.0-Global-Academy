import express from "express";
import {
  acceptChat,
  getAllChatsHistory,
  getFullChatById,
} from "../controllers/chats.controler.js";
import { authMiddelware } from "../middelware/authMiddelware.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:chatId", authMiddelware, getFullChatById);
chatRouter.get("/history", authMiddelware, getAllChatsHistory);
chatRouter.post("/chat", authMiddelware, acceptChat);

export default chatRouter;
