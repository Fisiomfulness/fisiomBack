const User = require("#src/models/user/User");
const Professional = require("#src/models/profesional/Profesional");
const bcrypt = require("bcryptjs");

const changePassword = async (req, res) => {
    try {
        const { token, email, password } = req.body;

        // Buscar al usuario con email y token
        const [user, professional] = await Promise.all([
            User.findOne({ email, resetPasswordToken: token }),
            Professional.findOne({ email, resetPasswordToken: token }),
        ]);

        const foundUser = user || professional;

        if (!foundUser || foundUser.resetPasswordExpiry < Date.now()) {
            throw new Error("Token inválido o expirado");
        }

        // Cambiar la contraseña y limpiar el token
        const hashedPassword = await bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;
        foundUser.resetPasswordToken = null;
        foundUser.resetPasswordExpiry = null;

        await foundUser.save();

        return res.status(200).json({ message: "Contraseña cambiada con éxito" });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error.message);
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { changePassword };
