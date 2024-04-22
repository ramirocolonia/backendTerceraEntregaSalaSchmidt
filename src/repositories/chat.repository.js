export default class ChatRepository{
  constructor(dao){
    this.dao = dao;
  }

  createMsg = async(msg) =>{
    const result = await this.dao.createMsg(msg);
    return result;
  }

  getMsgs = async() =>{
    const result = await this.dao.getMsgs();
    return result;
  }

}