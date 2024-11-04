const User = require("../../models/user/User");
const Profesional = require("#src/models/profesional/Profesional");
const moment = require("moment");
const { verifyHashedData } = require("#src/util/hashData");
const { NotFoundError, UnauthorizedError } = require("#src/util/errors");
const { sendEmailNodemailer } = require("#src/util/nodemailer");

const suspendUser = async (req, res) => {
  const id = req.params.id;
  const { response, password, email, name, time } = req.body;

  try {
    const professional = await Profesional.findById(id);
    const user = await User.findById(id);
    const foundUser = user || professional;

    if (!foundUser) throw new NotFoundError("Usuario no encontrado");

    const passwordMatches = await verifyHashedData(
      password,
      foundUser.password
    );
    if (!passwordMatches) throw new UnauthorizedError("Contraseña incorrecta");

    const suspensionEndDate = moment().add(time, "months").toDate();

    // Actualizar las propiedades de suspensión
    foundUser.suspended = true;
    foundUser.suspensionEndDate = suspensionEndDate;
    foundUser.address = foundUser.address;

    console.log(foundUser);
    await foundUser.save();

    sendEmailNodemailer({
      to: "fisiomfulness@gmail.com",
      subject: "Suspención de cuenta - Fisiom Fulness",
      html: `
        <p>Hola Jhonn,</p>
        <p>El usuario ${name} ha solicitado la suspención de su cuenta de Fisiom Fulness.</p>
        <p><strong>Razón proporcionada por el usuario:</strong></p>
        <blockquote style="font-style: italic; color: #555;">
          ${response ? response : "El usuario no proporcionó una razón."}
        </blockquote>
        <p>Si no tomaste esta decisión, ignora este mensaje.</p>
        <p>Atentamente,<br>El equipo de Fisiom Fulness</p>
        `,
    });

    return res.status(200).json({ message: "User has been suspend" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  suspendUser,
};
