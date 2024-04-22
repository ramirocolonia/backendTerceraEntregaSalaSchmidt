export default class CartRepository{
  constructor(dao){
    this.dao = dao;
  }

  createCart = async() =>{
    const result = await this.dao.createCart({})
    return result;
  }

  findOneCart = async(cId) =>{
    const result = await this.dao.findOneCart(cId);
    return result;
  }

  updateCart = async(cart) =>{
    const result = await this.dao.updateCart(cart);
    return result;
  }
}