const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const User = require('../../models/user/User');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  JWT_SECRET,
  MAIL_PASSWORD,
  FRONT_URL,
} = require('../../config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');
const { hashData } = require('#src/util/hashData');
const Profesional = require('#src/models/profesional/Profesional');

const emailResetPassword = async (req, res) => {
  const { email } = req.body;
  var userResult = null;
  try {
    //tiene que buscar en user y profesionals
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

    if (!userResult) {
      res.status(401).json({ message: 'Usuario invalido o inexistente' });
    } else {
      if (!userResult.confirmEmail) {
        res.status(401).json({
          message: 'Este email no es valido o no se ha confirmado su registro',
        });
      } else {
        const token = jwt.sign({ userId: userResult._id }, JWT_SECRET, {
          expiresIn: '5m',
        });

        const url = `${FRONT_URL}/cambiar_password/${token}`;

        sendEmailNodemailer({
          to: userResult.email,
          subject: 'Recuperacion de cuenta - Fisium Fulness',
          html: `
            <p> Hola! ${userResult.name}, cambia tu password de Fisium Fulness</p>
            <p> Has click en este enlace para cambiar tu password:
            <a href=${url} target="_blank"> Cambiar mi password...</a></p>
            <p> Si tu no hiciste esta peticion, ignora este mensaje.</p>`,
        });

        res.status(200).json({ message: 'Email de recuperacion enviado' });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  var userResult = null;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    //tiene que buscar en user y profesionals
    await Promise.allSettled([
      User.findOne({ _id: decodedToken.userId }),
      Profesional.findOne({ _id: decodedToken.userId }),
    ]).then((settElements) => {
      const usersMap = settElements.map((settElement, index) => {
        if (settElement.status === 'fulfilled' && settElement.value) {
          if (index === 0) {
            return { user: settElement.value, model: User };
          } else {
            return { user: settElement.value, model: Profesional };
          }
        } else {
          return null;
        }
      });
      const firstNonNullUser = usersMap.filter((user) => user)[0];
      userResult = firstNonNullUser || null; // Manejar el caso nulo
    });

    if (!userResult) {
      res.status(401).json({ message: 'Usuario invalido o inexistente' });
    } else {
      const hashedPass = await hashData(newPassword);
      await userResult.model.findOneAndUpdate(
        { _id: decodedToken.userId },
        { password: hashedPass },
      );

      res.status(201).send({ message: 'contraseña actualizada' });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  emailResetPassword,
  resetPassword,
};
