const { NotFoundError } = require('#src/util/errors');
const Blog = require('#src/models/blog/Blog');
const Comment = require('#src/models/blog/Comment');

const updateBlogRating = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new NotFoundError('Blog no encontrado');

  const blogComments = await Comment.find({ blog: blogId });

  if (blogComments.length === 0) {
    blog.avg_rating = 0;
  } else {
    let sum = 0;
    blogComments.forEach((c) => (sum += c.rating));
    let avg = sum / blogComments.length;
    blog.avg_rating = parseFloat(avg.toFixed(2));
  }

  await blog.save();
};

module.exports = {
  updateBlogRating,
};
