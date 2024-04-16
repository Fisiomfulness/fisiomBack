const Blog = require('../../models/Blog');

const getBlogDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate('createdBy', 'name image')
      .populate('type', 'name');
    if (!blog) throw new Error('blog not found');
    res.status(200).json({ blog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBlogDetail,
};
