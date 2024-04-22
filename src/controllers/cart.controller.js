import { cartService, productService, ticketService } from "../repositories/index.js";

class CartController {

  newCart = async (req, res) => {
    try {
      const cart = await cartService.createCart();
      if (cart) {
        res.send({ status: "success", payload: cart });
      } else {
        res.send({ status: "error", message: "Error al crear el carrito, " + error });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  loadCart = async (req, res) => {
    try {
      let cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        res.send({ status: "success", payload: cart });
      } else {
        res.send({ status: "error", message: "Carrito no encontrado" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  addProductInCart = async (req, res) => {
    try {
      const cart = await cartService.findOneCart(req.params.cid);
      const product = await productService.findOneProduct(req.params.pid);
      if (cart) {
        if (product) {
          let addQuantity = cart.products.find((p) => p.product._id == req.params.pid);
          if (addQuantity) {
            addQuantity.quantity += 1;
          } else {
            cart.products.push({ product: product.id, quantity: 1 });
          }
          if (await cartService.updateCart(cart)) {
            res.send({ status: "success", payload: product });
          } else {
            res.send({ status: "error", message: "Error al guardar producto" });
          }
        } else {
          res.send({ status: "error", message: "Producto inexistente" });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  removeProductFromCart = async (req, res) => {
    try {
      const cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        const product = cart.products.find((p) => p.product._id == req.params.pid);
        if (product) {
          cart.products.pull(product);
          if (await cartService.updateCart(cart)) {
            res.send({ status: "success", payload: product });
          } else {
            res.send({ status: "error", message: "Error al eliminar producto del carrito" });
          }
        } else {
          res.send({ status: "error", message: "Producto inexistente en este carrito" });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateCartItems = async (req, res) => {
    try {
      const cart = await cartService.findOneCart(req.params.cid);
      if(cart){
        cart.products = req.body;
        if (await cartService.updateCart(cart)) {
          res.send({ status: "success", payload: cart.products });
        } else {
          res.send({ status: "error", message: "Error al actualizar lista de productos" });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateQuantityItemCart = async (req, res) => {
    try{
      const cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        const prodIndex = cart.products.findIndex((p)=> p.product._id == req.params.pid);
        if (prodIndex != -1) {
          if(!isNaN(parseInt(req.body.quantity)) && parseInt(req.body.quantity) > 0){
            cart.products[prodIndex].quantity = parseInt(req.body.quantity);
            if (await cartService.updateCart(cart)) {
              res.send({ status: "success", payload: cart.products[prodIndex] });
            } else {
              res.send({ status: "error", message: "Error al actualizar cantidad del producto en carrito" });
            }
          } else {
            res.send({ status: "error", message: "La cantidad debe ser un número mayo a cero" });
          }
        } else {
          res.send({ status: "error", message: "Producto inexistente en este carrito" });
        }
      } else {
        res.send({status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  removeAllProductsFromCart = async (req, res) => {
    try{
      const cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        cart.products = [];
        if (await cartService.updateCart(cart)) {
          res.send({ status: "success", payload: cart });
        } else {
          res.send({ status: "error", message: "Error al eliminar los productos del carrito" });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  createTicket = async (req, res) =>{
    try {
      const user = req.user.usrDTO;
      const cart = await cartService.findOneCart(user.cart);
      let productsTicket = [];
      let totalAmount = 0;
      cart.products.forEach(prod => {
        if(prod.product.stock >= prod.quantity){
          // productsOrder.push(prod);
          prod.product.stock = prod.product.stock - prod.quantity;
          totalAmount += (prod.product.price * prod.quantity);
          productsTicket.push(prod);
          cart.products.pull(prod);
        }
      });
      console.log("CART " + cart);
      console.log("TOTAL AMOUNT " + totalAmount);
      console.log("PRODUCTS A ORDEN " + productsTicket);
      await cartService.updateCart(cart);
      await productService.updateManyProducts(productsTicket);
      // let productsOrder = cart.products.filter((prod) => prod.product.stock >= prod.quantity);
      // let totalAmount = productsOrder.reduce((acc, prev) => {
      //   acc += (prev.product.price * prev.quantity);
      //   return acc;
      // },0);
      const ticketCode = Date.now + Math.floor(Math.random() * 1000 + 1);
      let ticket = {
        code: ticketCode,
        amount: totalAmount,
        purchaser: user.email
      }
      const result = ticketService.createTicket(ticket);
      if(result){
        res.send({ status: "success", payload: result });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  }
  
}

export default CartController;
