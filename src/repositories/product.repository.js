export default class ProductRepository{
  constructor(dao){
    this.dao = dao;
  }

  getProducts = async(query, order) =>{
    const result = await this.dao.getProducts(query, order);
    return result;
  }

  findOneProduct = async(pId) =>{
    const result = await this.dao.findOneProduct(pId);
    return result;
  }

  createProduct = async(product) =>{
    const result = await this.dao.createProduct(product);
    return result;
  }

  existCode = async(pCode) =>{
    if (await this.dao.existCode(pCode)) {
      return true;
    }
    return false;
  }

  updateProduct = async(pId, newValues) =>{
    const result = await this.dao.updateProduct(pId, newValues);
    return result; 
  }

  updateManyProducts = async(products) =>{
    const result = await this.dao.updateManyProducts(products);
    return result; 
  }

  deleteProduct = async(product) =>{
    const result = await this.dao.deleteProduct(product);
    return result;
  }
}