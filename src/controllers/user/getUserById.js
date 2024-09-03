const { findUserById } = require('#src/services/userService');
const Profesional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');

const getUserById = async (req, res) => {
  const { id } = req.params;

  const foundUser = await findUserById(id);

  if (foundUser instanceof User) {
    await foundUser.populate('interests', 'name');
  }

  res.status(200).json({ foundUser });
};

module.exports = { getUserById };
