const { JWT_SECRET, FRONT_URL } = require('../../config/envConfig');
const { verifyHashedData } = require('../../util/hashData');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const Profesional = require('#src/models/Profesional');
const { sendEmailNodemailer } = require('#src/util/nodemailer');

const login = async (req, res) => {
  const { email, password } = req.body;
  var userResult = null;

  try {
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
      res.status(401).json({ message: 'Usuario no encontrado' });
    } else {
      const coincidePass = await verifyHashedData(
        password,
        userResult.password,
      );

      if (!coincidePass) {
        res.status(401).json({ message: 'Password incorrecto' });
      } else {
        //crear token
        let payload = { userId: userResult._id, role: userResult.role };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${token}`);

        return res.status(201).send({
          id: userResult._id,
          role: userResult.role,
          token,
          message: 'Sesión iniciada con éxito',
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
