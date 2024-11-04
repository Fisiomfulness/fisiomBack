const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('#src/config/envConfig');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const User = require('#src/models/user/User');
const Professional = require('#src/models/profesional/Profesional');

const login = async (req, res) => {
  const { email, password } = req.body; 
  try {
    // Validar que se proporcionen las credenciales
    if (!email || !password) {
      throw new BadRequestError('Credenciales requeridas');
    }

    // Buscar el usuario o profesional
    const [user, professional] = await Promise.all([
      User.findOne({ email }),
      Professional.findOne({ email }),
    ]);

    const foundUser = user || professional;

    // Si no se encontró el usuario o profesional
    if (!foundUser) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Verificar si es un profesional y si está aprobado
    if (professional && !professional.isApproved) {
      // Lanzar un error en vez de retornar una respuesta directamente
      throw new ForbiddenError(
        'Tu cuenta está pendiente de aprobación por el administrador.',
      );
    }

    // Verificar la contraseña
    const passwordMatches = await verifyHashedData(
      password,
      foundUser.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedError('Contraseña incorrecta');
    }

    // Verificar si el usuario está suspendido
    if (foundUser.suspended) {
      foundUser.suspended = false;
      foundUser.suspensionEndDate = null;
      await foundUser.save();
    }

    // Crear JWT
    const payload = {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      image: foundUser.image,
      role: foundUser.role,
      coordinates: foundUser.coordinates,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });

    // Configurar cookie
    res.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 días
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Responder con el payload
    res.status(200).json({ ...payload, message: 'Logeado con éxito!' });
  } catch (error) {
    // Manejar el error adecuadamente
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof BadRequestError) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    // Manejar otros errores no especificados
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  login,
};
