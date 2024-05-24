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
const { commentSchema } = require('../util/validations');

const roles = require('../util/roles');
const authAll = require('../middleware/authAll');
const permit = require('../middleware/rolesMiddleware');
const router = Router();

router.get('/', asyncHandler(getComment));
router.get('/blog/:id', asyncHandler(getCommentBlog));

router.use(authAll);

router.post(
  '/create',
  permit(roles.USER, roles.SUPER_ADMIN),
  validationMiddleware(commentSchema),
  asyncHandler(createComment)
);

router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(deleteComment)
);

router.use(errorMiddleware);

module.exports = router;
