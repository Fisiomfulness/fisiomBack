const { activateConfirmEmail } = require('./confirmEmail');
const { login } = require('./login');
const { emailResetPassword, resetPassword } = require('./recoverAccount');

module.exports = {
  login,
  activateConfirmEmail,
  emailResetPassword,
  resetPassword,
};
