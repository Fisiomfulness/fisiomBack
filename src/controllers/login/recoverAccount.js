const User = require('../../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../../config/envConfig');

const recoverAccount = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send('Invalid email');
  }

  const newPassword = Math.random().toString(32).substring(2);
  const salt = await bcrypt.genSalt(10);
  const passCrypt = await bcrypt.hash(newPassword, salt);
  user.password = passCrypt;

  await user.save();

  // Envío del correo electrónico de recuperación de cuenta
  const emailRecovery = async (data) => {
    const transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    const { username, email, password } = data;
    await transport.sendMail({
      from: 'fisiumfulness',
      to: email,
      subject: 'Account Recovery - Fisium Fulness',
      text: 'Account Recovery - Fisium Fulness',
      html: `
        <p> Hi! ${username}, Reset your password on Fisium Fulness</p>
        <p> This is your new password: ${password}</p>
        <p> Click on the link to log in:
        <a href="http://localhost:5173/login"> Fisium Fulness</a></p>
        <p> If you did not request the change, ignore this message.</p>`,
    });
  };

  emailRecovery({
    username: user.username,
    email: user.email,
    password: newPassword,
  });

  res.send('Account recovery email sent');
};

module.exports = {
  recoverAccount,
};
