import {Router} from "express";

import { passportCall } from "../utils.js";

const viewsRouter = Router();

viewsRouter.get("/chat", passportCall("jwt", ["USER"]), (req,res)=>{
  res.render("chat", {})
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