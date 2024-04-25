const { JWT_SECRET } = require('../../config/envConfig');
const { verifyHashedData } = require('../../util/hashData');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const Profesional = require('#src/models/Profesional');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await User.findOne({ email });
    const professionals = await Profesional.findOne({ email });

    let user = undefined;

    users
      ? (user = users)
      : professionals
        ? (user = professionals)
        : (user = false);

    if (!user) {
      res.status(401).send('Usuario no encontrado');
    } else {
      const coincidePass = await verifyHashedData(password, user.password);

      if (!coincidePass) {
        res.status(401).send('Password incorrecto');
      } else {
        let userForToken = { userId: user._id, role: user.role };

        const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${token}`);

        return res.status(201).send({
          id: user._id,
          role: user.role,
          token,
          message: 'Sesión iniciada con éxito',
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  login,
};
