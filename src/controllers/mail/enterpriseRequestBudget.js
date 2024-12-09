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
const sendEmailRequestingBudget = async (req, res) => {
  const {
    senderName,
    senderRuc,
    senderEmail,
    senderPhone,
    senderPais,
    senderEmployees,
    senderAdditionalDetails,
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
      <p>Se recibio un nuevo pedido de cotización a FisioFulness.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>Nombre de la empresa o solicitante: ${senderName}</li>
        <li>RUC: ${senderRuc}</li>
        <li>Correo electrónico: ${senderEmail}</li>
        <li>Teléfono: ${senderPhone}</li>
        <li>País: ${senderPais}</li>
        <li>Número de empleados: ${senderEmployees}</li>
      </ul>
      <p>Detalles adicionales:</p>
      <p>${senderAdditionalDetails}</p>
    `;

    const mailToAdminOptions = {
      from: MAIL_USER,
      to: MAIL_USER,
      replyTo: senderEmail,
      subject: 'Nueva postulacion a FisioFulness',
      html: htmlAdmin,
    };

    await transporter.sendMail(mailToAdminOptions);

    res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
  } catch (error) {
    res.status(400).json({ message: 'Error al enviar el correo electrónico' });
  }
};

module.exports = {
  sendEmailRequestingBudget,
};
