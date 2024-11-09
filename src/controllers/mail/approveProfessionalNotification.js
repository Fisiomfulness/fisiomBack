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
// Función que envía notificación de aprobación al profesional
const sendProfessionalApprovalNotification = async (professionalEmail, professionalName) => {
    const htmlContent = `
      <p>Estimado ${professionalName},</p>
      <p>Nos complace informarle que su cuenta ha sido aprobada y ya puede acceder a nuestra plataforma.</p>
      <p>Gracias por unirse a nosotros. ¡Esperamos trabajar juntos!</p>
    `;
  
    const mailOptions = {
      from: MAIL_USER,
      to: professionalEmail,
      subject: 'Su cuenta ha sido aprobada',
      html: htmlContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de aprobación enviado al profesional');
    } catch (error) {
      console.error('Error al enviar el correo de aprobación:', error);
    }
  };

  module.exports = {sendProfessionalApprovalNotification};
  