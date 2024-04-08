const Blog = require('../../models/Blog');

const removeBlog = async (req, res) => {
  try {
    const blogRemoved = await Blog.find({ status: false }).populate('type_id', 'name');

    return res.status(200).json({ blogRemoved });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  removeBlog
}