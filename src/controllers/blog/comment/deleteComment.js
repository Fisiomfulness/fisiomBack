const { BadRequestError } = require('#src/util/errors');
const { updateBlogRating } = require('#src/services/blogService');
const Comment = require('#src/models/blog/Comment');

const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) throw new BadRequestError('Comentario no encontrado');

  await updateBlogRating(comment.blog);

  res.status(200).json({ message: `Comentario eliminado correctamente` });
};

module.exports = {
  deleteComment,
};
