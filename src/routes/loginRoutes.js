const { Router } = require("express");
const { 
  login,
  recoverAccount
} = require("../controllers/index");

const loginRouter = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
loginRouter.post("/", login);
loginRouter.post("/recover-password", recoverAccount);

module.exports = loginRouter;

