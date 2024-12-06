const express = require('express');
const passport = require('passport');
const axios = require('axios');
const crypto = require('crypto');
const User = require('#src/models/user/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_SECRET_REFRESH } = require('#src/config/envConfig');
// Ruta para redirigir a Google para autenticación
router.get('/google', (req, res) => {
  const code_verifier = crypto.randomBytes(32).toString('hex');
  const code_challenge = crypto
    .createHash('sha256')
    .update(code_verifier)
    .digest('base64url');

  req.session.code_verifier = code_verifier;

  console.log('Sesión antes de redirigir a Google:', req.session);

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${process.env.BACK_URL}/api/auth/google/callback&` +
      `response_type=code&` +
      `scope=email profile&` +
      `code_challenge=${code_challenge}&` +
      `code_challenge_method=S256`,
  );
});


// Ruta donde Google redirigirá después de la autenticación
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const code_verifier = req.session.code_verifier;
  if (!code_verifier) {
    console.error('El code_verifier no está disponible en la sesión');
    return res.status(400).json({ message: 'Error con la sesión: code_verifier no encontrado' });
  }

  console.log('Código recibido:', code);
  console.log('Code Verifier desde sesión:', code_verifier);

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BACK_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
      code_verifier,
    });

    const { access_token } = response.data;
    if (!access_token) {
      console.error('No se recibió el access_token');
      return res.status(500).json({ message: 'Error al obtener el token de acceso' });
    }

    // Obtener la información del perfil del usuario
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userProfile = userInfoResponse.data;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: userProfile.email });

    if (!user) {
      // Crear un nuevo usuario si no existe
      user = new User({
        email: userProfile.email,
        name: userProfile.name,
        password: '', // No hay contraseña
        birthDate: '', // Opcional
        gender: 'Prefiero no responder', // Defecto
        confirmEmail: true,
        image: userProfile.picture,
        authProvider: 'google',
      });
      await user.save();
      console.log('Nuevo usuario guardado:', user);
    } else {
      // Actualizar el usuario si ya existe
      user.name = userProfile.name;
      user.image = userProfile.picture;
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
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET_REFRESH, { expiresIn: '7d' });

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

    // Redirigir al frontend
    res.redirect(`${process.env.FRONT_URL}`);
    console.log('Redirigiendo al front-end...');

  } catch (error) {
    console.error('Error al intercambiar el código o al obtener la información del usuario:', error.response ? error.response.data : error.message);
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
