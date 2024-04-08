const { cloudinary } = require('../../config/cloudinaryConfig');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    if (id === '64c2d44f61cc7d6cec9d2abb') throw new Error('Dont remove admin');
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('the user does not exist');
    await cloudinary.uploader.destroy(user.id_image);
    await Comment.deleteMany({ user_id: id });

    return res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  deleteUser
}