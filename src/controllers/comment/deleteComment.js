const { NotFoundError } = require('../../util/errors');
const Comment = require('../../models/Comment');

const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) throw new NotFoundError('the comment does not exist');

  res.status(200).json({ message: `Comment ${id} deleted` });
};

module.exports = {
  deleteComment,
};
