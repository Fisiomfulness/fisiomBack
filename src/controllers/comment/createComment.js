const { NotFoundError } = require('../../util/errors');
const Comment = require('../../models/Comment');
const Blog = require('../../models/Blog');

const createComment = async (req, res) => {
  const { sender_id, blog_id } = req.validatedBody;

  const newComment = new Comment({ ...req.validatedBody, sender: sender_id, blog: blog_id });
  await newComment.save();
  await newComment.populate('sender', 'name image');

  // * update avg_rating of the blog
  const blogComments = await Comment.find({ blog: blog_id, status: true });
  let sum = 0;
  blogComments.forEach((c) => (sum += c.rating));
  let avg = sum / blogComments.length;

  await Blog.updateOne(
    { _id: blog_id },
    { avg_rating: parseFloat(avg.toFixed(2)) }
  );

  res.status(201).json({ newComment, message: 'comment created successfully' });
};

module.exports = {
  createComment,
};
