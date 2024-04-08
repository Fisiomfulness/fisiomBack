const User = require('../../models/User');

const statusUser = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error('the blog does not exist');

    user.status = status;
    await user.save();

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  statusUser
}