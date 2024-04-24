const { BadRequestError, NotFoundError } = require('../../util/errors');
const Comment = require('../../models/Comment');
const Blog = require('../../models/Blog');

const LIMIT_COMMENTS = 30;

const getCommentBlog = async (req, res) => {
  const blog_id = req.params.id;
  if (!(await Blog.findById(blog_id)))
    throw new NotFoundError('blog not found');

  const { offset = 0, limit = LIMIT_COMMENTS } = req.query;
  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt))
    throw new BadRequestError('offset and limit must be integers');

  if (limitInt > LIMIT_COMMENTS) throw new BadRequestError('limit exceeded');

  const totalComments = await Comment.countDocuments({ blog: blog_id });
  const comments = await Comment.find({ blog: blog_id })
    .sort({ createdDate: -1 })
    .skip(offsetInt)
    .limit(limitInt)
    .populate('sender', 'name image');

  res.status(200).json({ comments, totalComments });
};

module.exports = {
  getCommentBlog,
};
