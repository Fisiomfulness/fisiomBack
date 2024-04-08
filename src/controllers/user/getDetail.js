const User = require('../../models/User');

const getDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getDetail
}