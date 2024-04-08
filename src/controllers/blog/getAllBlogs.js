const Blog = require('../../models/Blog');

const getAllBlogs = async (req, res) => {
  const { title } = req.query;
  try {
    const blogs = await Blog.find({ status: true }).populate('type_id');

    if (!title) return res.status(200).json({ blogs });

    const blogFilter = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!blogFilter.length) throw new Error('no blog found');

    return res.status(200).json({ blogFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getAllBlogs
}