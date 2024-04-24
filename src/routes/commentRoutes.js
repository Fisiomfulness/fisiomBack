const { Router } = require('express');
const {
  createComment,
  getComment,
  getCommentBlog,
  deleteComment,
} = require('../controllers/index');
const { asyncHandler } = require('../util/asyncHandler');
const { errorMiddleware } = require('../middleware/errorMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { commentSchema } = require('../util/validationSchemas');

const router = Router();

router.get('/', asyncHandler(getComment));
router.get('/blog/:id', asyncHandler(getCommentBlog));

router.post('/create', validationMiddleware(commentSchema), asyncHandler(createComment));

router.delete('/delete/:id', asyncHandler(deleteComment));

router.use(errorMiddleware);

module.exports = router;
