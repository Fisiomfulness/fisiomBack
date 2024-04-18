const Blog = require('../../models/Blog');

const LIMIT_BLOGS = 30;

const getAllBlogs = async (req, res) => {
  // * by default gets latest blogs published
  const {
    page = 1,
    limit = LIMIT_BLOGS,
    sortBy = 'createdDate',
    order = 'desc',
    search = '',
  } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
    return res.status(400).json({ message: 'page and limit must be integers' });
  }
  if(limitInt > LIMIT_BLOGS) return res.status(400).json({ message: 'limit exceeded' });

  try {
    const skipIndex = (pageInt - 1) * limitInt;
    let query = { status: true };
    let sortOptions = {};

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
};
