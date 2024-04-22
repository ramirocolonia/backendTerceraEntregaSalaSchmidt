import { userModel } from "../models/user.model.js";

class UserMongo{

  async createUser(user){
    const result = await userModel.create(user);
    return result;
  }

  async existEmail(uEmail) {
    if (await userModel.findOne({ email: uEmail })) {
      return true;
    }
    return false;
  }

  async findOneUser(uEmail){
    const result = await userModel.findOne({ email: uEmail });
    return result;
  }
  
}

export default UserMongo;