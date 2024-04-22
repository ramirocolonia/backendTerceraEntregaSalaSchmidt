import mongoose from "mongoose";

import config from "./config.js";

class MongoConnection{
  static #instance;

  constructor(){
    mongoose.connect(config.mongoURL);
  }

  static getInstance(){
    if(this.#instance){
      console.log("ya conectado a mongo");
    }else{
      this.#instance = new MongoConnection();
      console.log("Conectado a mongo");
    }
    return this.#instance;
  }
}

export default MongoConnection;