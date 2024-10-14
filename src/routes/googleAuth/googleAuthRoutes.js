const express = require('express');
const passport = require('passport');
const axios = require('axios');
const crypto = require('crypto');
const User = require('#src/models/user/User');
const router = express.Router();

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
      `redirect_uri=http://localhost:3000/api/auth/google/callback&` +
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

  console.log('Código recibido:', code);
  console.log('Code Verifier desde sesión:', code_verifier);

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/api/auth/google/callback',
      grant_type: 'authorization_code',
      code_verifier,
    });

    const { access_token } = response.data;

    // Obtener la información del perfil del usuario
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const userProfile = userInfoResponse.data;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: userProfile.email });

    if (!user) {
      user = new User({
        email: userProfile.email,
        name: userProfile.name,
        password: '', // Dejar vacío, ya que no hay contraseña
        birthDate: '', // Puedes dejarlo vacío o agregar lógica para obtenerlo
        gender: 'Prefiero no responder', // Asigna un valor por defecto
        confirmEmail: true,
        image: userProfile.picture,
        address: {},
        authProvider: 'google',
      });
      await user.save();
      console.log('Usuario guardado:', user);
    } else {
      user.name = userProfile.name;
      user.image = userProfile.picture;
      await user.save();
      console.log('Usuario actualizado:', user);
    }

    // Redirigir al frontend
    res.redirect('http://localhost:3001');
  } catch (error) {
    console.error(
      'Error al intercambiar el código o al obtener la información del usuario:',
      error.response ? error.response.data : error.message,
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
