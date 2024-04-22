import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const productsRouter = Router();
const {
  loadProducts,
  loadProduct,
  newProduct,
  updateProduct,
  deleteProduct
} = new ProductController();

productsRouter.get("/api/products", loadProducts);
productsRouter.get("/api/products/:pid", loadProduct);
productsRouter.post("/api/products", newProduct);
productsRouter.put("/api/products/:pid", updateProduct);
productsRouter.delete("/api/products/:pid", deleteProduct);

export default productsRouter;