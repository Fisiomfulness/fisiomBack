const nodemailer = require('nodemailer');
const fs = require('node:fs/promises');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../../config/envConfig');

// * Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false, // false for 587 port
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

// * Function to send an email
const sendEmailRequestingInfo = async (req, res) => {
  const {
    nombre,
    correo,
    celular,
    dolencia,
    distrito,
  } = req.body;

  // transporter.verify((error, success) => {
  //     if (error) {
  //       console.error('SMTP connection error:', error);
  //     } else {
  //       console.log('SMTP server is ready to take messages:', success);
  //     }
  //   });

  try {
    const htmlAdmin = `
      <p>Se recibió un nuevo mensaje de un paciente para Fullness.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>Paciente: ${nombre}</li>
        <li>Correo electrónico: ${correo}</li>
        <li>Teléfono: ${celular}</li>
        <li>Distrito: ${distrito}</li>
      </ul>
      <p>Dolencias para diagnostico:</p>
      <p>${dolencia}</p>
    `;

    const mailToAdminOptions = {
      from: MAIL_USER,
      to: MAIL_USER,
      replyTo: correo,
      subject: 'Nuevo mensaje a Fullness',
      html: htmlAdmin,
    };

    await transporter.sendMail(mailToAdminOptions);

    res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
  } catch (error) {
    res.status(400).json({ message: 'Error al enviar el correo electrónico' });
  }
};

module.exports = {
  sendEmailRequestingInfo
};
