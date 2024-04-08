const { Router } = require('express');
const {
  createComment,
  getComment,
  getCommentBlog,
  deleteComment,
} = require('../controllers/index');

const router = Router();

router.post('/create', createComment);
router.get('/', getComment);
router.get('/blog/:id', getCommentBlog);

router.delete('/delete/:id', deleteComment);

module.exports = router;
