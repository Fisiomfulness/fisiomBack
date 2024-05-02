const moment = require('moment');
const fs = require('node:fs/promises');
const jwt = require('jsonwebtoken');

const Profesional = require('#src/models/Profesional');
const { hashData } = require('#src/util/hashData');
const {
  cloudinary,
  curriculumUploadOptions,
} = require('#src/config/cloudinaryConfig');
const { FRONT_URL, JWT_SECRET } = require('#src/config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');
const User = require('#src/models/User');

const profesionalRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;

    const file = req.file.path;
    var userResult = null;

    await Promise.allSettled([
      User.findOne({ email }),
      Profesional.findOne({ email }),
    ]).then((settElements) => {
      const usersMap = settElements.map((settElement, index) => {
        if (settElement.status === 'fulfilled' && settElement.value) {
          if (index === 0) {
            return { user: settElement.value };
          } else {
            return { user: settElement.value };
          }
        } else {
          return null;
        }
      });
      const firstNonNullUser = usersMap.filter((user) => user)[0];
      userResult = firstNonNullUser?.user || null; // Manejar el caso nulo
    });

    if (userResult) {
      await fs.unlink(file);
      res.status(401).json({ message: 'este email ya existe' });
    } else {
      const { secure_url } = await cloudinary.uploader.upload(
        file,
        curriculumUploadOptions,
      );

      restData.password = hashedPass;
      restData.birthDate = dateOfBirth;
      restData.email = email;
      restData.curriculum = secure_url;

      const newProfesional = await Profesional.create(restData);

      let payload = {
        userId: newProfesional._id,
      };

      const tokenEmailConfirm = jwt.sign(payload, JWT_SECRET);

      //crear email de confirmacion
      const url = `${FRONT_URL}/confirmar_email/${tokenEmailConfirm}`;

      sendEmailNodemailer({
        to: newProfesional.email,
        subject: 'Confirmacion de cuenta - Fisium Fulness',
        html: `
      <p> Hola! ${newProfesional.name}, confirma la creacion de tu cuenta de Fisium Fulness</p>
      <p> Has click en este enlace para confirmar tu cuenta:
      <a href=${url} target="_blank"> Confirmar mi cuenta...</a></p>
      <p> Si tu no hiciste esta peticion, ignora este mensaje.</p>`,
      });

      await fs.unlink(file);

      res.status(201).json({ message: 'creado con exito' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Algo fallo...', errorMessage: error.message });
  }
};

module.exports = profesionalRegister;
