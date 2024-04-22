import { productModel } from "../models/product.model.js";

class ProductMongo {

  async getProducts(query, order) {
    const result = await productModel.paginate(query, order);
    return result;
  }

  async findOneProduct(pId) {
    const result = await productModel.findOne({ _id: pId, status:true });
    return result;
  }

  async createProduct(product) {
    const result = await productModel.create(product);
    return result;
  }

  async existCode(pCode) {
    if (await productModel.findOne({ code: pCode })) {
      return true;
    }
    return false;
  }

  async updateProduct(pId, newValues) {
    const result = await productModel.updateOne({ _id: pId}, newValues);
    return result; 
  }

  async updateManyProducts(products){
    const result = await productModel.updateMany(products);
    return result;
  }

  async deleteProduct(product){
    const result = await productModel.updateOne({_id: product._id}, {status: !product.status});
    return result;
  }

}

export default ProductMongo;
