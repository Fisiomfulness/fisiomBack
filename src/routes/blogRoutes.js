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
} = require('../controllers/index');
const comment = require('./commentRoutes.js');
const { upload } = require('../config/multerConfig.js');
const { asyncHandler } = require('../util/asyncHandler');
/* const authAll = require('../middleware/authAll'); */
const { adminAuthMiddleware } = require('../middleware/adminMiddleware.js');
const { errorMiddleware } = require('../middleware/errorMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { blogSchema } = require('../util/validationSchemas');

const router = Router();

//comments
router.use('/comments', comment);

// router.post('/create', adminAuthMiddleware, upload, createBlog);
router.post(
  '/create',
  validationMiddleware(blogSchema),
  asyncHandler(createBlog),
);

// router.put('/update/:id', adminAuthMiddleware, validationMiddleware(blogSchema), asyncHandler(updateBlog));
router.put(
  '/update/:id',
  validationMiddleware(blogSchema, 'update'),
  asyncHandler(updateBlog),
);

// router.patch('/status/:id', adminAuthMiddleware, asyncHandler(statusBlog));
router.patch('/status/:id', asyncHandler(statusBlog));

// router.delete('/delete/:id', adminAuthMiddleware, asyncHandler(deleteBlog));
router.delete('/delete/:id', asyncHandler(deleteBlog));

router.use(errorMiddleware);

module.exports = router;
