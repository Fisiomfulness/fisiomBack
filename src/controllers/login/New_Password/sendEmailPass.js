//
const nodemailer = require('nodemailer');
const { MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD, MAIL_PORT, MAIL_HOST } = process.env;

const sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    host:MAIL_HOST,
    service: MAIL_SERVICE,  // Servicio dinámico desde entorno
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: MAIL_USER,  // Remitente dinámico desde entorno
    to: email,
    subject: 'Restablecimiento de Contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de restablecimiento enviado');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo de restablecimiento');
  }
};

module.exports = { sendResetEmail };
