import { messageModel } from "../models/message.model.js";

class ChatMongo{
  
  async createMsg(msg){
    const result = await messageModel.create(msg);
    return result;
  }

  async getMsgs(){
    const result = await messageModel.find();
    return result;
  }

}
export default ChatMongo;