const nodemailer = require('nodemailer');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../../config/envConfig');

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

// Función para enviar notificación de blog según el estado (Aprobado o Rechazado)
const sendBlogNotification = async (email, blogTitle, name, status) => {
  let subject, htmlContent;

  // Determina el contenido del correo en función del estado
  if (status === 'Approved') {
    subject = 'Aprobación de Publicación de Blog';
    htmlContent = `
      <p>Estimado ${name},</p>
      <p>Nos complace informarle que su publicación de blog titulada "<strong>${blogTitle}</strong>" ha sido aprobada y ahora está visible en nuestra plataforma.</p>
      <p>Gracias por contribuir con contenido valioso para nuestra comunidad.</p>
    `;
  } else if (status === 'Rejected') {
    subject = 'Rechazo de Publicación de Blog';
    htmlContent = `
      <p>Estimado ${name},</p>
      <p>Lamentamos informarle que su publicación de blog titulada "<strong>${blogTitle}</strong>" no ha sido aprobada para publicación en nuestra plataforma.</p>
      <p>Gracias por su comprensión.</p>
    `;
  } else {
    // Si el estado es 'Pending', no enviar correo
    return;
  }

  const mailOptions = {
    from: MAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de ${status.toLowerCase()} de blog enviado al profesional`);
  } catch (error) {
    console.error(`Error al enviar el correo de ${status.toLowerCase()} de blog:`, error);
  }
};

module.exports = { sendBlogNotification };
