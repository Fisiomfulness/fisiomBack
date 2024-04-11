const { Router } = require("express");
const { 
  login,
  recoverAccount
} = require("../controllers/index");

const router = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
router.post("/", login);
router.post("/recover-password", recoverAccount);

module.exports = router;

