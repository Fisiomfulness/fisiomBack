const Comment = require('#src/models/Comment');

const checkUserComment = async (req, res) => {
  const { blogId, userId } = req.params;

  const existingComment = await Comment.findOne({
    sender: userId,
    blog: blogId,
  });

  res.status(200).json({ result: existingComment, hasCommented: !!existingComment });
};

module.exports = { checkUserComment };
