const { NotFoundError, BadRequestError } = require('../../util/errors');
const Blog = require('../../models/Blog');

// * Logical delete for example
const statusBlog = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status !== 'boolean') throw new BadRequestError('invalid status');
  const blog = await Blog.findById(id);
  if (!blog) throw new NotFoundError('blog not found');
  
  blog.status = status;
  await blog.save();

  res.status(200).json({ message: `blog status has been updated to ${status}` });
};

module.exports = {
  statusBlog,
};
