const Router = require('express-promise-router').default;
const router = Router();

const {
  checkUserComment,
  createComment,
  getComment,
  getCommentBlog,
  deleteComment,
} = require('../controllers/index');
const { errorMiddleware } = require('../middleware/errorMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { commentSchema } = require('../util/validations');

const roles = require('../util/roles');
const authAll = require('../middleware/authAll');
const permit = require('../middleware/rolesMiddleware');

router.get('/', getComment);
router.get('/:blogId', getCommentBlog);
router.get(`/:blogId/:userId/hasCommented`, checkUserComment);

router.use(authAll);

router.post(
  '/create',
  permit(roles.USER, roles.SUPER_ADMIN),
  validationMiddleware(commentSchema),
  createComment
);

// ? Si se añade la funcionalidad de que el usuario elimine su comentario anterior...
// ? Agregar también permiso a role.USER
router.delete(
  '/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteComment
);

router.use(errorMiddleware);

module.exports = router;
