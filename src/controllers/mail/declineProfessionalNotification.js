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

const sendProfessionalRejectionNotification = async (professionalEmail, professionalName) => {
    const htmlContent = `
      <p>Estimado ${professionalName},</p>
      <p>Le informamos que, después de una revisión detallada, su solicitud para unirse a nuestra plataforma ha sido rechazada en esta ocasión.</p>
      <p>Si tiene alguna duda o desea obtener más información sobre los motivos de esta decisión, no dude en contactarnos.</p>
      <p>Gracias por su interés en formar parte de nuestro equipo.</p>
    `;
  
    const mailOptions = {
      from: MAIL_USER,
      to: professionalEmail,
      subject: 'Notificación de rechazo de cuenta',
      html: htmlContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de rechazo enviado al profesional');
    } catch (error) {
      console.error('Error al enviar el correo de rechazo:', error);
    }
  };

module.exports = { sendProfessionalRejectionNotification }  