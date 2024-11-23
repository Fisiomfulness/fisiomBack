const { BadRequestError } = require('../../util/errors');
const Blog = require('../../models/blog/Blog');
const Profesional = require('../../models/profesional/Profesional');

const LIMIT_BLOGS = 30;

const getAllBlogs = async (req, res) => {
  // * by default gets latest blogs published
  const {
    page = 1,
    limit = LIMIT_BLOGS,
    professionalId,
    sortBy = 'createdDate',
    order = 'desc',
    search = '',
    status, // ? undefined = all blogs
  } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('page and limit must be integers');
  }

  const queryLimit =
    limitInt <= 0 ? LIMIT_BLOGS : Math.min(limitInt, LIMIT_BLOGS);
  const skipIndex = (pageInt - 1) * queryLimit;
  let query = { isApproved: 'Approved' };
  let sortOptions = {};

  if (status) {
    if (status !== 'true' && status !== 'false') {
      throw new BadRequestError(
        'invalid received status - must be true or false',
      );
    }
    query.status = status === 'true'; // ? Return a boolean
  }
  if (professionalId) query.createdBy = professionalId;
  if (search.trim() !== '') {
    query.title = { $regex: new RegExp(search, 'i') };
  }

  // ? moongose sort => field: 1 or -1
  sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

  const blogs = await Blog.find(query)
    .sort({ ...sortOptions, _id: 1 })
    .skip(skipIndex)
    .limit(queryLimit)
    .populate('createdBy', 'name image')
    .populate('type', 'name');

  const totalBlogs = await Blog.countDocuments(query);
  const totalPages = Math.ceil(totalBlogs / queryLimit);

  res.status(200).json({ blogs, page: pageInt, totalPages });
};

module.exports = {
  getAllBlogs,
};
