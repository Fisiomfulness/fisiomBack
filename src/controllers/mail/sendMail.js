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
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

// * Function to send an email
const sendEmail = async (req, res) => {
  const { dniNumber, phone, email, message } = req.body;
  const cvFile = req.file || null;

  try {
    const htmlUser = `
      <p>Su postulacion fue recibida con exito y sera revisada a la brevedad.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>DNI: ${dniNumber}</li>
        <li>Teléfono: ${phone}</li>
        <li>Correo Electrónico: ${email}</li>
      </ul>
      <p>Mensaje:</p>
      <p>${message}</p>
    `;

    const mailToUserOptions = {
      from: MAIL_USER,
      to: email,
      subject: 'Postulacion a FisiomFulness',
      html: htmlUser,
      attachments: cvFile
        ? [
            {
              filename: cvFile.originalname,
              path: cvFile.path,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailToUserOptions);

    const htmlAdmin = `
      <p>Se recibio una nueva postulacion a FisiomFulness.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>DNI: ${dniNumber}</li>
        <li>Teléfono: ${phone}</li>
        <li>Correo Electrónico: ${email}</li>
      </ul>
      <p>Mensaje:</p>
      <p>${message}</p>
    `;

    const mailToAdminOptions = {
      from: MAIL_USER,
      to: MAIL_USER,
      subject: 'Nueva postulacion a FisiomFulness',
      html: htmlAdmin,
      attachments: cvFile
        ? [
            {
              filename: cvFile.originalname,
              path: cvFile.path,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailToAdminOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error sending email' });
  } finally {
    if (cvFile) await fs.unlink(cvFile.path); // ? Always deletes the generated file
  }
};

module.exports = {
  sendEmail,
};
