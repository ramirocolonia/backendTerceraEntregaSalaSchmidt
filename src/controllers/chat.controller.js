import { chatService } from "../repositories/index.js";

class ChatController{
  
  sendMsg = async (req, res)=>{
    try{
      const { user, message } = req.body;
      const newMsg = {
        user,
        message
      }
      if (Object.values(newMsg).every((value) => String(value).trim() !== "" && value !== undefined)){
        if (await chatService.createMsg(newMsg)) {
          res.send({ status: "success", payload: newMsg });
        } else {
          res.send({ status: "error", message: "Error al enviar mensaje" });
        }
      } else {
        res.send({ status: "error", message: "Faltan campos obligatorios" });
      }
    } catch (error) {
      res.send({status: "error", message: "Error en ejecución, " + error});    
    }
  };

  readMsgs = async(req,res) =>{
    try {
      const messages = await chatService.getMsgs();
      res.send({ status: "success", payload: messages });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };
  
}
export default ChatController;