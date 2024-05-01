const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const profesional = await Profesional.find({});
    const quantity = users.length + profesional.length;

    return res.status(200).json({ quantity, users: users.concat(profesional) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await User.findById(id);
    const findProfesional =
      await Profesional.findById(id).populate('professionalScore');

    return findUser
      ? res.status(200).json({ findUser })
      : findProfesional
        ? res.status(200).json({ findProfesional })
        : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
};
