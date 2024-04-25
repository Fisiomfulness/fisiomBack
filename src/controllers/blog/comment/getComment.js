const Comment = require('#src/models/Comment');

const getComment = async (req, res) => {
  try {
    const comments = await Comment.find().populate('sender', 'name image');
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getComment,
};
