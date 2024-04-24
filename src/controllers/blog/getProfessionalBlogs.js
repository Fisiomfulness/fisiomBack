const { BadRequestError, NotFoundError } = require('../../util/errors');
const { validateId } = require('../../util/helpers');
const Blog = require('../../models/Blog');

const LIMIT_BLOGS = 30;

// ! TODO = OBTENER CONTEO DE LOS COMMENTARIOS DE CADA BLOG
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
  if (limitInt > LIMIT_BLOGS) throw new BadRequestError('limit exceeded');

  const query = { status: true, createdBy: professionalId };
  const skipIndex = (pageInt - 1) * limitInt;
  const blogs = await Blog.find(query)
    .sort({ createdDate: -1 })
    .skip(skipIndex)
    .limit(limitInt)
    .populate('type', 'name');

  const totalBlogs = await Blog.countDocuments(query);
  const totalPages = Math.ceil(totalBlogs / limitInt);

  res.status(200).json({ blogs, page: pageInt, totalPages });
};

module.exports = {
  getProfessionalBlogs,
};
