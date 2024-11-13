const nodemailer = require('nodemailer');
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

const sendProfessionalNotification = async (professionalEmail, professionalName, status) => {
  let subject;
  let htmlContent;

  if (status === 'Approved') {
    subject = 'Su cuenta ha sido aprobada';
    htmlContent = `
      <p>Estimado ${professionalName},</p>
      <p>Nos complace informarle que su cuenta ha sido aprobada y ya puede acceder a nuestra plataforma.</p>
      <p>Gracias por unirse a nosotros. ¡Esperamos trabajar juntos!</p>
    `;
  } else if (status === 'Rejected') {
    subject = 'Notificación de rechazo de cuenta';
    htmlContent = `
      <p>Estimado ${professionalName},</p>
      <p>Le informamos que, después de una revisión detallada, su solicitud para unirse a nuestra plataforma ha sido rechazada en esta ocasión.</p>
      <p>Si tiene alguna duda o desea obtener más información sobre los motivos de esta decisión, no dude en contactarnos.</p>
      <p>Gracias por su interés en formar parte de nuestro equipo.</p>
    `;
  } else {
    console.error('Estado de aprobación no válido');
    return;
  }

  const mailOptions = {
    from: MAIL_USER,
    to: professionalEmail,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de ${status === 'Approved' ? 'aprobación' : 'rechazo'} enviado al profesional`);
  } catch (error) {
    console.error(`Error al enviar el correo de ${status === 'Approved' ? 'aprobación' : 'rechazo'}:`, error);
  }
};

module.exports = { sendProfessionalNotification };
