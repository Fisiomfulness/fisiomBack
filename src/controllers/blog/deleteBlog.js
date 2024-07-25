const { NotFoundError } = require('../../util/errors');
const { cloudinary } = require('../../config/cloudinaryConfig');
const Blog = require('../../models/blog/Blog');

// * Permanent delete - removing the image from cloudinary
const deleteBlog = async (req, res) => {
  const id = req.params.id;

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new NotFoundError('blog not found');
  await cloudinary.uploader.destroy(blog.id_image);

  res.status(200).json({ message: 'blog has been deleted' });
};

module.exports = {
  deleteBlog,
};
