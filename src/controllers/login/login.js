const { JWT_SECRET } = require('../../config/envConfig');
const { verifyHashedData } = require('../../util/hashData');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send('Usuario no encontrado');

    const coincidePass = await verifyHashedData(password, user.password);
    if (!coincidePass) return res.status(401).send('Password incorrecto');

    let userForToken = { userId: user._id, role: user.role };
    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '2d' });

    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 2, // ? 2 days
      httpOnly: true,
      secure: true,
    });

    res.status(200).send({
      id: user._id,
      role: user.role,
      token,
      message: 'Sesión iniciada con éxito',
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  login,
};
