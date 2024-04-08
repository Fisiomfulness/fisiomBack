const Comment = require('../../models/Comment');

const createComment = async (req, res) => {
  const { user_id, content, blog_id } = req.body;
  const newData = { user_id, content, blog_id };
  try {
    const propertiesUser = 'username image firstname lastname';
    const newComment = new Comment(newData);
    await newComment.save();
    const comment = await Comment.findById(newComment.id).populate(
      'user_id',
      propertiesUser
    );
    return res
      .status(200)
      .json({ comment, message: 'comment created successfully' });
  } catch (error) {
    //console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createComment
}