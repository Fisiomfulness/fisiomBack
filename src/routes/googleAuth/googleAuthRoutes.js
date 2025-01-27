const express = require('express');
const User = require('#src/models/user/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_SECRET_REFRESH } = require('#src/config/envConfig');
// Ruta para redirigir a Google para autenticación

// Ruta donde Google redirigirá después de la autenticación
router.post('/callback', async (req, res) => {
  const googleUser = req.body;
  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Crear un nuevo usuario si no existe
      user = new User({
        email: googleUser.email,
        name: googleUser.name,
        password: '', // No hay contraseña
        birthDate: '', // Opcional
        gender: 'Prefiero no responder', // Defecto
        confirmEmail: googleUser.email_verified,
        image: googleUser.picture,
        authProvider: 'google',
        role: 'user',
      });
      await user.save();
      //console.log("Nuevo usuario guardado:", user);
    } else {
      // Actualizar el usuario si ya existe
      user.name = googleUser.name;
      user.image = googleUser.picture; //consultar como manejar esto.
      user.authProvider = 'google';
      await user.save();
      console.log('Usuario actualizado:', user);
    }

    // Crear los JWTs
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
    const refreshTokenPayload = {
      id: user._id,
      email: user.email, // Opcional
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET_REFRESH, {
      expiresIn: '7d',
    });

    // Configurar las cookies
    res.cookie('accessToken', token, {
      maxAge: 1000 * 60, // 1 minuto
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ ...payload, message: 'Logeado con éxito!' });
  } catch (error) {
    console.error(
      'Error al intercambiar el código o al obtener la información del usuario:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: 'Error al autenticarse con Google' });
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
