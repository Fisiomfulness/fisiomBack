const Blog = require('../../models/Blog');

const statusBlog = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('the blog does not exist');

    blog.status = status;
    await blog.save();

    return res
      .status(200)
      .json({ message: `the blog with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  statusBlog
}