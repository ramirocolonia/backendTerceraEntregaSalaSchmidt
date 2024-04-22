import { productService } from "../repositories/index.js";

class ProductController {

  loadProducts = async (req, res) => {
    try {
      let query = {};
      let order = {
        limit: req.query.limit? parseInt(req.query.limit) : 10,
        page: req.query.page? parseInt(req.query.page) : 1,
      };
      if (parseInt(req.query.stock))
        query.stock = { $gte: parseInt(req.query.stock) };
      if (req.query.category) query.category = req.query.category;
      if (parseInt(req.query.sort) == 1 || parseInt(req.query.sort) == -1)
        order.sort = { price: parseInt(req.query.sort) };
      order.lean = true;
      const products = await productService.getProducts(query, order);
      res.send({ status: "success", payload: products });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  loadProduct = async (req, res) => {
    try {
      const product = await productService.findOneProduct(req.params.pid);
      if (product) {
        res.send({ status: "success", payload: product });
      } else {
        res.send({
          status: "error",
          message: "Producto no encontrado en la BDD",
        });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  newProduct = async (req, res) => {
    try{
      const { title, description, code, price, stock, category } = req.body;
      const thumbs = req.body.thumbnails || [];
      if (!(await productService.existCode(code))) {
        let newProduct = {
          title,
          description,
          code,
          price,
          status: true,
          stock,
          category,
        };
        if (Object.values(newProduct).every((value) => String(value).trim() !== "" && value !== undefined)){
          newProduct.thumbnails = thumbs;
          const result = await productService.createProduct(newProduct);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            res.send({ status: "error", message: "Error al guardar producto" });
          }
        } else {
          res.send({ status: "error", message: "Faltan campos obligatorios" });
        }
      } else {
        res.send({ status: "error", message: "El código ingresado ya existe" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateProduct = async (req, res) => {
    try{
      const newValues = req.body;
      if (Object.values(newValues).every((value) => String(value).trim() !== "" && value !== undefined)){
        if (await productService.updateProduct(req.params.pid, newValues)){
          res.send({ status: "success", payload: `Producto id ${req.params.pid} eliminado correctamente` });
        } else {
          res.send({ status: "error", message: "Error al actualizar producto" });
        }
      } else {
        res.send({ status: "error", message: "Faltan campos obligatorios" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  deleteProduct = async (req, res) => {
    try{
      let product = await productService.findOneProduct(req.params.pid);
      if (product) {
        if(product.status){
          if (await productService.deleteProduct(product)) {
            res.send({ status: "success", payload: `Producto id ${req.params.pid} eliminado correctamente` });
          } else {
            res.send({ status: "error", message: "Error al eliminar producto" });
          }
        }else{
          res.send({ status: "error", message: "Error, el producto ya se encuentra eliminado previamente"});
        }
      }else {
        res.send({ status: "error", message: "Error no existe el producto" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };
}

export default ProductController;
