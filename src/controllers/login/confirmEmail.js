const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const Profesional = require('#src/models/Profesional');
const User = require('../../models/User');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  JWT_SECRET,
  MAIL_PASSWORD,
} = require('../../config/envConfig');
const { hashData } = require('#src/util/hashData');

const activateConfirmEmail = async (req, res) => {
  const { token } = req.params;
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
      //retorna un null si no encuentra por lo tanto no rompe. por eso verficamos que si exista el user
      await userResult.model.findOneAndUpdate(
        { _id: decodedToken.userId },
        { confirmEmail: true },
      );
      res.status(201).send({ message: 'Email Confirmado' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  activateConfirmEmail,
};
