const User = require('../../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).populate('specialty');
    if (!users.length) throw new Error('No se encontró ningún usuario');

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers
};
