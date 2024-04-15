const Blog = require('../../models/Blog');

const getAllBlogs = async (req, res) => {
  // * Important => by default gets latest blogs published
  const { page = 1, limit = 999, sortBy = 'createdDate', order = 'desc' } = req.query;

  if(!Number.isInteger(Number(page)) || !Number.isInteger(Number(limit))) {
    return res.status(400).json({ message: 'page and limit must be integers'});
  }

  try {
    const skipIndex = (page - 1) * limit;
    let query = { status: true };
    let sortOptions = {};

    // ? moongose sort => field: 1 or -1
    sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    const blogs = await Blog.find(query)
      .sort({...sortOptions, _id: 1})
      .skip(skipIndex)
      .limit(limit)
      .populate('createdBy', 'name image')
      .populate('type', 'name');

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);
    res.status(200).json({ blogs, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
};
