import { Router } from "express";
import { passportCall } from "../utils.js";
import UserController from "../controllers/user.controller.js";

const usersRouter = Router();
const {
  registerUser,
  login
} = new UserController();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", login);
usersRouter.get("/api/sessions/current", passportCall("jwt", ["USER"]), async (req, res)=>{
  res.send(req.user);
});

export default usersRouter;
