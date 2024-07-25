const Profesional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');

const getAllUsers = async (req, res) => {
  try {
    let totalUsers = null;
    await Promise.allSettled([User.find({}), Profesional.find({})]).then(
      (settElements) => {
        const usersMap = settElements.map((setElement) => setElement.value);
        totalUsers = usersMap[0].concat(usersMap[1]);
      },
    );

    return res
      .status(200)
      .json({ quantity: totalUsers.length, users: totalUsers });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
};
