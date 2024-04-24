const { NotFoundError } = require('../../util/errors');
// const { cloudinary } = require('../../config/cloudinaryConfig');
const Blog = require('../../models/Blog');

const deleteBlog = async (req, res) => {
  const id = req.params.id;

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new NotFoundError('blog not found');

  res.status(200).json({ message: 'blog has been deleted' });
};

module.exports = {
  deleteBlog,
};
