import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";

const chatsRouter = Router();
const {
  sendMsg,
  readMsgs
} = new ChatController();

chatsRouter.post("/api/chat", sendMsg);
chatsRouter.get("/api/chat", readMsgs);

export default chatsRouter;