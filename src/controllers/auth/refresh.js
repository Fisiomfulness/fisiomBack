const { JWT_SECRET, JWT_SECRET_REFRESH } = require('#src/config/envConfig');
const jwt = require('jsonwebtoken');
const User = require('#src/models/user/User');
const Professional = require('#src/models/profesional/Profesional');
const { NotFoundError } = require('#src/util/errors'); // Asegúrate de tener esto

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh Token recibido:", refreshToken); // Supongamos que el refresh token está en una cookie segura

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }
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
        const newRefreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET_REFRESH, { expiresIn: '7d' });
        const tokenExpiresInSeg = 60*60
        const refreshExpiresInSeg = 60 * 60 * 24 * 7

        // Configurar cookie para el access token
        res.cookie('accessToken', token, {
            maxAge: 1000 * tokenExpiresInSeg, 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.cookie('refreshToken', newRefreshToken, { 
            maxAge: 1000 * refreshExpiresInSeg, 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({ accessToken: token, refreshToken: newRefreshToken, tokenExpiresInSeg: tokenExpiresInSeg, refreshExpiresInSeg:refreshExpiresInSeg  });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}

module.exports = { refreshToken };
