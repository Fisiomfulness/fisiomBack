const { JWT_SECRET, JWT_SECRET_REFRESH } = require('#src/config/envConfig');
const jwt = require('jsonwebtoken');
const User = require('#src/models/user/User');
const Professional = require('#src/models/profesional/Profesional');
const { NotFoundError } = require('#src/util/errors'); // Asegúrate de tener esto

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Supongamos que el refresh token está en una cookie segura

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    // Verificación del refresh token y generación de un nuevo access token
    try {
        const payload = jwt.verify(refreshToken, JWT_SECRET_REFRESH);

        const [user, professional] = await Promise.all([
            User.findOne({ email: payload.email }), // Corrección aquí
            Professional.findOne({ email: payload.email }), // Corrección aquí
        ]);

        const foundUser = user || professional;

        // Si no se encontró el usuario o profesional
        if (!foundUser) {
            throw new NotFoundError('Usuario no encontrado');
        }

        const tokenPayload = {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            image: foundUser.image,
            role: foundUser.role,
            coordinates: foundUser.coordinates,
        };

        const refreshTokenPayload = {
            id: foundUser._id,
            email: foundUser.email, // Opcional
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1m' });
        const newRefreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET_REFRESH, { expiresIn: '7d' }); // Renombrado para evitar confusión

        // Configurar cookie para el access token
        res.cookie('accessToken', token, {
            maxAge: 1000 * 60, // 1 minuto
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Configurar cookie para el refresh token
        res.cookie('refreshToken', newRefreshToken, { // Renombrado aquí también
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Enviar respuesta
        res.json({ accessToken: token, refreshToken: newRefreshToken, expiresIn: '60s'  });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}

module.exports = { refreshToken };
