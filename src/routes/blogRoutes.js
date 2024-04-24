const { Router } = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogDetail,
  updateBlog,
  statusBlog,
  deleteBlog,
  removeBlog,
} = require('../controllers/index');
const comment = require('./commentRoutes.js');
const { upload } = require('../config/multerConfig.js');
/* const authAll = require('../middleware/authAll'); */
const { adminAuthMiddleware } = require('../middleware/adminMiddleware.js');

const router = Router();

//comments
router.use('/comments', comment);

// router.post('/create', adminAuthMiddleware, upload, createBlog);
router.post('/create', upload, createBlog);
router.get('/', getAllBlogs);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', adminAuthMiddleware, upload, updateBlog);
router.patch('/status/:id', adminAuthMiddleware, statusBlog);

router.delete('/delete/:id', adminAuthMiddleware, deleteBlog);
router.get('/removed', removeBlog);

module.exports = router;
