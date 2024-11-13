const Blog = require('../../models/blog/Blog');
const { sendBlogApprovalNotification } = require('../mail/approveBlogNotification'); 

const approveBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).populate('createdBy'); 

    if (!blog) {
      return res.status(404).json({ message: 'Publicación de blog no encontrada' });
    }

    blog.isApproved = 'Approved';
    await blog.save();

    await sendBlogApprovalNotification(blog.createdBy.email, blog.title, blog.createdBy.name);

    return res
      .status(200)
      .json({ message: 'Blog aprobado con éxito', blog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { approveBlog };
