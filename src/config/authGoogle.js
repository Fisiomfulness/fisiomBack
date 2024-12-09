const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('#src/models/user/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACK_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Buscar al usuario por su email
        console.log('Google profile:', profile); // Verifica si recibes el perfil
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          console.log('Creando nuevo usuario');
          // Si el usuario no existe, lo creamos
          user = new User({
            email: email,
            name: profile.displayName,
            password: '', // No hay contraseña porque es autenticación con Google
            birthDate: '', // No se obtiene de Google
            gender: 'Prefiero no responder', // Si Google no proporciona el género
            confirmEmail: true, // Email confirmado por Google
            image: profile.photos[0]?.value || '', // Foto de perfil de Google
          });

          // Guardar el nuevo usuario en la base de datos
          await user.save();
          console.log('Usuario guardado:', user); // Log para verificar
        } else {
          console.log('Usuario existente en la bd:', user);
        }

        // Pasar el usuario a Passport
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Serialización del usuario para mantener la sesión
passport.serializeUser((user, done) => {
  done(null, user.id); // Serializar el ID del usuario
});

// Deserialización del usuario cuando se hace una petición
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Buscar el usuario por ID
    done(null, user); // Pasar el usuario a Passport
  } catch (error) {
    done(error, null);
  }
});
