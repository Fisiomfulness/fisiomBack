const { BadRequestError } = require('../../util/errors');
const Blog = require('../../models/Blog');
const Profesional = require('../../models/Profesional');

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
  } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('page and limit must be integers');
  }
  if (limitInt > LIMIT_BLOGS) throw new BadRequestError('limit exceeded');

  const skipIndex = (pageInt - 1) * limitInt;
  let query = { status: true };
  let sortOptions = {};

  if (professionalId) query.createdBy = professionalId;
  if (search.trim() !== '') {
    query.title = { $regex: new RegExp(search, 'i') };
  }

  // ? moongose sort => field: 1 or -1
  sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

  const blogs = await Blog.find(query)
    .sort({ ...sortOptions, _id: 1 })
    .skip(skipIndex)
    .limit(limitInt)
    .populate('createdBy', 'name image')
    .populate('type', 'name');

  const totalBlogs = await Blog.countDocuments(query);
  const totalPages = Math.ceil(totalBlogs / limitInt);
  
  res.status(200).json({ blogs, page: pageInt, totalPages });
};

module.exports = {
  getAllBlogs,
};
