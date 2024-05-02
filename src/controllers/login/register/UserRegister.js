const moment = require('moment');
const jwt = require('jsonwebtoken');

const User = require('#src/models/User');
const { hashData } = require('#src/util/hashData');
const { JWT_SECRET, FRONT_URL } = require('#src/config/envConfig');
const Profesional = require('#src/models/Profesional');
const { sendEmailNodemailer } = require('#src/util/nodemailer');

const UserRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;
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
      res.status(401).json({ message: 'este email ya existe' });
    } else {
      const hashedPass = await hashData(password);
      restData.password = hashedPass;
      restData.birthDate = dateOfBirth;
      restData.email = email;

      const newUser = await User.create(restData);

      let payload = {
        userId: newUser._id,
      };

      const tokenEmailConfirm = jwt.sign(payload, JWT_SECRET);

      //crear email de confirmacion
      const url = `${FRONT_URL}/confirmar_email/${tokenEmailConfirm}`;

      sendEmailNodemailer({
        to: newUser.email,
        subject: 'Confirmacion de cuenta - Fisium Fulness',
        html: `
          <p> Hola! ${newUser.name}, confirma la creacion de tu cuenta de Fisium Fulness</p>
          <p> Has click en este enlace para confirmar tu cuenta:
          <a href=${url} target="_blank"> Confirmar mi cuenta...</a></p>
          <p> Si tu no hiciste esta peticion, ignora este mensaje.</p>`,
      });

      res.status(201).json({ message: 'creado con exito' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Algo fallo...', errorMessage: error.message });
  }
};

module.exports = UserRegister;
