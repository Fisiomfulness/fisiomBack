const nodemailer = require("nodemailer");
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require("../../config/envConfig");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

// Function to send an email
const sendEmail = async (req, res) => {
  try {
    const { dni, to, text, attach } = req.body;
    console.log("estamos en el back: ", attach.data);
    const htmlUser = `
      <p>Su postulacion fue recibida con exito y sera revisada a la brevedad.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>DNI: ${dni}</li>
        <li>Correo Electrónico: ${to}</li>
      </ul>
      <p>Texto adicional:</p>
      <p>${text}</p>
    `;

    const mailOptions = {
      from: MAIL_USER,
      to,
      subject: "Postulacion a FisiomFulness",
      html: htmlUser,
      attachments: [
        {
          filename: "lorem-ipsum.pdf",
          path: "./src/controllers/mail/lorem-ipsum.pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    const htmlAdmin = `
      <p>Se recibio una nueva postulacion a FisiomFulness.</p>
      <p>A continuación, los detalles:</p>
      <ul>
        <li>DNI: ${dni}</li>
        <li>Correo Electrónico: ${to}</li>
      </ul>
      <p>Texto adicional:</p>
      <p>${text}</p>
    `;

    const mailOptions2 = {
      from: MAIL_USER,
      to, //agregar : MAIL para que este mail llegue a dilan
      subject: "Nueva postulacion a FisiomFulness",
      html: htmlAdmin,
      attachments: [
        {
          filename: attach.name,
          path: attach.data,
        },
      ], //descomentar para agregar el cv del candidato
    };

    await transporter.sendMail(mailOptions2);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).json({ message: "Error sending email" });
  }
};

module.exports = {
  sendEmail,
};
