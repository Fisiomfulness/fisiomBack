const { cloudinary } = require("../../config/cloudinaryConfig");
const User = require("../../models/user/User");
const Comment = require("../../models/blog/Comment");
const { sendEmailNodemailer } = require("#src/util/nodemailer");
const Professional = require("#src/models/profesional/Profesional");
const { verifyHashedData } = require("#src/util/hashData");
const { NotFoundError, UnauthorizedError } = require("#src/util/errors");

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { response, password, email, name } = req.body;

  try {
    const [userDb, professional] = await Promise.all([
      User.findOne({ email }),
      Professional.findOne({ email }),
    ]);

    const foundUser = userDb || professional;
    if (!foundUser) throw new NotFoundError("Usuario no encontrado");

    const passwordMatches = await verifyHashedData(
      password,
      foundUser.password
    );
    if (!passwordMatches) throw new UnauthorizedError("Contraseña incorrecta");

    if (passwordMatches && foundUser) {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error("the user does not exist");
      // console.log("Valor de user.id_image:", user.id_image); //
      // await cloudinary.uploader.destroy(user.id_image);
      await Comment.deleteMany({ user_id: id });
    }

    if (id === "64c2d44f61cc7d6cec9d2abb") throw new Error("Dont remove admin");
    sendEmailNodemailer({
      to: "fisiomfulness@gmail.com",
      subject: "Eliminación de cuenta - Fisiom Fulness",
      html: `
        <p>Hola Jhonn,</p>
        <p>El usuario ${name} ha solicitado la eliminación de su cuenta de Fisiom Fulness.</p>
        <p><strong>Razón proporcionada por el usuario:</strong></p>
        <blockquote style="font-style: italic; color: #555;">
          ${response ? response : "El usuario no proporcionó una razón."}
        </blockquote>
        <p>Si no tomaste esta decisión, ignora este mensaje.</p>
        <p>Atentamente,<br>El equipo de Fisiom Fulness</p>
        `,
    });

    return res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  deleteUser,
};
