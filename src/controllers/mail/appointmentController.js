const nodemailer = require('nodemailer');
const fs = require('node:fs/promises');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../../config/envConfig');

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

// Función que envia confirmación de cita
const sendAppointmentConfirmation = async (req, res) => {
  console.log('sendAppointmentConfirmation ha sido llamada');
  const { email, appointmentDetails, productImage } = req.body;

  try {
    const htmlContent = `
      <p>ESTIMADO CLIENTE,</p>
      <p>Su cita ha sido confirmada con los siguientes detalles:</p>
      <ul>
        <li>Fecha: ${appointmentDetails.date}</li>
        <li>Hora: ${appointmentDetails.time}</li>
        <li>Especialista: ${appointmentDetails.specialist}</li>
      </ul>
      <p>GRACIAS POR SU CONFIANZA EN FISIOMFULNES.</p>
    `;

    const mailOptions = {
      from: MAIL_USER,
      to: email,
      subject: 'Confirmación de Cita',
      html: htmlContent,
      attachments: productImage
        ? [
            {
              filename: productImage.filename,
              path: productImage.path,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: 'Correo de confirmación enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res
      .status(500)
      .json({ message: 'Error al enviar el correo de confirmación.' });
  }
};

module.exports = {
  sendAppointmentConfirmation,
};
