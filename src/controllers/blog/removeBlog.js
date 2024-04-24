const Blog = require('../../models/Blog');

const removeBlog = async (req, res) => {
  const removedBlogs = await Blog.find({ status: false })
    .populate('createdBy', 'name image')
    .populate('type', 'name');

  res.status(200).json({ removedBlogs });
};

module.exports = {
  removeBlog,
};
