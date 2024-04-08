const User = require('../../models/User');

const getUser = async (req, res) => {
  const { email } = req.query;
  try {
    const users = await User.find({});
    if (!email) return res.status(200).json({ users });

    const userFilter = users.filter((user) =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
    if (!userFilter.length) throw new Error('user not found');

    return res.status(200).json({ userFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUser
}