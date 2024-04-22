import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { passportCall } from "../utils.js";

const cartsRouter = Router();
const {
  newCart,
  loadCart,
  addProductInCart,
  removeProductFromCart,
  updateCartItems,
  updateQuantityItemCart,
  removeAllProductsFromCart,
  createTicket
} = new CartController();

cartsRouter.post("/api/carts", newCart);
cartsRouter.get("/api/carts/:cid", loadCart);
cartsRouter.post("/api/carts/:cid/products/:pid", addProductInCart);
cartsRouter.delete("/api/carts/:cid/products/:pid", removeProductFromCart);
cartsRouter.put("/api/carts/:cid", updateCartItems);
cartsRouter.put("/api/carts/:cid/products/:pid", updateQuantityItemCart);
cartsRouter.delete("/api/carts/:cid", removeAllProductsFromCart);
cartsRouter.post("/:cid/purchase", passportCall("jwt", ["USER"]), createTicket);

export default cartsRouter;
