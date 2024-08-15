const { BadRequestError, NotFoundError } = require('../../util/errors');
const { validateId } = require('../../util/helpers');
const Blog = require('../../models/Blog');
const Comment = require('../../models/Comment');

const LIMIT_BLOGS = 30;

const getProfessionalBlogs = async (req, res, next) => {
  const { professionalId } = req.params;
  const { page = 1, limit = LIMIT_BLOGS } = req.query;

  const exist = await validateId(professionalId, 'Profesional');
  if (!exist) throw new BadRequestError('professional not found');

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('page and limit must be integers');
  }

  const queryLimit = limitInt <= 0 ? LIMIT_BLOGS : Math.min(limitInt, LIMIT_BLOGS);
  const query = { status: true, createdBy: professionalId };
  const skipIndex = (pageInt - 1) * queryLimit;
  const blogs = await Blog.find(query)
    .sort({ createdDate: -1 })
    .skip(skipIndex)
    .limit(queryLimit)
    .populate('type', 'name')

  const activeCommentsCounts = await Comment.aggregate([
    { $match: { status: true } },
    { $group: { _id: '$blog', count: { $sum: 1 } } },
  ]);

  // ? add the field activeComments to the professional blogs
  const blogsWithActiveCommentsCount = blogs.map((blog) => {
    const count = activeCommentsCounts.find((item) => item._id.toString() === blog._id.toString())?.count || 0;
    return { ...blog._doc, activeComments: count };
  });

  const totalBlogs = await Blog.countDocuments(query);
  const totalPages = Math.ceil(totalBlogs / queryLimit);

  res.status(200).json({ blogs: blogsWithActiveCommentsCount, page: pageInt, totalPages });
};

module.exports = {
  getProfessionalBlogs,
};
