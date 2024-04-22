import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = {
  user: String,
  message: String
};

export const messageModel = mongoose.model(messagesCollection, messageSchema);