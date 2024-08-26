const { NotFoundError } = require('../../util/errors');
const Blog = require('../../models/blog/Blog');

const getBlogDetail = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id)
    .populate('createdBy', 'name image')
    .populate('type', 'name');
  if (!blog) throw new NotFoundError('blog not found');

  res.status(200).json({ blog });
};

module.exports = {
  getBlogDetail,
};
