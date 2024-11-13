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

const sendBlogRejectionNotification = async (email, blogTitle, name) => {
    const htmlContent = `
      <p>Estimado ${name},</p>
      <p>Lamentamos informarle que su publicación de blog titulada "<strong>${blogTitle}</strong>" no ha sido aprobada para publicación en nuestra plataforma.</p>
      <p>Gracias por su comprensión.</p>
    `;
  
    const mailOptions = {
      from: MAIL_USER,
      to: email,
      subject: 'Rechazo de Publicación de Blog',
      html: htmlContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de rechazo de blog enviado al profesional');
    } catch (error) {
      console.error('Error al enviar el correo de rechazo de blog:', error);
    }
  };
  
  module.exports = { sendBlogRejectionNotification };
  