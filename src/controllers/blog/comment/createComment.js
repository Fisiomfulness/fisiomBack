const { BadRequestError } = require('#src/util/errors');
const { updateBlogRating } = require('#src/services/blogService');
const Comment = require('#src/models/Comment');

const createComment = async (req, res) => {
  const { content, rating, sender_id, blog_id } = req.validatedBody;

  const existingComment = await Comment.findOne({
    sender: sender_id,
    blog: blog_id,
  });
  if (existingComment) {
    throw new BadRequestError('Ya le has dejado un comentario a este blog');
  }

  const newComment = new Comment({
    content,
    rating,
    sender: sender_id,
    blog: blog_id,
  });
  await newComment.save();
  await newComment.populate('sender', 'name image');

  await updateBlogRating(blog_id);

  res
    .status(201)
    .json({ newComment, message: 'Comentario añadido correctamente' });
};

module.exports = {
  createComment,
};
