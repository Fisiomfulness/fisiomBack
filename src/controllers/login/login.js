const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('#src/config/envConfig');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const User = require('#src/models/user/User');
const Professional = require('#src/models/profesional/Profesional');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw new BadRequestError('Credenciales requeridas');

    const [user, professional] = await Promise.all([
      User.findOne({ email }),
      Professional.findOne({ email }),
    ]);

    const foundUser = user || professional;
    if (!foundUser) throw new NotFoundError('Usuario no encontrado');

    if (professional && !professional.isApproved) {
      throw new UnauthorizedError(
        'Tu cuenta está pendiente de aprobación por el administrador.',
      );
    }

    const passwordMatches = await verifyHashedData(
      password,
      foundUser.password,
    );
    if (!passwordMatches) throw new UnauthorizedError('Contraseña incorrecta');

    if (foundUser.suspended) {
      foundUser.suspended = false;
      foundUser.suspensionEndDate = null;
      await foundUser.save();
    }

    // * Creación de JWT
    let payload = {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      image: foundUser.image,
      role: foundUser.role,
      coordinates: foundUser.coordinates,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });

    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 2,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).send({ ...payload, message: 'Logeado con éxito!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
