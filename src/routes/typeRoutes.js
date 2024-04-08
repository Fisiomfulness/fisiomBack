const { Router } = require('express');
const {
  createType,
  getTypes,
  getTypeById,
  deleteType
} = require('../controllers/index');

const router = Router();

router.post('/create', createType);
router.get('/', getTypes);
router.get('/:id', getTypeById);
router.delete('/delete/:id', deleteType);

module.exports = router;
