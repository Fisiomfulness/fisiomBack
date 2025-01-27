const User = require('#src/models/user/User');
const bcrypt = require('bcrypt');

const updateGooglePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  console.log('google password', id, password, req.body);
  try {
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida.' });
    }

    const user = await User.findById(id);

    if (!user)
      return res.status(400).json({ message: 'Usuario no encontrado.' });

    if (user.password !== '')
      return res.status(400).json({ message: 'Usuario no autorizado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Contraseña actualizada correctamente.',
      user,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'Ocurrió un error al actualizar la contraseña.' });
  }
};

module.exports = {
  updateGooglePassword,
};
