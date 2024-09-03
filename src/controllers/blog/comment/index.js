const { checkUserComment } = require('./checkUserComment');
const { createComment } = require('./createComment');
const { deleteComment } = require('./deleteComment');
const { getComment } = require('./getComment');
const { getCommentBlog } = require('./getCommentBlog');

module.exports = {
  checkUserComment,
  createComment,
  deleteComment,
  getComment,
  getCommentBlog,
};
