const Blog = require('../../models/blog/Blog');
const { sendBlogNotification } = require('../mail/sendBlogNotification');


const declineBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).populate('createdBy', 'email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog no encontrado' });
    }

    blog.isApproved = 'Rejected';
    await blog.save();

    await sendBlogNotification(blog.createdBy.email, blog.title, blog.createdBy.name, blog.isApproved);

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

