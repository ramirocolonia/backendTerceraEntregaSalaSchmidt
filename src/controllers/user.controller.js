import jwt from "jsonwebtoken";

import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";
import { userService } from "../repositories/index.js";
import UserDTO from "../dao/DTOs/user.dto.js";

class UserController {

  registerUser = async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      if (!(await userService.existEmail(email))) {
        let newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
        };
        if (
          Object.values(newUser).every(
            (value) => String(value).trim() !== "" && value !== undefined
          )
        ) {
          const result = await userService.createUser(newUser);
          if (result) {
            res.send({ status: "success", payload: result });
          } else {
            res.send({
              status: "error",
              message: "Error al registrar usuario",
            });
          }
        } else {
          res.send({ status: "error", message: "Faltan campos obligatorios" });
        }
      } else {
        res.send({
          status: "error",
          message: "El correo electrónico ingresado ya se encuentra registrado",
        });
      }
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución, " + error });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    let user;
    if (email === config.admin && password === config.passAdmin) {
      user = {
        first_name: "",
        last_name: "Administrador",
        email: email,
        age: 0,
        rol: "ADMIN",
      };
    } else {
      user = await userService.findOneUser(email);
    }
    if (user) {
      if (user.rol === "ADMIN" || isValidPassword(user, password)) {
        const usrDTO = new UserDTO(user);
        const token = jwt.sign({ usrDTO }, config.tokenPass, {expiresIn: "24h"});
        res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
        res.send({ status: "success", payload: user, token: token });
      } else {
        res.send({ status: "error", message: "Contraseña incorrecta" });
      }
    } else {
      res.send({ status: "error", message: "Usuario no registrado" });
    }
  };
}
export default UserController;
