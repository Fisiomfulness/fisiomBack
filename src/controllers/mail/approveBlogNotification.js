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

const sendBlogApprovalNotification = async (professionalEmail, blogTitle, professionalName) => {
  const htmlContent = `
    <p>Estimado ${professionalName},,</p>
    <p>Nos complace informarle que su publicación de blog titulada "<strong>${blogTitle}</strong>" ha sido aprobada y ahora está visible en nuestra plataforma.</p>
    <p>Gracias por contribuir con contenido valioso para nuestra comunidad.</p>
  `;

  const mailOptions = {
    from: MAIL_USER,
    to: professionalEmail,
    subject: 'Aprobación de Publicación de Blog',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de aprobación de blog enviado al profesional');
  } catch (error) {
    console.error('Error al enviar el correo de aprobación de blog:', error);
  }
};

module.exports = { sendBlogApprovalNotification };
