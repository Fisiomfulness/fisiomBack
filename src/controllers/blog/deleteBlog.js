const { cloudinary } = require('../../config/cloudinaryConfig');
const Blog = require('../../models/Blog');

const deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new Error('the blog does not exist');
    await cloudinary.uploader.destroy(blog.id_image);

    return res.status(200).json({ message: 'blog has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  deleteBlog
}