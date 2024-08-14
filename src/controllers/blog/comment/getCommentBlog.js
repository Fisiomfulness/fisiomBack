const { BadRequestError, NotFoundError } = require('#src/util/errors');
const Blog = require('#src/models/Blog');
const Comment = require('#src/models/Comment');

const LIMIT_COMMENTS = 30;

const getCommentBlog = async (req, res) => {
  const blogId = req.params.blogId;
  if (!(await Blog.findById(blogId))) throw new NotFoundError('Blog no encontrado');

  const { offset = 0, limit = LIMIT_COMMENTS } = req.query;
  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt)){
    throw new BadRequestError('"offset" y "limit" deben ser enteros');
  }

  const queryLimit = limitInt > LIMIT_COMMENTS ? LIMIT_COMMENTS : limitInt;
  const totalComments = await Comment.countDocuments({ blog: blogId });
  const comments = await Comment.find({ blog: blogId })
    .sort({ createdDate: -1 })
    .skip(offsetInt)
    .limit(queryLimit)
    .populate('sender', 'name image');

  res.status(200).json({ comments, totalComments });
};

module.exports = {
  getCommentBlog,
};
