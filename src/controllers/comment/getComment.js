const Comment = require('../../models/Comment');

const getComment = async (req, res) => {
  const { blog_id } = req.query;
  try {
    const propertiesUser = 'username image firstname lastname';
    const comments = await Comment.find().populate('user_id', propertiesUser);

    if (!blog_id) return res.status(200).json({ comments });
    const commentFilter = comments.filter((comment) => comment.blog_id === blog_id);
    if (!commentFilter.length)
      throw new Error('The comment with that ID was not found');

    return res.status(200).json({ commentFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getComment
}