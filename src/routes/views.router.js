import {Router} from "express";

// import ProductManagerDB from "../dao/ProductManagerDB.js";
// import CartManagerDB from "../dao/CartManagerDB.js";

const viewsRouter = Router();

viewsRouter.get("/chat", (req,res)=>{
  res.render("chat", {})
});

viewsRouter.get('/products', async (req,res)=>{
  try {
    if(!req.session.user){
      res.redirect("/login");
    }else{
      const prodManager = new ProductManagerDB();
      const resp = await prodManager.loadProducts(req.query);
      resp.payload.prevLink = resp.payload.hasPrevPage?`http://localhost:8080/products?page=${resp.payload.prevPage}&limit=${resp.payload.limit}`:"";
      resp.payload.nextLink = resp.payload.hasNextPage?`http://localhost:8080/products?page=${resp.payload.nextPage}&limit=${resp.payload.limit}`:"";
      resp.payload.isValid = (resp.payload.docs.length > 0);
      resp.payload.user = req.session.user.name;
      resp.payload.rol = req.session.user.rol;
      res.render("products",resp.payload)
    }
  } catch (error) {
    res.send({status: "error", message: "Error en ejecución, " + error});
  }
});

viewsRouter.get('/carts/:cid',async (req,res)=>{
  try {
    const cartManager = new CartManagerDB();
    const resp = await cartManager.loadCart(req.params.cid);
    if(resp.status === "success"){
      res.render("cartList", { products: resp.payload.products.map(prod => prod.toObject()) });
    }else{
      res.render("cartList", { products: [] })
    }
  } catch (error) {
    res.send({status: "error", message: "Error en ejecución, " + error});
  }
});

viewsRouter.get("/register", (req,res)=>{
  res.render("registerUser", {});
});

viewsRouter.get("/login", (req,res)=>{
    res.render("login", {});
});

viewsRouter.get("/", (req, res)=>{
  res.redirect("/login")
});

export default viewsRouter;