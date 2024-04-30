const { Router } = require('express');
const { login } = require('../controllers/index');
const register = require('./register.js');
const {
  emailResetPassword,
  resetPassword,
} = require('#src/controllers/login/recoverAccount');
const { activateConfirmEmail } = require('#src/controllers/login/confirmEmail');

const router = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
router.post('/', login);
router.post('/send_email', emailResetPassword);
router.post('/reset_password', resetPassword);
router.get('/confirm_email/:token', activateConfirmEmail);

//register
router.use('/register', register);

module.exports = router;
