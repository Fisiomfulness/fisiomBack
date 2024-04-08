const Blog = require('../../models/Blog');

const getBlogDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).populate('type_id', 'name');
    //console.log('ENTRY', { blog });
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getBlogDetail
}