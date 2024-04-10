const { Router } = require("express");
const { 
  login,
  recoverAccount
} = require("../controllers/index");
const { register } = require("../controllers/login/loginExample");

const loginRouter = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
loginRouter.post("/", login);
loginRouter.post("/register", register)
loginRouter.post("/recover-password", recoverAccount);

module.exports = loginRouter;

