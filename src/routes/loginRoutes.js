const { Router } = require('express');
const { login, recoverAccount } = require('../controllers/index');
const register = require('./register.js');

const router = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
router.post('/', login);
router.post('/recover-password', recoverAccount);

//register
router.use('/register', register);

module.exports = router;
