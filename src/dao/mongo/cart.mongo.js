import { cartModel } from "../models/cart.model.js";

class CartMongo {

  async createCart() {
    const result = await cartModel.create({})
    return result;
  }

  async findOneCart(cId) {
    const result = await cartModel.findOne({ _id: cId });
    return result;
  }

  async updateCart (cart){
    const result = await cartModel.updateOne({ _id: cart._id}, cart);
    return result;
  }

}

export default CartMongo;
