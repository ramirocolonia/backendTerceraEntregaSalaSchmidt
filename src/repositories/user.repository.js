export default class UserRepository{
  constructor(dao){
    this.dao = dao;
  }

  createUser = async(user) =>{
    const result = await this.dao.createUser(user);
    return result;
  }

  existEmail = async(uEmail) =>{
    if (await this.dao.existEmail(uEmail)) {
      return true;
    }
    return false;
  }

  findOneUser = async(uEmail) =>{
    const result = await this.dao.findOneUser(uEmail);
    return result;
  }
}