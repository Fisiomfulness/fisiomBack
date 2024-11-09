const Blog = require('../../models/blog/Blog');
const { sendBlogRejectionNotification } = require('../mail/declineBlogNotification');

const declineBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).populate('createdBy', 'email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog no encontrado' });
    }

    blog.isApproved = 'Rejected';
    await blog.save();

    await sendBlogRejectionNotification(blog.createdBy.email, blog.title, blog.createdBy.name);

    return res
      .status(200)
      .json({ message: 'Blog rechazado con éxito', blog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { declineBlog };
