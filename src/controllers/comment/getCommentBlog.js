const Comment = require('../../models/Comment');

const getCommentBlog = async (req, res) => {
  const blog_id = req.params.id;
  try {
    const comments = await Comment.find({ blog: blog_id }).populate('sender', "name image");
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getCommentBlog,
};
