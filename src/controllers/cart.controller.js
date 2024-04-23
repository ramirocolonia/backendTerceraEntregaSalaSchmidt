import {
  cartService,
  productService,
  ticketService,
} from "../repositories/index.js";

class CartController {
  newCart = async (req, res) => {
    try {
      const cart = await cartService.createCart();
      if (cart) {
        res.send({ status: "success", payload: cart });
      } else {
        res.send({
          status: "error",
          message: "Error al crear el carrito, " + error,
        });
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
          let addQuantity = cart.products.find(
            (p) => p.product._id == req.params.pid
          );
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
        const product = cart.products.find(
          (p) => p.product._id == req.params.pid
        );
        if (product) {
          cart.products.pull(product);
          if (await cartService.updateCart(cart)) {
            res.send({ status: "success", payload: product });
          } else {
            res.send({
              status: "error",
              message: "Error al eliminar producto del carrito",
            });
          }
        } else {
          res.send({
            status: "error",
            message: "Producto inexistente en este carrito",
          });
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
      if (cart) {
        cart.products = req.body;
        if (await cartService.updateCart(cart)) {
          res.send({ status: "success", payload: cart.products });
        } else {
          res.send({
            status: "error",
            message: "Error al actualizar lista de productos",
          });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  updateQuantityItemCart = async (req, res) => {
    try {
      const cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        const prodIndex = cart.products.findIndex(
          (p) => p.product._id == req.params.pid
        );
        if (prodIndex != -1) {
          if (
            !isNaN(parseInt(req.body.quantity)) &&
            parseInt(req.body.quantity) > 0
          ) {
            cart.products[prodIndex].quantity = parseInt(req.body.quantity);
            if (await cartService.updateCart(cart)) {
              res.send({
                status: "success",
                payload: cart.products[prodIndex],
              });
            } else {
              res.send({
                status: "error",
                message: "Error al actualizar cantidad del producto en carrito",
              });
            }
          } else {
            res.send({
              status: "error",
              message: "La cantidad debe ser un número mayo a cero",
            });
          }
        } else {
          res.send({
            status: "error",
            message: "Producto inexistente en este carrito",
          });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  removeAllProductsFromCart = async (req, res) => {
    try {
      const cart = await cartService.findOneCart(req.params.cid);
      if (cart) {
        cart.products = [];
        if (await cartService.updateCart(cart)) {
          res.send({ status: "success", payload: cart });
        } else {
          res.send({
            status: "error",
            message: "Error al eliminar los productos del carrito",
          });
        }
      } else {
        res.send({ status: "error", message: "Carrito inexistente" });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  createTicket = async (req, res) => {
    try {
      // capturo el cart del usuario que se encuentra logueado
      const user = req.user.usrDTO;
      
      if (user.cart !== req.params.cid) {
        res.send({status: "error", message: "El carrito que desea comprar no corresponde al usuario logueado"});
      } else {
        const cart = await cartService.findOneCart(user.cart);
        if (cart) {
        
          // armado de lista de productos con stock y total de ticket, actualizando stocks...
          let productsTicket = [];
          let totalAmount = 0;
          for (const prod of cart.products) {
            const product = await productService.findOneProduct(prod.product._id);
            if (product.stock >= prod.quantity) {
              product.stock -= prod.quantity;
              await productService.updateProduct(product._id, product);
              totalAmount += product.price * prod.quantity;
              productsTicket.push(prod);
            }
          }
          if (productsTicket.length > 0) {
          
            // se remueven los productos del cart que pudieron ser agregados al ticket
            cart.products = cart.products.filter((prod) => !productsTicket.includes(prod));
            await cartService.updateCart(cart);

            // se crea el ticket
            const ticketCode = Date.now() + Math.floor(Math.random() * 1000 + 1);
            let ticket = {
              code: ticketCode,
              amount: totalAmount,
              purchaser: user.email,
            };
            const result = await ticketService.createTicket(ticket);
            if (result) {
              res.send({ status: "success", payload: result });
            } else {
              res.send({status: "error", message: "Error al guardar ticket en bdd"});
            }
          } else {
            res.send({status: "error", message: "Ninguno de los productos cuenta con stock"});
          }
        }else{
          res.send({status: "error", message: "Error al obtener el cart de la bdd"});
        }
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };
}

export default CartController;
