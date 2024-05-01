const moment = require('moment');
const jwt = require('jsonwebtoken');

const User = require('#src/models/User');
const { hashData } = require('#src/util/hashData');
const { JWT_SECRET, FRONT_URL } = require('#src/config/envConfig');

const UserRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;

    const emailVerify = await User.findOne({ email });

    if (emailVerify) {
      res.status(401).json({ message: 'este email ya existe' });
    } else {
      const hashedPass = await hashData(password);

      if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
        res.status(401).json({
          message:
            'Formato de fecha de nacimiento no válido. Porfavor usa YYYY-MM-DD.',
        });
      } else {
        const today = moment();
        const birthDate = moment(dateOfBirth);
        const age = today.diff(birthDate, 'years', true);

        if (age < 18) {
          res.status(401).json({
            message: 'Necesitas tener 18 años o mas para registrarte.',
          });
        } else {
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
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = UserRegister;
