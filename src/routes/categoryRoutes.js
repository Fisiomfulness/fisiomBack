const { Router } = require('express');
const {
  createCategory,
  getCategorys,
  getCategoryById,
  deleteCategory
} = require('../controllers/index');

const router = Router();

router.post('/create', createCategory);
router.get('/', getCategorys);
router.get('/:id', getCategoryById);
router.delete('/delete/:id', deleteCategory);

module.exports = router;