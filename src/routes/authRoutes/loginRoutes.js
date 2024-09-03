const { Router } = require('express');
const {
  login,
  activateConfirmEmail,
  emailResetPassword,
  resetPassword,
} = require('#src/controllers/login/index');

const router = Router();

// loginRouter.post("/", loginController.login); // Cambio aquí
router.post('/', login);
router.post('/send_email', emailResetPassword);
router.post('/reset_password', resetPassword);
router.get('/confirm_email/:token', activateConfirmEmail);

module.exports = router;
