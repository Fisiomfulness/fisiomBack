const Comment = require('../../models/Comment');


const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) throw new Error('the comment does not exist');

    return res.status(200).json({ message: `Comment ${id} deleted` });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  deleteComment
}