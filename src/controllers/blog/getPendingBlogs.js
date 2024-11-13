const Blog = require('../../models/blog/Blog');

const getPendingBlogs = async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ isApproved: 'Pending' });

    if (pendingBlogs.length === 0) {
      return res
        .status(200)
        .json({ message: 'No hay blogs pendientes de aprobación.' });
    }

    return res.status(200).json(pendingBlogs);
  } catch (error) {
    console.error('Error al obtener blogs pendientes:', error);
    return res
      .status(500)
      .json({ message: 'Error al obtener blogs pendientes' });
  }
};

module.exports = { getPendingBlogs };
