const Blog = require('#src/models/blog/Blog');
const Comment = require('#src/models/blog/Comment');
const User = require('#src/models/user/User');

const createComment = async (req, res) => {
  const { content, rating, sender_id, blog_id } = req.body;
  try {
    const user = await User.findById(sender_id);
    if (!user) return res.status(404).json({ message: 'user not found' });

    const blog = await Blog.findById(blog_id);
    if (!blog) return res.status(404).json({ message: 'blog not found' });

    const newComment = new Comment({
      content,
      rating,
      sender: sender_id,
      blog: blog_id,
    });
    await newComment.save();
    await newComment.populate('sender', 'name image');

    // * update avg_rating of the blog
    const blogComments = await Comment.find({ blog: blog_id, status: true });
    let sum = 0;
    blogComments.forEach((c) => (sum += c.rating));
    let avg = sum / blogComments.length;
    await Blog.updateOne(
      { _id: blog_id },
      { avg_rating: parseFloat(avg.toFixed(2)) },
    );

    res
      .status(200)
      .json({ newComment, message: 'comment created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createComment,
};
