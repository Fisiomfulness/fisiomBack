const Comment = require('#src/models/Comment');

const getComment = async (req, res) => {
  const comments = await Comment.find().populate('sender', 'name image');
  res.status(200).json({ comments });
};

module.exports = {
  getComment,
};
