const { Router } = require('express');
const {
  createBlog,
  getAllBlogs,
  getProfessionalBlogs,
  getBlogDetail,
  updateBlog,
  statusBlog,
  deleteBlog,
  removeBlog,
  approveBlog,
  declineBlog,
  getPendingBlogs,
} = require('../../controllers/index');
const comment = require('./commentRoutes.js');
const { asyncHandler } = require('../../util/asyncHandler');
const { errorMiddleware } = require('../../middleware/errorMiddleware');
const {
  validationMiddleware,
} = require('../../middleware/validationMiddleware');
const { upload } = require('#src/config/multerConfig');
const { blogSchema } = require('../../util/validations');

const roles = require('../../util/roles');
const authAll = require('../../middleware/authAll');
const permit = require('../../middleware/rolesMiddleware');

const router = Router();

//comments
router.use('/comments', comment);

router.get('/', asyncHandler(getAllBlogs));
router.get('/detail/:id', asyncHandler(getBlogDetail));

// ? Routes below are authenticated
router.use(authAll);

router.get(
  '/:professionalId',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(getProfessionalBlogs),
);
router.get(
  '/removed',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(removeBlog),
);

router.post(
  '/create',
  permit(roles.PROFESSIONAL),
  upload,
  validationMiddleware(blogSchema),
  asyncHandler(createBlog),
);

router.put(
  '/update/:id',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  upload,
  validationMiddleware(blogSchema, 'update'),
  asyncHandler(updateBlog),
);

// Ruta para que el administrador apruebe un blog
router.patch(
  '/approve/:blogId',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  approveBlog,
);

// Ruta para que el administrador desapruebe un blog
router.patch(
  '/disapprove/:blogId',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  declineBlog,
);

// Ruta para obtener blogs pendientes de aprobación
router.get(
  '/pending',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  getPendingBlogs,
);

router.patch(
  '/status/:id',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(statusBlog),
); // ? Logical delete

router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(deleteBlog),
); // ? Permanent delete

router.use(errorMiddleware);

module.exports = router;
