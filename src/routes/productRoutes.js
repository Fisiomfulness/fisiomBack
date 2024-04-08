const { Router } = require('express');
const {
  createProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
  statusProduct,
  deleteProduct,
  removeProduct
} = require('../controllers/index');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware');
const { upload } = require('../config/multerConfig');

const router = Router();

router.post('/create', adminAuthMiddleware, upload, createProduct);
router.get('/', getAllProduct);
router.get('/detail/:id', getProductDetail);
router.put('/update/:id', adminAuthMiddleware, upload, updateProduct);
router.patch('/status/:id', adminAuthMiddleware, statusProduct);
router.delete('/delete/:id', adminAuthMiddleware, deleteProduct);
router.get('/removed', removeProduct);

module.exports = router;
