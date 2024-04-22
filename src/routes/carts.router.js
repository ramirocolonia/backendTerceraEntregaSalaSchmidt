import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const cartsRouter = Router();
const {
  newCart,
  loadCart,
  addProductInCart,
  removeProductFromCart,
  updateCartItems,
  updateQuantityItemCart,
  removeAllProductsFromCart
} = new CartController;

cartsRouter.post("/api/carts", newCart);
cartsRouter.get("/api/carts/:cid", loadCart);
cartsRouter.post("/api/carts/:cid/products/:pid", addProductInCart);
cartsRouter.delete("/api/carts/:cid/products/:pid", removeProductFromCart);
cartsRouter.put("/api/carts/:cid", updateCartItems);
cartsRouter.put("/api/carts/:cid/products/:pid", updateQuantityItemCart);
cartsRouter.delete("/api/carts/:cid", removeAllProductsFromCart);

export default cartsRouter;
