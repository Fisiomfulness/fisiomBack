const { NotFoundError } = require('#src/util/errors');
const Blog = require('../../models/Blog');

const createBlog = async (req, res) => {
  const { professional_id, type_id } = req.validatedBody;

  const newData = { ...req.validatedBody, createdBy: professional_id, type: type_id };
  const blog = new Blog(newData);
  await blog.save();

  res.status(201).json({ blog, message: 'blog created successfully' });
};

module.exports = {
  createBlog,
};
