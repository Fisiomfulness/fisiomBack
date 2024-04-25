const Blog = require('#src/models/Blog');
const Comment = require('#src/models/Comment');

const LIMIT_COMMENTS = 30;

const getCommentBlog = async (req, res) => {
  const blog_id = req.params.id;
  if (!(await Blog.findById(blog_id)))
    return res.status(404).json({ message: 'blog not found' });

  const { offset = 0, limit = LIMIT_COMMENTS } = req.query;
  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt))
    return res
      .status(400)
      .json({ message: 'offset and limit must be integers' });

  if (limitInt > LIMIT_COMMENTS)
    return res.status(400).json({ message: 'limit exceeded' });

  try {
    const totalComments = await Comment.countDocuments({ blog: blog_id });
    const comments = await Comment.find({ blog: blog_id })
      .sort({ createdDate: -1 })
      .skip(offsetInt)
      .limit(limitInt)
      .populate('sender', 'name image');

    res.status(200).json({ comments, totalComments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentBlog,
};
